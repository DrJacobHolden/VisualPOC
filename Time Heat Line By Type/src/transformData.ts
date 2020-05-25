import { COLOURS, HOUR_LABELS } from "./constants";

const titlecase = (type) =>
  (type.replace(/_/g, " ")[0] || "").toUpperCase() +
  type.replace(/_/g, " ").slice(1).toLowerCase();

export const transformData = (dataView) => {
  const dates = (
    ((dataView.categorical?.categories || [])[0] || {}).values || []
  ).map((date) => new Date(date));

  const countsByType = (dataView.categorical?.values || []).reduce(
    (acc, value) => {
      const type = titlecase(value?.source?.groupName || "");
      const counts = value?.values;
      // @ts-ignore
      acc[type] = counts;
      return acc;
    },
    {}
  );

  const types = Object.keys(countsByType).sort().map(titlecase);

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

  return { chartData, types };
};
