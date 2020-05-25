"use strict";
import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";

export class TitleSettings {
  public title: string = "EROAD Visual";
}
export class VisualSettings extends dataViewObjectsParser.DataViewObjectsParser {
  public card_title: TitleSettings = new TitleSettings();
}
