// web/src/features/auth/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useAuth';
import AuthLayout from './AuthLayout';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <AuthLayout title="Welcome Back">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {isPending ? 'Logging in...' : 'Login'}
        </button>

        {error && (
          <p className="text-red-600 text-center text-sm mt-2">
            {error instanceof Error ? error.message : 'Login failed'}
          </p>
        )}

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="text-indigo-600 font-bold hover:underline"
          >
            Sign up
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}
