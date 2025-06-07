import { DayEntry } from '../interfaces/day_entry';

export type AppNavigationParams = {
  FillYourDay: { item?: DayEntry; readOnly?: boolean };
  DayEntries: undefined;
  AddReflection: undefined;
  Home: undefined;
  // Add other screen names as needed
};
