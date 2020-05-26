"use strict";
import "@babel/polyfill";
import powerbi from "powerbi-visuals-api";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { VisualSettings } from "./settings";

import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import DataView = powerbi.DataView;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IViewport = powerbi.IViewport;

import { ReactClassWrapper, initialState } from "./ReactClassWrapper";

export class Visual implements IVisual {
  private viewport: IViewport;
  private target: HTMLElement;
  private reactRoot: React.ComponentElement<any, any>;
  private visualSettings: VisualSettings;

  constructor(options: VisualConstructorOptions) {
    this.reactRoot = React.createElement(ReactClassWrapper, {});
    this.target = options.element;

    ReactDOM.render(this.reactRoot, this.target);
  }

  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstanceEnumeration {
    const settings: VisualSettings =
      this.visualSettings || <VisualSettings>VisualSettings.getDefault();
    return VisualSettings.enumerateObjectInstances(settings, options);
  }

  public update(options: VisualUpdateOptions) {
    if (options.dataViews && options.dataViews[0]) {
      const dataView: DataView = options.dataViews[0];

      this.visualSettings = VisualSettings.parse<VisualSettings>(dataView);
      this.viewport = options.viewport;
      const { width, height } = this.viewport;

      ReactClassWrapper.update({
        size: { width, height },
        visualSettings: this.visualSettings,
        dataView,
      });
    } else {
      this.clear();
    }
  }

  private clear() {
    ReactClassWrapper.update(initialState);
  }
}
