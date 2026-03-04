import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api/api';

type CreateDailyAnswerPayload = {
  reflectionId: number;
  booleanAnswer?: boolean;
  numberAnswer?: number;
  textAnswer?: string;
  date?: string;
};

type UpdateDailyAnswerPayload = {
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

export function useUpdateDailyAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { answerId: number; data: UpdateDailyAnswerPayload }) => {
      const { data } = await api.put(`/daily-answers/${payload.answerId}`, payload.data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-answers'] });
    },
    onError: (error: any) => {
      console.error(
        'Failed to update answer:',
        error.response?.data?.message || error.message
      );
    },
  });
}

export function useFetchDailyAnswersByDate(date: string | null) {
  return useQuery({
    queryKey: ['daily-answers', date],
    queryFn: async () => {
      const { data } = await api.get(`/daily-answers/${date}`);
      return data;
    },
    enabled: !!date,
    staleTime: 1000 * 60 * 5,
  });
}
