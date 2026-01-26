// src/features/auth/LoginPage.tsx
import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Heart } from 'lucide-react';

// Accept setIsAuthenticated as a prop from the parent (App.tsx)
type LoginPageProps = {
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
};

export default function LoginPage({ setIsAuthenticated }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Heart className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-800">LifeBook</h1>
        </div>

        {isLogin ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Welcome Back</h2>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button
                // Use the prop from parent instead of local state
                onClick={() => setIsAuthenticated(true)}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
              >
                Login
              </button>
              <p className="text-center text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600">
                <option>Normal User</option>
                <option>Therapist</option>
              </select>
              <button
                // Use the prop from parent instead of local state
                onClick={() => setIsAuthenticated(true)}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
              >
                Sign Up
              </button>
              <p className="text-center text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
