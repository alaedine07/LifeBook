// web/src/hooks/useMoods.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api/api';
import type { Mood } from '../lib/types/types';

export function useCreateMood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mood: Mood) => {
      const { data } = await api.post('/moods', mood);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moods'] });
    },
    onError: (error: any) => {
      console.error('Failed to create mood:', error.response?.data?.message || error.message);
    },
  });
}

export function useFetchMoods() {
  return useQuery({
    queryKey: ['moods'],
    queryFn: async () => {
      const { data } = await api.get('/moods');
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useFetchMoodsByDate(date: string) {
  return useQuery({
    queryKey: ['moods', date],
    queryFn: async () => {
      const { data } = await api.get(`/moods/${date}`);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
