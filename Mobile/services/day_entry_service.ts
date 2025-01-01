import { DayEntry } from '../interfaces/day_entry';

const API_BASE_URL = 'http://172.20.10.5:8080';

export const DayEntryService = {
  async saveDayEntry(responses: Array<[string, string]>): Promise<any> {
    try {
      const formattedResponses = responses.map(([question_id, answer]) => ({
        question_id,
        answer,
      }));
      console.log('Formatted responses:', formattedResponses);
      const response = await fetch(`${API_BASE_URL}/day-entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: new Date().toISOString(),
          responses: formattedResponses,
        }),
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
      console.log('fetching all days ...');
      const response = await fetch(`${API_BASE_URL}/day-entries`);

      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },
};
