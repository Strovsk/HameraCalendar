export default function isLastMonth(
  dateIndex: MonthDate,
  startWeekDay: number
) {
  return dateIndex <= startWeekDay;
}
