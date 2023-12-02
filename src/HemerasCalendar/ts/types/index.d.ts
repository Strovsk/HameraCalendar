import { HemeraCalendar } from 'HemeraCalendar';
import { HemeraCalendarEngine } from 'HemeraCalendarEngine';

declare global {
  interface Window {
    HemeraCalendarEngine: typeof HemeraCalendarEngine;
    HemeraCalendar: typeof HemeraCalendar;
  }
}
