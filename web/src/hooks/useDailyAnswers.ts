import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api/api';

type CreateDailyAnswerPayload = {
  reflectionId: number;
  booleanAnswer?: boolean;
  numberAnswer?: number;
  textAnswer?: string;
};

export function useCreateDailyAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateDailyAnswerPayload) => {
      const { data } = await api.post('/daily-answers', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-answers'] });
    },
    onError: (error: any) => {
      console.error(
        'Failed to save answer:',
        error.response?.data?.message || error.message
      );
    },
  });
}
