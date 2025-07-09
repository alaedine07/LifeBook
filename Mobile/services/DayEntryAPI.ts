import { DayEntry } from '../interfaces/day_entry';

const API_BASE_URL = 'http://10.0.2.2:3000';

export const DayEntryService = {
  async saveDayEntry(dayEntry: DayEntry): Promise<any> {
    console.log('Saving day entry:', dayEntry);
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
