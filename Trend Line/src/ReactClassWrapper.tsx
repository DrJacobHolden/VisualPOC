import * as React from "react";

import { ViolationTrend } from "./chart";

interface State {
  size: Object;
  dates: any;
}

const initialState: State = {
  size: { width: 0, height: 0 },
  dates: [],
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
    const { dates, size } = this.state;

    return <ViolationTrend size={size} dates={dates} />;
  }
}

export { ReactClassWrapper, initialState, State };
