export default function isNextMonth(info: MonthInfo, day: MonthDate) {
  return day > info.startWeekDay + info.numberOfDays;
}
