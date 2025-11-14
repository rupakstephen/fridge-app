import React from 'react';
import { Trash2 } from 'lucide-react';

export const ShoppingListItem = ({ item, onToggle, onDelete }) => {
  return (
    <div
      className={`p-4 rounded-lg border-2 transition-colors flex items-center gap-3 ${
        item.checked
          ? 'bg-green-50 border-green-300'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <input
        type="checkbox"
        checked={item.checked}
        onChange={() => onToggle(item.id)}
        className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
      />
      <span
        className={`flex-1 text-lg ${
          item.checked ? 'line-through text-gray-500' : 'text-gray-800'
        }`}
      >
        {item.name}
      </span>
      <button
        onClick={() => onDelete(item.id)}
        className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
