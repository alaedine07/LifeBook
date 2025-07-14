import { DayEntry } from '../interfaces/day_entry';
import { LocalStorageDayEntryService } from './LocalStorageDayEntryAPI';

const API_BASE_URL = 'http://10.0.2.2:3000';
const useLocalStorage = true;

export const DayEntryService = {
  async saveDayEntry(dayEntry: DayEntry): Promise<any> {
    if (useLocalStorage) {
      return await LocalStorageDayEntryService.saveDayEntry(dayEntry);
    }
    try {
      const response = await fetch(`${API_BASE_URL}/day-entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dayEntry),
      });

      if (!response.ok) {
        throw new Error('Failed to save day entry');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving day entry:', error);
      throw error;
    }
  },

  async fetchDays(): Promise<DayEntry[]> {
    if (useLocalStorage) {
      return await LocalStorageDayEntryService.fetchDays();
    }
    try {
      const response = await fetch(`${API_BASE_URL}/day-entries/all`);

      if (!response.ok) {
        throw new Error('Failed to fetch reflections');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching reflections:', error);
      throw error;
    }
  },

  async deleteDayEntry(id: string): Promise<void> {
    if (useLocalStorage) {
      await LocalStorageDayEntryService.deleteDayEntry(id);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/day-entries/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete day entry');
      }
    } catch (error) {
      console.error('Error deleting day entry:', error);
      throw error;
    }
  },

  async updateDayEntry(id: string, dayEntry: DayEntry): Promise<any> {
    if (useLocalStorage) {
      return await LocalStorageDayEntryService.updateDayEntry(id, dayEntry);
    }
    try {
      const response = await fetch(`${API_BASE_URL}/day-entries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses: dayEntry.responses }),
      });

      if (!response.ok) {
        throw new Error('Failed to update day entry');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating day entry:', error);
      throw error;
    }
  },
};
