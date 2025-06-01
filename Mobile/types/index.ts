import { DayEntry } from '../interfaces/day_entry.types';

export type AppNavigationParams = {
  FillYourDay: { item?: DayEntry; readOnly?: boolean };
  DayEntries: undefined;
  AddQuestion: undefined;
  Home: undefined;
  // Add other screen names as needed
};
