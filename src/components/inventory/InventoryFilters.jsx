import React from 'react';
import { Search, Refrigerator, Apple } from 'lucide-react';

export const InventoryFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  filterCategory, 
  setFilterCategory 
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search items..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterCategory === 'all'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterCategory('fridge')}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
            filterCategory === 'fridge'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Refrigerator size={16} />
          Fridge
        </button>
        <button
          onClick={() => setFilterCategory('pantry')}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
            filterCategory === 'pantry'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Apple size={16} />
          Pantry
        </button>
      </div>
    </div>
  );
};
