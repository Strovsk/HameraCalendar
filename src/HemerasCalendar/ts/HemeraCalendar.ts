import IMediator from "@/interfaces/Mediator";
import * as Components from "@/components";
import { HemeraCalendarEngine } from "@/HemeraCalendarEngine";
import { Config } from "@/config";

export class HemeraCalendar implements IMediator {
    protected engine: HemeraCalendarEngine;
    public options: AppOptions;

    private calendarDays: Components.CalendarDays;
    private calendarDates: Components.CalendarDates;
    private calendarHeader: Components.CalendarHeader;
    private calendarMonths: Components.CalendarMonths;
    private calendarActionBar: Components.CalendarActionBar;
    private calendarMasterContainer: Components.CalendarMasterContainer;

    constructor(options: AppOptions = Config.appOptions) {
        this.engine = new HemeraCalendarEngine(options);
        this.options = options;

        this.calendarDays = new Components.CalendarDays(this.engine, this);
        this.calendarDates = new Components.CalendarDates(this.engine, this);
        this.calendarMonths = new Components.CalendarMonths(this.engine, this);
        this.calendarHeader = new Components.CalendarHeader(this.engine, this);
        this.calendarActionBar = new Components.CalendarActionBar(this.engine, this);
        this.calendarMasterContainer = new Components.CalendarMasterContainer(this.engine, this);

        this.calendarMasterContainer.container.appendChild(this.calendarHeader.container);
        this.calendarMasterContainer.container.appendChild(this.calendarDays.container);
        this.calendarMasterContainer.container.appendChild(this.calendarDates.container);
        this.calendarMasterContainer.container.appendChild(this.calendarMonths.container);
        this.calendarMasterContainer.container.appendChild(this.calendarActionBar.container);

        if (this.options.init) this.init();
    }

    public notify<T>(sender: T, component: keyof Components, classmethod: string): void {
        const components: Components = {
            'days': this.calendarDays,
            'dates': this.calendarDates,
            'header': this.calendarHeader,
            'months': this.calendarMonths,
            'actionBar': this.calendarActionBar,
            'masterContainer': this.calendarMasterContainer,
        };
        components[component][classmethod]();
    }

    public toggle() {
        this.calendarMasterContainer.toggle();
    }

    public init() {
        this.calendarMasterContainer.init();
    }
}
