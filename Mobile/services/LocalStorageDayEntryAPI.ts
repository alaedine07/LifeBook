import AsyncStorage from '@react-native-async-storage/async-storage';
import { DayEntry } from '../interfaces/day_entry';

const DAY_ENTRIES_KEY = 'day_entries';

export const LocalStorageDayEntryService = {
  async saveDayEntry(dayEntry: DayEntry): Promise<DayEntry> {
    const entries = await LocalStorageDayEntryService.fetchDays();
    const newEntry: DayEntry = {
      ...dayEntry,
      id: Date.now().toString(),
    };
    const updated = [newEntry, ...entries];
    await AsyncStorage.setItem(DAY_ENTRIES_KEY, JSON.stringify(updated));
    return newEntry;
  },

  async fetchDays(): Promise<DayEntry[]> {
    const data = await AsyncStorage.getItem(DAY_ENTRIES_KEY);
    return data ? JSON.parse(data) : [];
  },

  async deleteDayEntry(id: string): Promise<void> {
    const entries = await LocalStorageDayEntryService.fetchDays();
    const updated = entries.filter((entry: DayEntry) => entry.id !== id);
    await AsyncStorage.setItem(DAY_ENTRIES_KEY, JSON.stringify(updated));
  },

  async updateDayEntry(id: string, dayEntry: DayEntry): Promise<DayEntry> {
    const entries = await LocalStorageDayEntryService.fetchDays();
    const updated = entries.map((entry: DayEntry) =>
      entry.id === id
        ? {
            ...entry,
            ...dayEntry,
            updatedAt: new Date().toISOString(),
          }
        : entry
    );
    await AsyncStorage.setItem(DAY_ENTRIES_KEY, JSON.stringify(updated));
    return updated.find((entry: DayEntry) => entry.id === id)!;
  },
};
