import * as React from "react";
import Chart from "chart.js";

import "./../style/visual.less";

const { useEffect, useRef } = React;

const COLOURS = ["#9B59B6", "#6DC7BB", "#F89020", "#C64799"];
const HOUR_LABELS = [
  "M",
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  "N",
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  10,
  11,
];

const TrendsByType = ({
  size,
  dates,
  countsByType,
}: {
  size: { width: number; height: number };
  dates: Date[];
  countsByType: {
    [key: string]: number | null;
  };
}) => {
  const canvas = useRef();
  const chart = useRef();

  const types = Object.keys(countsByType).sort();

  // Loop through all the provided timestamps
  const chartData = dates.reduce(
    (acc, date, dateIndex) => {
      // essentially - for each type in types
      acc.datasets.forEach(({ data, label }) => {
        let countAtDate = countsByType[label][dateIndex];
        if (countAtDate === null) countAtDate = 0;

        data[date.getHours()] += countAtDate;
      });

      return acc;
    },
    {
      labels: HOUR_LABELS,
      datasets: types.map((type, index) => ({
        label: type,
        data: HOUR_LABELS.map(() => 0),
        fill: false,
        borderColor: COLOURS[index],
        pointRadius: 0,
      })),
    }
  );

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
      <h2>VIOLATIONS TIMES</h2>
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
            {(type.replace(/_/g, " ")[0] || "").toUpperCase() +
              type.replace(/_/g, " ").slice(1).toLowerCase()}
          </span>
        ))}
      </div>
    </div>
  );
};

export { TrendsByType };
