// web/src/hooks/useReflections.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api/api';
import type { Reflection } from '../lib/types/types';

export function useCreateReflection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reflection: Reflection) => {
      const { data } = await api.post('/reflections', reflection);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
    },
    onError: (error: any) => {
      console.error('Failed to create reflection:', error.response?.data?.message || error.message);
    },
  });
}

export function useFetchReflections() {
  return useQuery({
    queryKey: ['reflections'],
    queryFn: async () => {
      const { data } = await api.get('/reflections');
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
