export const unixDateToStringFormat = (unixdate) => {
  const unixDateToLongString = new Date(unixdate * 1000);
  return unixDateToLongString.toLocaleDateString("id", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};