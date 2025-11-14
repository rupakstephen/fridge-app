import { useState, useEffect } from 'react';
import { storageService } from '../utils/storage';
import { getExpirationDate } from '../utils/expiration';
import { categorizeItem } from '../utils/categorization';
import { getNutrition } from '../utils/nutrition';

export const useInventory = (user) => {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadInventory();
  }, [user]);

  const loadInventory = async () => {
    if (!user) return;
    
    try {
      const data = await storageService.get(`inventory_${user.email}`);
      if (data) {
        setInventory(data);
      }
    } catch (err) {
      console.log('No existing inventory found');
    }
  };

  const saveInventory = async (newInventory) => {
    if (!user) return;
    await storageService.set(`inventory_${user.email}`, newInventory);
  };

  const addItems = async (items) => {
    const newItems = items.map(item => ({
      id: Date.now() + Math.random(),
      name: item.name,
      quantity: item.quantity || '1',
      dateAdded: new Date().toISOString(),
      expirationDate: getExpirationDate(item.name),
      category: categorizeItem(item.name),
      nutrition: getNutrition(item.name)
    }));

    const updatedInventory = [...inventory, ...newItems];
    setInventory(updatedInventory);
    await saveInventory(updatedInventory);
  };

  const addItem = async (name, quantity = '1') => {
    await addItems([{ name, quantity }]);
  };

  const deleteItem = async (id) => {
    const updatedInventory = inventory.filter(item => item.id !== id);
    setInventory(updatedInventory);
    await saveInventory(updatedInventory);
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return {
    inventory,
    filteredInventory,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    addItems,
    addItem,
    deleteItem
  };
};
