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
        label: type,
        backgroundColor: COLOURS[index],
        data: [countsByType[type]],
        borderWidth:
          Object.keys(acc.datasets).length === types.length ? 0 : { right: 2 },
        borderColor: "#FFFFFF",
        barThickness: 60,
      });
      return acc;
    },
    {
      labels: [],
      datasets: [],
    }
  );

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
      <h2>VIOLATION TYPES</h2>
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
            {(type.replace(/_/g, " ")[0] || "").toUpperCase() +
              type.replace(/_/g, " ").slice(1).toLowerCase()}
            <div className="type-value">
              {Math.round(
                (countsByType[type] /
                  types.reduce((count, toMatch) => {
                    // eslint-disable-next-line no-param-reassign
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

export { TypeBreakdown };
