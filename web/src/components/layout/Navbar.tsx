// web/src/components/layout/Navbar.jsx
import { Heart, LogOut, Settings } from 'lucide-react';

type NavbarProps = {
  onLogout: () => void;
};

export default function Navbar({ onLogout }: NavbarProps) {
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">LifeBook</h1>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-gray-600 hover:text-gray-900">
            <Settings className="w-6 h-6" />
          </button>
          <button
            onClick={onLogout}
            className="text-gray-600 hover:text-gray-900"
            title="Log out"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
