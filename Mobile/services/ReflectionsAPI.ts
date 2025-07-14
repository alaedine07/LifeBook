import { Reflection } from '../interfaces/Reflection';
import { LocalStorageService } from './LocalStorageReflectionAPI';

const API_BASE_URL = 'http://10.0.2.2:3000';
const useLocalStorage = true;

export const ReflectionService = {
  async fetchReflections(): Promise<Reflection[]> {
    if (useLocalStorage) {
      const data = await LocalStorageService.fetchReflections();
      return data;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/reflections`);

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

  async addReflection(content: string): Promise<Reflection> {
    if (useLocalStorage) {
      return await LocalStorageService.addReflection(content);
    }
    try {
      const response = await fetch(`${API_BASE_URL}/reflections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content }),
      });

      if (!response.ok) {
        throw new Error('Failed to add reflections');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding reflection:', error);
      throw error;
    }
  },

  async updateReflection(id: string, content: string): Promise<Reflection> {
    if (useLocalStorage) {
      return await LocalStorageService.updateReflection(id, content);
    }
    try {
      const response = await fetch(`${API_BASE_URL}/reflections/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content }),
      });

      if (!response.ok) {
        throw new Error('Failed to update reflection');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating reflection:', error);
      throw error;
    }
  },

  async deleteReflection(id: string): Promise<void> {
    if (useLocalStorage) {
      await LocalStorageService.deleteReflection(id);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/reflections/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete reflection');
      }
    } catch (error) {
      console.error('Error deleting reflection:', error);
      throw error;
    }
  },
};
