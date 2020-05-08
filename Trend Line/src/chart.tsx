import * as React from "react";
import Chart from "chart.js";

import "./../style/visual.less";

const { useEffect, useRef } = React;

const ViolationTrend = ({ size, dates }) => {
  const canvas = useRef();
  const chart = useRef();

  const data = dates.map((time) => ({
    date: new Date(time),
  }));

  const dayGranularity =
    data.length > 0
      ? (data[data.length - 1].date - data[0].date) / (1000 * 3600 * 24) < 30
      : true;

  const chartData = data.reduce(
    (acc, { date }) => {
      const { data: dateData } = acc.datasets[0];

      const getDatapoint = () => {
        let datapoint = dateData.find(
          ({ x }) =>
            (!dayGranularity || x.getDate() === date.getDate()) &&
            x.getMonth() === date.getMonth() &&
            x.getFullYear() === date.getFullYear()
        );

        if (!datapoint) {
          datapoint = {
            x: dayGranularity
              ? new Date(date.getFullYear(), date.getMonth(), date.getDate())
              : new Date(date.getFullYear(), date.getMonth()),
            y: 0,
          };
          dateData.push(datapoint);
        }

        return datapoint;
      };

      const datapoint = getDatapoint();
      // TODO: Use the provided count
      datapoint.y += 1;

      return acc;
    },
    {
      datasets: [
        {
          label: "Violations",
          data: [],
          fill: false,
          borderColor: "#4181C2",
          pointRadius: 0,
        },
      ],
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
            scales: {
              xAxes: [
                {
                  type: "time",
                  display: true,
                },
              ],
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
      <h2 style={{ marginTop: 0 }}>VIOLATION TREND</h2>
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

export { ViolationTrend };
