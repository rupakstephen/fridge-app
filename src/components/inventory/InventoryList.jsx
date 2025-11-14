import React from 'react';
import { Camera } from 'lucide-react';
import { InventoryItem } from './InventoryItem';

export const InventoryList = ({ items, onDelete, searchQuery, filterCategory }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Camera size={48} className="mx-auto mb-4 opacity-50" />
        <p>
          {searchQuery || filterCategory !== 'all'
            ? 'No items match your filters'
            : 'No items yet. Scan a receipt or add items manually!'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map(item => (
        <InventoryItem 
          key={item.id} 
          item={item} 
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
