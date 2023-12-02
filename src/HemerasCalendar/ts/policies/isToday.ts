export default function isToday(
  year: Year,
  month: Month,
  date: MonthDate
): boolean {
  const today = new Date();
  return (
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === date
  );
}
