import * as React from "react";

import { TrendsByType } from "./chart";

interface State {
  size: { width: number; height: number };
  dates: Date[];
  countsByType: {
    [key: string]: number | null;
  };
}

const initialState: State = {
  size: { width: 0, height: 0 },
  dates: [],
  countsByType: {},
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
    const { countsByType, dates, size } = this.state;

    return (
      <TrendsByType dates={dates} countsByType={countsByType} size={size} />
    );
  }
}

export { ReactClassWrapper, initialState, State };
