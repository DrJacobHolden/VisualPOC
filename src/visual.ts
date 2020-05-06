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

import { ReactCircleCard, initialState } from "./component";
import "./../style/visual.less";

export class Visual implements IVisual {
  private viewport: IViewport;
  private target: HTMLElement;
  private reactRoot: React.ComponentElement<any, any>;

  constructor(options: VisualConstructorOptions) {
    this.reactRoot = React.createElement(ReactCircleCard, {});
    this.target = options.element;

    ReactDOM.render(this.reactRoot, this.target);
  }

  public update(options: VisualUpdateOptions) {
    if (options.dataViews && options.dataViews[0]) {
      const dataView: DataView = options.dataViews[0];

      console.log(dataView);

      this.viewport = options.viewport;
      const { width, height } = this.viewport;

      ReactCircleCard.update({
        size: { width, height },
        dates: dataView.categorical.categories[0].values,
      });
    } else {
      this.clear();
    }
  }

  private clear() {
    ReactCircleCard.update(initialState);
  }
}
