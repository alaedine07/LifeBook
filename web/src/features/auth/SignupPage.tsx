// src/features/auth/SignupPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../hooks/useAuth';
import AuthLayout from './AuthLayout';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'USER' | 'THERAPIST'>('USER');
  const navigate = useNavigate();

  const { mutate: register, isPending, error } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({
      username,
      email,
      password,
      role,
    });
  };

  return (
    <AuthLayout title="Create Account">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'USER' | 'THERAPIST')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="USER">Normal User</option>
            <option value="THERAPIST">Therapist</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {isPending ? 'Creating account...' : 'Sign Up'}
        </button>

        {error && (
          <p className="text-red-600 text-center text-sm mt-2">
            {error instanceof Error ? error.message : 'Registration failed'}
          </p>
        )}

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-indigo-600 font-bold hover:underline"
          >
            Login
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}
