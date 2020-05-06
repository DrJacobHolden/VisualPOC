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

class ReactCircleCard extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = initialState;
  }

  private static updateCallback: (data: object) => void = null;

  public static update(newState: State) {
    if (typeof ReactCircleCard.updateCallback === "function") {
      ReactCircleCard.updateCallback(newState);
    }
  }

  public state: State = initialState;

  public componentWillMount() {
    ReactCircleCard.updateCallback = (newState: State): void => {
      this.setState(newState);
    };
  }

  public componentWillUnmount() {
    ReactCircleCard.updateCallback = null;
  }

  render() {
    const { dates, size } = this.state;

    return <ViolationTrend size={size} dates={dates} />;
  }
}

export { ReactCircleCard, initialState, State };
