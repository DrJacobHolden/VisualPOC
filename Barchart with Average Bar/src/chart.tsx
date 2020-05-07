import * as React from "react";
import Chart from "chart.js";

import "./../style/visual.less";

const { useEffect, useRef } = React;

const COLOURS = ["#9B59B6", "#6DC7BB", "#F89020", "#C64799"];

const TypeBreakdown = ({
  size,
  countsByType,
}: {
  size: { width: number; height: number };
  countsByType: {
    [key: string]: number;
  };
}) => {
  const canvas = useRef();
  const chart = useRef();

  const types = Object.keys(countsByType).sort();

  const chartData = types.reduce(
    (acc, type, index) => {
      acc.datasets.push({
        backgroundColor: COLOURS[index],
        data: [
          0,
          ...types.map((_, typeIndex) =>
            index === typeIndex ? countsByType[type] : 0
          ),
        ],
      });
      return acc;
    },
    {
      labels: ["Average", ...types],
      datasets: [
        {
          backgroundColor: "#1869B7",
          data: [
            // TODO: This is currently the average of averages.
            types.reduce((acc, type) => {
              acc += countsByType[type];
              return acc;
            }, 0) / types.length,
            ...types.map(() => 0),
          ],
        },
      ],
    }
  );

  useEffect(() => {
    if (canvas.current) {
      if (!chart.current) {
        chart.current = new Chart(canvas.current, {
          type: "bar",
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              xAxes: [
                {
                  display: false,
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

  const { height } = size;

  return (
    <div className="root">
      <h2>VIOLATION DURATION</h2>
      <div
        className="chart-container"
        style={{
          height: `calc(${height}px - 136px)`,
        }}
      >
        <canvas ref={canvas} />
      </div>
      <div className="key-container">
        <span>
          <div
            className="type-circle"
            style={{
              backgroundColor: "#1869B7",
            }}
          />
          Average
        </span>
        {types.map((type, index) => (
          <span>
            <div
              className="type-circle"
              style={{
                backgroundColor: COLOURS[index],
              }}
            />
            {(type.replace(/_/g, " ")[0] || "").toUpperCase() +
              type.replace(/_/g, " ").slice(1).toLowerCase()}
          </span>
        ))}
      </div>
    </div>
  );
};

export { TypeBreakdown };
