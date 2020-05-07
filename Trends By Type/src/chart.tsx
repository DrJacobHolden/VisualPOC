import * as React from "react";
import Chart from "chart.js";

import "./../style/visual.less";

const { useEffect, useRef } = React;

const COLOURS = ["#9B59B6", "#6DC7BB", "#F89020", "#C64799"];

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

  const dayGranularity =
    dates.length > 0
      ? (dates[dates.length - 1].getTime() - dates[0].getTime()) /
          (1000 * 3600 * 24) <
        90
      : true;

  // Loop through all the provided timestamps
  const chartData = dates.reduce(
    (acc, date, dateIndex) => {
      // essentially - for each type in types
      acc.datasets.forEach(({ data, label }) => {
        let countAtDate = countsByType[label][dateIndex];
        if (countAtDate === null) countAtDate = 0;

        // For the current timestamp, extract just the month and year (or day, month and year)
        // then find or create a bucket for this reduced specifity timestamp and add the value
        // at this point (or 0 if it is null for this type).
        const getMatchingTimeBox = () => {
          let timeBox = data.find(
            ({ x }) =>
              (!dayGranularity || x.getDate() === date.getDate()) &&
              x.getMonth() === date.getMonth() &&
              x.getFullYear() === date.getFullYear()
          );

          if (!timeBox) {
            timeBox = {
              x: dayGranularity
                ? new Date(date.getFullYear(), date.getMonth(), date.getDate())
                : new Date(date.getFullYear(), date.getMonth()),
              y: 0,
            };
            data.push(timeBox);
          }

          return timeBox;
        };

        const timeBox = getMatchingTimeBox();
        timeBox.y += countAtDate;
      });

      return acc;
    },
    {
      datasets: types.map((type, index) => ({
        label: type,
        data: [],
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
            scales: {
              xAxes: [
                {
                  type: "time",
                  display: true,
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
      <h2>VIOLATIONS TYPES OVER TIME</h2>
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
