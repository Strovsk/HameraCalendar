import { Languages } from "@/types/enum";

const shortWeekDaysOptions = {
    [Languages.BR]: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    [Languages.US]: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
};

const monthsOptions = {
    [Languages.BR]: [
        { short: 'Jan', expanded: 'Janeiro' },
        { short: 'Fev', expanded: 'Fevereiro' },
        { short: 'Mar', expanded: 'Março' },
        { short: 'Abr', expanded: 'Abril' },
        { short: 'Mai', expanded: 'Maio' },
        { short: 'Jun', expanded: 'Junho' },
        { short: 'Jul', expanded: 'Julho' },
        { short: 'Ago', expanded: 'Agosto' },
        { short: 'Set', expanded: 'Setembro' },
        { short: 'Out', expanded: 'Outubro' },
        { short: 'Nov', expanded: 'Novembro' },
        { short: 'Dez', expanded: 'Dezembro' },
    ],
    [Languages.US]: [
        { short: 'Jan', expanded: 'January' },
        { short: 'Feb', expanded: 'February' },
        { short: 'Mar', expanded: 'March' },
        { short: 'Apr', expanded: 'April' },
        { short: 'May', expanded: 'May' },
        { short: 'Jun', expanded: 'June' },
        { short: 'Jul', expanded: 'July' },
        { short: 'Aug', expanded: 'August' },
        { short: 'Sep', expanded: 'September' },
        { short: 'Oct', expanded: 'October' },
        { short: 'Nov', expanded: 'November' },
        { short: 'Dec', expanded: 'December' },
    ],
};

export { monthsOptions, shortWeekDaysOptions };
