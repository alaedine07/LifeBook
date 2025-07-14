import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reflection } from '../interfaces/Reflection';

const REFLECTIONS_KEY = 'reflections';

export const LocalStorageService = {
  async fetchReflections(): Promise<Reflection[]> {
    const data = await AsyncStorage.getItem(REFLECTIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  async addReflection(content: string): Promise<Reflection> {
    const reflections = await LocalStorageService.fetchReflections();
    const newReflection: Reflection = {
      id: Date.now().toString(),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newReflection, ...reflections];
    await AsyncStorage.setItem(REFLECTIONS_KEY, JSON.stringify(updated));
    return newReflection;
  },

  async updateReflection(id: string, content: string): Promise<Reflection> {
    const reflections = await LocalStorageService.fetchReflections();
    const updated = reflections.map((r: Reflection) =>
      r.id === id ? { ...r, content, updatedAt: new Date().toISOString() } : r
    );
    await AsyncStorage.setItem(REFLECTIONS_KEY, JSON.stringify(updated));
    return updated.find((r: Reflection) => r.id === id)!;
  },

  async deleteReflection(id: string): Promise<void> {
    const reflections = await LocalStorageService.fetchReflections();
    const updated = reflections.filter((r: Reflection) => r.id !== id);
    await AsyncStorage.setItem(REFLECTIONS_KEY, JSON.stringify(updated));
  },
};
