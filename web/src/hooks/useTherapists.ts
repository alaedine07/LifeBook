import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api/api';

export function useAddTherapist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post('/therapists/add', { email });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapists'] });
    },
  });
}

export function useDeleteTherapist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (therapistId: number) => {
      await api.delete(`/therapists/remove/${therapistId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapists'] });
    },
  });
}

export function useFetchTherapists() {
  return useQuery({
    queryKey: ['therapists'],
    queryFn: async () => {
      const response = await api.get('/therapists/my-therapists');
      return response.data;
    },
  });
}

export function useFetchPatients() {
  return useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const response = await api.get('/therapists/patients');
      return response.data;
    },
  });
}

export function useFetchPatientData(patientId: number | null, date: string) {
  return useQuery({
    queryKey: ['patientData', patientId, date],
    queryFn: async () => {
      if (!patientId) return null;
      const response = await api.get(`/therapists/patient/${patientId}/data/${date}`);
      return response.data;
    },
    enabled: !!patientId,
  });
}
