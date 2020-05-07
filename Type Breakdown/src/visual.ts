"use strict";
import "@babel/polyfill";
import powerbi from "powerbi-visuals-api";
import * as React from "react";
import * as ReactDOM from "react-dom";

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

  constructor(options: VisualConstructorOptions) {
    this.reactRoot = React.createElement(ReactClassWrapper, {});
    this.target = options.element;

    ReactDOM.render(this.reactRoot, this.target);
  }

  public update(options: VisualUpdateOptions) {
    if (options.dataViews && options.dataViews[0]) {
      const dataView: DataView = options.dataViews[0];

      this.viewport = options.viewport;
      const { width, height } = this.viewport;

      const types = dataView.categorical.categories[0].values;
      const typeCountList = dataView.categorical.values[0].values;

      ReactClassWrapper.update({
        size: { width, height },
        countsByType: types.reduce((acc, type, index) => {
          // @ts-ignore
          acc[type] = typeCountList[index];
          return acc;
        }, {}),
      });
    } else {
      this.clear();
    }
  }

  private clear() {
    ReactClassWrapper.update(initialState);
  }
}