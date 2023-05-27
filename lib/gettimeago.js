export const getTimeAgo = (unixTimestamp) => {
  // nmulitiplied by 1000 because javascript by default use milliseconds instead of seconds in unix time
  unixTimestamp = unixTimestamp * 1000;
  const millisecondsPerMinute = 60 * 1000;
  const millisecondsPerHour = 60 * millisecondsPerMinute;
  const millisecondsPerDay = 24 * millisecondsPerHour;
  const millisecondsPerWeek = 7 * millisecondsPerDay;
  const millisecondsPerMonth = 30 * millisecondsPerDay;

  const currentTime = Date.now();
  const timestampDifference = currentTime - unixTimestamp;

  if (timestampDifference < millisecondsPerMinute) {
    return "Belum lama ini";
  } else if (timestampDifference < millisecondsPerHour) {
    const minutes = Math.floor(timestampDifference / millisecondsPerMinute);
    return `${minutes} menit yang lalu`;
  } else if (timestampDifference < millisecondsPerDay) {
    const hours = Math.floor(timestampDifference / millisecondsPerHour);
    return `${hours} jam yang lalu`;
  } else if (timestampDifference < millisecondsPerWeek) {
    const days = Math.floor(timestampDifference / millisecondsPerDay);
    return `${days} hari yang lalu`;
  } else if (timestampDifference < millisecondsPerMonth) {
    const weeks = Math.floor(timestampDifference / millisecondsPerWeek);
    return `${weeks} minggu yang lalu`;
  } else {
    const months = Math.floor(timestampDifference / millisecondsPerMonth);
    return `${months} bulan yang lalu`;
  }
}