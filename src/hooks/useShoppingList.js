import { useState, useEffect } from 'react';
import { storageService } from '../utils/storage';
import { getDaysUntilExpiration } from '../utils/expiration';

export const useShoppingList = (user, inventory) => {
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    loadShoppingList();
  }, [user]);

  const loadShoppingList = async () => {
    if (!user) return;
    
    try {
      const data = await storageService.get(`shopping_${user.email}`);
      if (data) {
        setShoppingList(data);
      }
    } catch (err) {
      console.log('No existing shopping list found');
    }
  };

  const saveShoppingList = async (newList) => {
    if (!user) return;
    await storageService.set(`shopping_${user.email}`, newList);
  };

  const addItem = (itemName) => {
    const newItem = {
      id: Date.now(),
      name: itemName,
      checked: false
    };
    const updated = [...shoppingList, newItem];
    setShoppingList(updated);
    saveShoppingList(updated);
  };

  const toggleItem = (id) => {
    const updated = shoppingList.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setShoppingList(updated);
    saveShoppingList(updated);
  };

  const deleteItem = (id) => {
    const updated = shoppingList.filter(item => item.id !== id);
    setShoppingList(updated);
    saveShoppingList(updated);
  };

  const generateFromInventory = () => {
    const lowStock = inventory.filter(item => {
      const days = getDaysUntilExpiration(item.expirationDate);
      return days !== null && days <= 3;
    });
    
    lowStock.forEach(item => {
      if (!shoppingList.find(si => si.name.toLowerCase() === item.name.toLowerCase())) {
        addItem(item.name);
      }
    });
    
    return lowStock.length > 0;
  };

  return {
    shoppingList,
    addItem,
    toggleItem,
    deleteItem,
    generateFromInventory
  };
};
