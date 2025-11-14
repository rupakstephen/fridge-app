import React from 'react';
import { Camera, Plus, ShoppingCart } from 'lucide-react';

export const ActionButtons = ({ 
  onScanReceipt, 
  onManualAdd, 
  onGenerateList, 
  onAddToList,
  isProcessing 
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
      <label className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer text-sm">
        <Camera size={18} />
        {isProcessing ? 'Processing...' : 'Scan'}
        <input
          type="file"
          accept="image/*"
          onChange={onScanReceipt}
          disabled={isProcessing}
          className="hidden"
        />
      </label>

      <button
        onClick={onManualAdd}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        <Plus size={18} />
        Add Item
      </button>

      <button
        onClick={onGenerateList}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
      >
        <ShoppingCart size={18} />
        Generate List
      </button>

      <button
        onClick={onAddToList}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
      >
        <Plus size={18} />
        Add to List
      </button>
    </div>
  );
};