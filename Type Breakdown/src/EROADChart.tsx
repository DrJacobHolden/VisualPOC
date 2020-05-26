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

  const { chartData, countsByType, types } = transformData(dataView);

  useEffect(() => {
    if (canvas.current) {
      if (!chart.current) {
        chart.current = new Chart(canvas.current, {
          type: "horizontalBar",
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              xAxes: [
                {
                  display: false,
                  stacked: true,
                },
              ],
              yAxes: [
                {
                  display: false,
                  stacked: true,
                },
              ],
            },
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

  const { width, height } = size;

  return (
    <div className="root">
      <h2>{visualSettings.card_title.title}</h2>
      <div
        className="chart-container"
        style={{
          height: `calc(${height}px - 238px)`,
        }}
      >
        <span className="total-display">{types.length} total violations</span>
        <canvas ref={canvas} />
      </div>
      <div className="types-container">
        {types.map((type: string) => (
          <div key={type} className="type-display">
            <div
              className="type-circle"
              style={{
                backgroundColor: COLOURS[types.indexOf(type)],
              }}
            />
            {type}
            <div className="type-value">
              {Math.round(
                (countsByType[type] /
                  types.reduce((count, toMatch) => {
                    count += countsByType[toMatch];
                    return count;
                  }, 0)) *
                  100
              )}
              %
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { EROADChart };
