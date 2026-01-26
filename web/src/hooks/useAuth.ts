// web/src/hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api/api';
import { useAuthStore } from '../stores/authStore';
import { jwtDecode } from 'jwt-decode';

type LoginCredentials = {
  email: string;
  password: string;
};

export function useLogin() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post('/auth/login', credentials);
      return data;
    },
    onSuccess: (response) => {
      const decoded: { role: 'USER' | 'THERAPIST' } = jwtDecode(response.access_token);
      const role = decoded.role;
      login(response.access_token, role);
      navigate('/dashboard');
    },
    onError: (error: any) => {
      console.error('Login failed:', error.response?.data?.message || error.message);
    },
  });
}

type RegisterData = {
  username: string;
  email: string;
  password: string;
  role?: 'USER' | 'THERAPIST';
};

export function useRegister() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const { data: response } = await api.post('/auth/register', data);
      return response;
    },
    onSuccess: () => {
      navigate('/login');
    },
    onError: (err: any) => {
      console.error('Register failed:', err.response?.data?.message);
    },
  });
}
