import policies from "@/policies";

function createLastMonthDateNode(info: MonthInfo, day: MonthDate): DateInfo {
    const lastMonthDate = info.lastMonthNumberOfDays - info.startWeekDay + day;
    return {
        year: info.lastMonthYear,
        month: info.lastMonthNumber,
        date: lastMonthDate,
        isToday: false,
        isAnotherMonth: true,
        isLastMonth: true,
        isNextMonth: false,

        isSelected: false,
        isSubSelected: false,
    };
}

function createNextMonthDateNode(info: MonthInfo, day: MonthDate): DateInfo {;
    return {
        year: info.nextMonthYear,
        month: info.nextMonthNumber,
        date: day,
        isToday: false,
        isAnotherMonth: true,
        isLastMonth: false,
        isNextMonth: true,

        isSelected: false,
        isSubSelected: false,
    };
}

function createCurrentMonthNode(info: MonthInfo, day: MonthDate): DateInfo {;
    const currentDate = day - info.startWeekDay;
    return {
        year: info.year,
        month: info.monthNumber,
        date: currentDate,
        isToday: policies.isToday(info.year, info.monthNumber, currentDate),
        isAnotherMonth: false,
        isLastMonth: false,
        isNextMonth: false,

        isSelected: false,
        isSubSelected: false,
    };
}

export default function generateArrayDates(info: MonthInfo): DateInfo[] {
    const arrayDates: DateInfo[] = [];

    const daysInWeek = 7;
    const thursdayIndex = 5;
    let numberOfWeekRows = 5;
    if (info.startWeekDay >= thursdayIndex) numberOfWeekRows += 1;

    const numberOfNodesInArray = numberOfWeekRows * daysInWeek;

    let nextMonthDate = 0;

    for (let day = 1; day <= numberOfNodesInArray; day += 1) {
        if (policies.isLastMonth(day, info.startWeekDay)) {
            arrayDates.push(createLastMonthDateNode(info, day));
        } else if (policies.isNextMonth(info, day)) {
            nextMonthDate += 1;
            arrayDates.push(createNextMonthDateNode(info, nextMonthDate));
        } else {
            arrayDates.push(createCurrentMonthNode(info, day));
        }
    }

    return arrayDates;
}
