import { COLOURS } from "./constants";

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
    acc[type] = typeCountList[index];
    return acc;
  }, {});

  types.sort();

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

  return { chartData, countsByType, types };
};
