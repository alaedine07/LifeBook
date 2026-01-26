// web/src/features/auth/AuthLayout.tsx
import { Heart } from 'lucide-react';
import type { ReactNode } from 'react';

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
};

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Heart className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-800">LifeBook</h1>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{title}</h2>

        {children}
      </div>
    </div>
  );
}
