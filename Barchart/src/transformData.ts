import { COLOURS } from "./constants";

const round = (num) => Math.round((num + Number.EPSILON) * 100) / 100;
const titlecase = (type) =>
  (type.replace(/_/g, " ")[0] || "").toUpperCase() +
  type.replace(/_/g, " ").slice(1).toLowerCase();

export const transformData = (dataView) => {
  const types = (
    ((dataView.categorical?.categories || [])[0] || {}).values || []
  ).map(titlecase);
  const typeCountList =
    ((dataView.categorical?.values || [])[0] || {}).values || [];

  const countsByType = types.reduce((acc, type, index) => {
    // @ts-ignore
    acc[type] = typeCountList[index];
    return acc;
  }, {});

  // We always sort into alphabetical order to ensure consistent colours.
  // This happens after countsByType to ensure that the types are mapped
  // to the correct count before being sorted.
  types.sort();

  const chartData = types.reduce(
    (acc, type, index) => {
      acc.datasets.push({
        backgroundColor: COLOURS[index],
        data: types.map((_, typeIndex) =>
          index === typeIndex ? round(countsByType[type]) : 0
        ),
      });
      return acc;
    },
    {
      labels: types,
      datasets: [],
    }
  );

  return { chartData, types };
};
