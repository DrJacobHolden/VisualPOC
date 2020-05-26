import { COLOURS, DAY_THRESHOLD } from "./constants";

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

  const types = Object.keys(countsByType).sort();

  const dayGranularity =
    dates.length > 0 &&
    (dates[dates.length - 1] - dates[0]) / (1000 * 3600 * 24) <= DAY_THRESHOLD;

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

  return { chartData, dayGranularity, types };
};
