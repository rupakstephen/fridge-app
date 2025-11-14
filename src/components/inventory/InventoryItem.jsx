import React from 'react';
import { Trash2 } from 'lucide-react';
import { getDaysUntilExpiration, getExpirationStatus } from '../../utils/expiration';

export const InventoryItem = ({ item, onDelete }) => {
  const status = getExpirationStatus(item.expirationDate);
  const days = getDaysUntilExpiration(item.expirationDate);

  return (
    <div
      className={`p-4 rounded-lg border-2 transition-colors ${
        status === 'expired' ? 'bg-red-50 border-red-300' :
        status === 'critical' ? 'bg-orange-50 border-orange-300' :
        status === 'warning' ? 'bg-yellow-50 border-yellow-300' :
        'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              item.category === 'fridge' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-amber-100 text-amber-700'
            }`}>
              {item.category === 'fridge' ? '🧊 Fridge' : '🥫 Pantry'}
            </span>
          </div>
          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
          <p className="text-xs text-gray-500 mt-1">
            Added: {new Date(item.dateAdded).toLocaleDateString()}
          </p>
          {item.expirationDate && (
            <p className={`text-sm mt-1 font-medium ${
              status === 'expired' ? 'text-red-700' :
              status === 'critical' ? 'text-orange-700' :
              status === 'warning' ? 'text-yellow-700' :
              'text-green-700'
            }`}>
              {status === 'expired' ? '❌ Expired' :
               days === 0 ? '⚠️ Expires today' :
               `🕐 ${days} day${days !== 1 ? 's' : ''} left`}
            </p>
          )}
          {item.nutrition && (
            <div className="mt-2 p-2 bg-white rounded text-xs">
              <p className="font-semibold text-gray-700 mb-1">Nutrition (per 100g):</p>
              <div className="grid grid-cols-2 gap-1 text-gray-600">
                <span>Cal: {item.nutrition.calories}</span>
                <span>Protein: {item.nutrition.protein}g</span>
                <span>Carbs: {item.nutrition.carbs}g</span>
                <span>Fat: {item.nutrition.fat}g</span>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => onDelete(item.id)}
          className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors ml-2"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};
