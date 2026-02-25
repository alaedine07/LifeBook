// src/hooks/useReflectionComments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api/api';

export function useFetchReflectionComments(reflectionId: number) {
  return useQuery({
    queryKey: ['reflectionComments', reflectionId],
    queryFn: async () => {
      const { data } = await api.get(
        `/therapists/reflection-comments/${reflectionId}`
      );
      return data;
    },
  });
}

export function useAddReflectionComment(reflectionId: number) {
  console.log('Using useAddReflectionComment with reflectionId:', reflectionId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comment: string) => {
      const { data } = await api.post(
        `/therapists/reflection-comments/${reflectionId}`,
        { comment }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reflectionComments', reflectionId],
      });
    },
  });
}
