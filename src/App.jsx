import React, { useState, useEffect } from 'react';
import { Camera, LogOut, Plus, Trash2, AlertCircle, RefreshCw, Search, ShoppingCart, Apple, Refrigerator } from 'lucide-react';

const PantryTracker = () => {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inventory, setInventory] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('inventory');

  const produceExpiration = {
    apple: 30, apples: 30, banana: 7, bananas: 7, orange: 14, oranges: 14,
    lettuce: 7, spinach: 5, tomato: 7, tomatoes: 7, cucumber: 7, cucumbers: 7,
    carrot: 21, carrots: 21, potato: 30, potatoes: 30, onion: 30, onions: 30,
    broccoli: 7, cauliflower: 7, pepper: 10, peppers: 10, celery: 14,
    strawberry: 5, strawberries: 5, blueberry: 10, blueberries: 10,
    grape: 7, grapes: 7, melon: 7, watermelon: 7, avocado: 5, avocados: 5,
    mushroom: 7, mushrooms: 7, zucchini: 7, eggplant: 7, corn: 5,
    peach: 5, peaches: 5, pear: 7, pears: 7, plum: 5, plums: 5,
    berry: 5, berries: 5, kale: 7, cabbage: 14, leek: 10, leeks: 10,
    lime: 14, limes: 14, lemon: 14, lemons: 14, grapefruit: 14,
    mango: 7, mangoes: 7, pineapple: 7, kiwi: 7, papaya: 5
  };

  const nutritionData = {
    apple: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
    banana: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
    orange: { calories: 47, protein: 0.9, carbs: 12, fat: 0.1 },
    lettuce: { calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2 },
    spinach: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
    tomato: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
    carrot: { calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
    broccoli: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
    chicken: { calories: 239, protein: 27, carbs: 0, fat: 14 },
    beef: { calories: 250, protein: 26, carbs: 0, fat: 15 },
    salmon: { calories: 208, protein: 20, carbs: 0, fat: 13 },
    milk: { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
    cheese: { calories: 402, protein: 25, carbs: 1.3, fat: 33 },
    bread: { calories: 265, protein: 9, carbs: 49, fat: 3.2 },
    rice: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
    pasta: { calories: 131, protein: 5, carbs: 25, fat: 1.1 },
    egg: { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
    yogurt: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4 }
  };

  const categorizeItem = (itemName) => {
    const name = itemName.toLowerCase();
    
    for (const produce of Object.keys(produceExpiration)) {
      if (name.includes(produce)) return 'fridge';
    }
    
    if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt') || 
        name.includes('butter') || name.includes('cream') || name.includes('dairy')) {
      return 'fridge';
    }
    
    if (name.includes('chicken') || name.includes('beef') || name.includes('pork') || 
        name.includes('fish') || name.includes('meat') || name.includes('salmon') ||
        name.includes('turkey') || name.includes('bacon')) {
      return 'fridge';
    }
    
    if (name.includes('egg')) return 'fridge';
    
    return 'pantry';
  };

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      const invData = await window.storage.get(`inventory_${user.email}`);
      if (invData) {
        setInventory(JSON.parse(invData.value));
      }
      
      const shopData = await window.storage.get(`shopping_${user.email}`);
      if (shopData) {
        setShoppingList(JSON.parse(shopData.value));
      }
    } catch (err) {
      console.log('No existing data found');
    }
  };

  const saveInventory = async (newInventory) => {
    if (!user) return;
    
    try {
      await window.storage.set(`inventory_${user.email}`, JSON.stringify(newInventory));
    } catch (err) {
      setError('Failed to save inventory');
    }
  };

  const saveShoppingList = async (newList) => {
    if (!user) return;
    
    try {
      await window.storage.set(`shopping_${user.email}`, JSON.stringify(newList));
    } catch (err) {
      setError('Failed to save shopping list');
    }
  };

  const handleGoogleAuth = () => {
    const googleEmail = prompt('Enter your Google email (demo):');
    if (googleEmail) {
      setUser({ email: googleEmail, provider: 'google' });
      setError('');
    }
  };

  const handleAuth = async (e) => {
    if (e) e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      if (authMode === 'signup') {
        const existing = await window.storage.get(`user_${email}`);
        if (existing) {
          setError('User already exists');
          return;
        }
        await window.storage.set(`user_${email}`, JSON.stringify({ email, password }));
      } else {
        const userData = await window.storage.get(`user_${email}`);
        if (!userData) {
          setError('User not found');
          return;
        }
        const user = JSON.parse(userData.value);
        if (user.password !== password) {
          setError('Invalid password');
          return;
        }
      }
      
      setUser({ email, provider: 'email' });
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Authentication failed');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setInventory([]);
    setShoppingList([]);
    setSearchQuery('');
    setFilterCategory('all');
    setActiveTab('inventory');
  };

  const getExpirationDate = (itemName) => {
    const name = itemName.toLowerCase();
    for (const [produce, days] of Object.entries(produceExpiration)) {
      if (name.includes(produce)) {
        const expDate = new Date();
        expDate.setDate(expDate.getDate() + days);
        return expDate;
      }
    }
    return null;
  };

  const getNutrition = (itemName) => {
    const name = itemName.toLowerCase();
    for (const [food, nutrition] of Object.entries(nutritionData)) {
      if (name.includes(food)) {
        return nutrition;
      }
    }
    return null;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setError('');

    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      
      if (!apiKey) {
        setError('API key not configured. Please add VITE_ANTHROPIC_API_KEY to your .env file');
        setIsProcessing(false);
        return;
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: file.type,
                  data: base64
                }
              },
              {
                type: 'text',
                text: 'Extract all grocery items from this receipt. Return ONLY a JSON array of objects with "name" and "quantity" fields. Example: [{"name":"Apples","quantity":"2 lbs"},{"name":"Milk","quantity":"1 gallon"}]. If you cannot read the receipt, return an empty array [].'
              }
            ]
          }]
        })
      });

      const data = await response.json();
      const text = data.content.map(item => item.text || '').join('').trim();
      const cleaned = text.replace(/```json|```/g, '').trim();
      const items = JSON.parse(cleaned);

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
    } catch (err) {
      setError('Failed to process receipt. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleManualAdd = () => {
    const name = prompt('Enter item name:');
    if (!name) return;
    
    const quantity = prompt('Enter quantity:') || '1';
    
    const newItem = {
      id: Date.now(),
      name,
      quantity,
      dateAdded: new Date().toISOString(),
      expirationDate: getExpirationDate(name),
      category: categorizeItem(name),
      nutrition: getNutrition(name)
    };

    const updatedInventory = [...inventory, newItem];
    setInventory(updatedInventory);
    saveInventory(updatedInventory);
  };

  const handleDelete = async (id) => {
    const updatedInventory = inventory.filter(item => item.id !== id);
    setInventory(updatedInventory);
    await saveInventory(updatedInventory);
  };

  const addToShoppingList = (itemName) => {
    const newItem = {
      id: Date.now(),
      name: itemName,
      checked: false
    };
    const updated = [...shoppingList, newItem];
    setShoppingList(updated);
    saveShoppingList(updated);
  };

  const toggleShoppingItem = (id) => {
    const updated = shoppingList.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setShoppingList(updated);
    saveShoppingList(updated);
  };

  const deleteShoppingItem = (id) => {
    const updated = shoppingList.filter(item => item.id !== id);
    setShoppingList(updated);
    saveShoppingList(updated);
  };

  const addShoppingItem = () => {
    const name = prompt('Enter item to add to shopping list:');
    if (name) {
      addToShoppingList(name);
    }
  };

  const generateShoppingList = () => {
    const lowStock = inventory.filter(item => {
      const days = getDaysUntilExpiration(item.expirationDate);
      return days !== null && days <= 3;
    });
    
    lowStock.forEach(item => {
      if (!shoppingList.find(si => si.name.toLowerCase() === item.name.toLowerCase())) {
        addToShoppingList(item.name);
      }
    });
    
    if (lowStock.length > 0) {
      setActiveTab('shopping');
    } else {
      alert('No items expiring soon! Your inventory looks good.');
    }
  };

  const getDaysUntilExpiration = (expDate) => {
    if (!expDate) return null;
    const now = new Date();
    const exp = new Date(expDate);
    const days = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getExpirationStatus = (expDate) => {
    const days = getDaysUntilExpiration(expDate);
    if (!days) return 'none';
    if (days < 0) return 'expired';
    if (days <= 3) return 'critical';
    if (days <= 7) return 'warning';
    return 'good';
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🥗 Pantry Tracker
          </h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAuth(e)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAuth(e)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleAuth}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {authMode === 'login' ? 'Log In' : 'Sign Up'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </div>

          <button
            onClick={() => {
              setAuthMode(authMode === 'login' ? 'signup' : 'login');
              setError('');
            }}
            className="w-full mt-4 text-green-600 text-sm hover:underline"
          >
            {authMode === 'login' ? 'Need an account? Sign up' : 'Have an account? Log in'}
          </button>
        </div>
      </div>
    );
  }

  const expiringSoon = inventory.filter(item => {
    const status = getExpirationStatus(item.expirationDate);
    return status === 'warning' || status === 'critical';
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">🥗 Pantry Tracker</h1>
              <p className="text-gray-600 text-sm mt-1">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer text-sm">
              <Camera size={18} />
              {isProcessing ? 'Processing...' : 'Scan'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isProcessing}
                className="hidden"
              />
            </label>

            <button
              onClick={handleManualAdd}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus size={18} />
              Add Item
            </button>

            <button
              onClick={generateShoppingList}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <ShoppingCart size={18} />
              Generate List
            </button>

            <button
              onClick={addShoppingItem}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              <Plus size={18} />
              Add to List
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {isProcessing && (
            <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <RefreshCw size={18} className="animate-spin" />
              Analyzing receipt...
            </div>
          )}

          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'inventory'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Inventory ({inventory.length})
            </button>
            <button
              onClick={() => setActiveTab('shopping')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'shopping'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Shopping List ({shoppingList.length})
            </button>
          </div>
        </div>

        {activeTab === 'inventory' && (
          <>
            {expiringSoon.length > 0 && (
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                  <AlertCircle size={24} />
                  Expiring Soon ({expiringSoon.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {expiringSoon.map(item => {
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
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
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

              {filteredInventory.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Camera size={48} className="mx-auto mb-4 opacity-50" />
                  <p>
                    {searchQuery || filterCategory !== 'all'
                      ? 'No items match your filters'
                      : 'No items yet. Scan a receipt or add items manually!'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredInventory.map(item => {
                    const status = getExpirationStatus(item.expirationDate);
                    const days = getDaysUntilExpiration(item.expirationDate);
                    
                    return (
                      <div
                        key={item.id}
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
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors ml-2"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'shopping' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Shopping List ({shoppingList.length} items)
            </h2>

            {shoppingList.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                <p>Your shopping list is empty!</p>
                <p className="text-sm mt-2">Click "Generate List" to add expiring items or "Add to List" to add manually.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {shoppingList.map(item => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border-2 transition-colors flex items-center gap-3 ${
                      item.checked
                        ? 'bg-green-50 border-green-300'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleShoppingItem(item.id)}
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
                      onClick={() => deleteShoppingItem(item.id)}
                      className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {shoppingList.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Check off items as you shop! Items marked as complete will stay visible for your reference.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PantryTracker;