import * as React from "react";
import Chart from "chart.js";

import { COLOURS } from "./constants";
import { transformData } from "./transformData";
import "./../style/visual.less";

const { useEffect, useRef } = React;

const EROADChart = ({
  size,
  dataView,
  visualSettings,
}: {
  size: { width: number; height: number };
  dataView: any;
  visualSettings: any;
}) => {
  const canvas = useRef();
  const chart = useRef();

  const { chartData, types } = transformData(dataView);

  useEffect(() => {
    if (canvas.current) {
      if (!chart.current) {
        chart.current = new Chart(canvas.current, {
          type: "line",
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false,
            },
          },
        });
      } else {
        // @ts-ignore
        chart.current.data = chartData;
        // @ts-ignore
        chart.current.update();
      }
    }
  }, [chartData, canvas]);

  const { height } = size;

  return (
    <div className="root">
      <h2>{visualSettings.card_title.title}</h2>
      <div
        className="chart-container"
        style={{
          height: `calc(${height}px - 134px)`,
        }}
      >
        <canvas ref={canvas} />
      </div>
      <div className="key-container">
        {types.map((type, index) => (
          <span>
            <div
              className="type-circle"
              style={{
                backgroundColor: COLOURS[index],
              }}
            />
            {type}
          </span>
        ))}
      </div>
    </div>
  );
};

export { EROADChart };
