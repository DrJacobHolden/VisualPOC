import { DAY_THRESHOLD } from "./constants";

export const transformData = (dataView) => {
  const dates = (
    ((dataView.categorical?.categories || [])[0] || {}).values || []
  ).map((date) => new Date(date));
  const countAtDate =
    ((dataView.categorical?.values || [])[0] || {}).values || [];

  const dayGranularity =
    dates.length > 0 &&
    (dates[dates.length - 1] - dates[0]) / (1000 * 3600 * 24) <= DAY_THRESHOLD;

  const chartData = dates.reduce(
    (acc, date, index) => {
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
      datapoint.y += countAtDate[index];

      return acc;
    },
    {
      datasets: [
        {
          data: [],
          fill: false,
          borderColor: "#4181C2",
          pointRadius: 0,
        },
      ],
    }
  );

  return { chartData, dayGranularity };
};
