import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { ShoppingListItem } from './ShoppingListItem';

export const ShoppingList = ({ items, onToggle, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
        <p>Your shopping list is empty!</p>
        <p className="text-sm mt-2">
          Click "Generate List" to add expiring items or "Add to List" to add manually.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {items.map(item => (
          <ShoppingListItem
            key={item.id}
            item={item}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Check off items as you shop! Items marked as complete will stay visible for your reference.
        </p>
      </div>
    </>
  );
};
