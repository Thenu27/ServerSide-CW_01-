// Normalize date to start of the day (00:00:00)
const normalizeDate = (date = new Date()) => {
  const normalized = new Date(date); // Create copy of date
  normalized.setHours(0, 0, 0, 0);   // Reset time to midnight
  return normalized;
};

module.exports = { normalizeDate };