import * as React from "react";

import { EROADChart } from "./EROADChart";

interface State {
  size: { width: number; height: number };
  visualSettings: any;
  dataView: any;
}

const initialState: State = {
  size: { width: 0, height: 0 },
  visualSettings: undefined,
  dataView: undefined,
};

class ReactClassWrapper extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = initialState;
  }

  private static updateCallback: (data: object) => void = null;

  public static update(newState: State) {
    if (typeof ReactClassWrapper.updateCallback === "function") {
      ReactClassWrapper.updateCallback(newState);
    }
  }

  public state: State = initialState;

  public componentWillMount() {
    ReactClassWrapper.updateCallback = (newState: State): void => {
      this.setState(newState);
    };
  }

  public componentWillUnmount() {
    ReactClassWrapper.updateCallback = null;
  }

  render() {
    const { dataView, visualSettings, size } = this.state;

    return dataView && visualSettings ? (
      <EROADChart
        size={size}
        dataView={dataView}
        visualSettings={visualSettings}
      />
    ) : null;
  }
}

export { ReactClassWrapper, initialState, State };
