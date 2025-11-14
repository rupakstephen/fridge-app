import React from 'react';
import { LogOut } from 'lucide-react';

export const Header = ({ userEmail, onLogout }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">🥗 Pantry Tracker</h1>
        <p className="text-gray-600 text-sm mt-1">{userEmail}</p>
      </div>
      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};