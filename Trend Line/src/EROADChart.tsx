import * as React from "react";
import Chart from "chart.js";

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

  const { chartData, dayGranularity } = transformData(dataView);

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
            scales: {
              xAxes: [
                {
                  type: "time",
                  display: true,
                  time: {
                    unit: dayGranularity ? "day" : "month",
                  },
                },
              ],
            },
          },
        });
      } else {
        // @ts-ignore
        chart.current.data = chartData;
        // @ts-ignore
        chart.current.options.scales.xAxes[0].time.unit = dayGranularity
          ? "day"
          : "month";
        // @ts-ignore
        chart.current.update();
      }
    }
  }, [chartData, canvas]);

  const { width, height } = size;

  return (
    <div className="root">
      <h2 style={{ marginTop: 0 }}>{visualSettings.card_title.title}</h2>
      <div
        className="chart-container"
        style={{
          height: `calc(${height}px - 104px)`,
        }}
      >
        <canvas ref={canvas} />
      </div>
    </div>
  );
};

export { EROADChart };
