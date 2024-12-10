const API_BASE_URL = 'http://192.168.1.252:8080';

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
};
