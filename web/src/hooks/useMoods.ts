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

export function useUpdateMood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: number; moodType?: string; note?: string }) => {
      const { data } = await api.put(`/moods/${payload.id}`, {
        moodType: payload.moodType,
        note: payload.note,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moods'] });
    },
    onError: (error: any) => {
      console.error('Failed to update mood:', error.response?.data?.message || error.message);
    },
  });
}

export function useDeleteMood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/moods/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moods'] });
    },
    onError: (error: any) => {
      console.error('Failed to delete mood:', error.response?.data?.message || error.message);
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

export function useFetchMoodsByRange(from: string, to: string) {
  return useQuery({
    queryKey: ['moods', 'range', from, to],
    queryFn: async () => {
      const { data } = await api.get(`/moods/range/query`, { params: { from, to } });
      return data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!from && !!to,
  });
}
