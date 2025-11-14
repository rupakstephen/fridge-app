import React from 'react';
import { AlertCircle, Trash2 } from 'lucide-react';
import { getDaysUntilExpiration } from '../../utils/expiration';

export const ExpiringItemsAlert = ({ items, onDelete }) => {
  if (items.length === 0) return null;

  return (
    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
        <AlertCircle size={24} />
        Expiring Soon ({items.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map(item => {
          const days = getDaysUntilExpiration(item.expirationDate);
          return (
            <div key={item.id} className="bg-white rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-600">
                  {days === 0 ? 'Expires today!' : days < 0 ? 'Expired!' : `${days} day${days !== 1 ? 's' : ''} left`}
                </p>
              </div>
              <button
                onClick={() => onDelete(item.id)}
                className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
