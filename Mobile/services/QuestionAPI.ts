import { Question } from '../interfaces/question';

const API_BASE_URL = 'http://192.168.1.252:8080';

export const QuestionService = {
  async fetchQuestions(): Promise<Question[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/questions`);

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

  async addQuestion(questionText: string): Promise<Question> {
    try {
      const response = await fetch(`${API_BASE_URL}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: questionText }),
      });

      if (!response.ok) {
        throw new Error('Failed to add question');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding question:', error);
      throw error;
    }
  },

  async updateQuestion(id: string, questionText: string): Promise<Question> {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: questionText }),
      });

      if (!response.ok) {
        throw new Error('Failed to update question');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  },

  async deleteQuestion(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete question');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  },
};
