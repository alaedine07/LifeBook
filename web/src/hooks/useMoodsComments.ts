// src/hooks/useMoodComments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api/api';

export function useFetchMoodComments(moodId: number) {
  return useQuery({
    queryKey: ['moodComments', moodId],
    queryFn: async () => {
      const { data } = await api.get(
        `/therapists/mood-comments/${moodId}`
      );
      return data;
    },
  });
}

export function useAddMoodComment(moodId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (comment: string) => {
      const { data } = await api.post(
        `/therapists/mood-comments/${moodId}`,
        { comment }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['moodComments', moodId],
      });
    },
  });
}
