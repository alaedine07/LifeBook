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

export function useDeleteReflectionComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: number) => {
      const { data } = await api.delete(
        `/therapists/reflection-comments/${commentId}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reflectionComments'],
      });
    },
  });
}

export function useUpdateReflectionComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { commentId: number; comment: string }) => {
      const { data } = await api.put(
        `/therapists/reflection-comments/${payload.commentId}`,
        { comment: payload.comment }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reflectionComments'],
      });
    },
  });
}
