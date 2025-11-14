import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useInventory } from './hooks/useInventory';
import { useShoppingList } from './hooks/useShoppingList';
import { scanReceipt } from './utils/receiptScanner';
import { getExpirationStatus } from './utils/expiration';

import { MainLayout } from './components/layout/MainLayout';
import { LoginForm } from './components/auth/LoginForm';
import { GoogleAuthButton } from './components/auth/GoogleAuthButton';
import { Header } from './components/common/Header';
import { ActionButtons } from './components/common/ActionButtons';
import { ErrorAlert, ProcessingAlert } from './components/common/ErrorAlert';
import { ExpiringItemsAlert } from './components/inventory/ExpiringItemsAlert';
import { InventoryFilters } from './components/inventory/InventoryFilters';
import { InventoryList } from './components/inventory/InventoryList';
import { ShoppingList } from './components/shopping/ShoppingList';

const App = () => {
  const [authMode, setAuthMode] = useState('login');
  const [activeTab, setActiveTab] = useState('inventory');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const { user, error: authError, login, signup, loginWithGoogle, logout } = useAuth();
  
  const {
    inventory,
    filteredInventory,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    addItems,
    addItem,
    deleteItem
  } = useInventory(user);

  const {
    shoppingList,
    addItem: addShoppingItem,
    toggleItem: toggleShoppingItem,
    deleteItem: deleteShoppingItem,
    generateFromInventory
  } = useShoppingList(user, inventory);

  // Get expiring items
  const expiringSoon = inventory.filter(item => {
    const status = getExpirationStatus(item.expirationDate);
    return status === 'warning' || status === 'critical';
  });

  // Handle receipt scanning
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setError('');

    try {
      const items = await scanReceipt(file);
      await addItems(items);
    } catch (err) {
      setError(err.message || 'Failed to process receipt. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  // Handle manual item addition
  const handleManualAdd = () => {
    const name = prompt('Enter item name:');
    if (!name) return;
    
    const quantity = prompt('Enter quantity:') || '1';
    addItem(name, quantity);
  };

  // Handle shopping list generation
  const handleGenerateList = () => {
    const hasItems = generateFromInventory();
    
    if (hasItems) {
      setActiveTab('shopping');
    } else {
      alert('No items expiring soon! Your inventory looks good.');
    }
  };

  // Handle adding to shopping list
  const handleAddToList = () => {
    const name = prompt('Enter item to add to shopping list:');
    if (name) {
      addShoppingItem(name);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setSearchQuery('');
    setFilterCategory('all');
    setActiveTab('inventory');
    setError('');
  };

  // Handle auth mode toggle
  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
  };

  // Handle auth submission
  const handleAuth = async (email, password) => {
    return authMode === 'login' 
      ? await login(email, password)
      : await signup(email, password);
  };

  // Login screen
  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              🥗 Pantry Tracker
            </h1>
            
            <LoginForm
              onLogin={login}
              onSignup={signup}
              error={authError}
              mode={authMode}
              onModeChange={toggleAuthMode}
            />

            <GoogleAuthButton onGoogleAuth={loginWithGoogle} />
          </div>
        </div>
      </MainLayout>
    );
  }

  // Main app
  return (
    <MainLayout>
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <Header userEmail={user.email} onLogout={handleLogout} />

        <ActionButtons
          onScanReceipt={handleImageUpload}
          onManualAdd={handleManualAdd}
          onGenerateList={handleGenerateList}
          onAddToList={handleAddToList}
          isProcessing={isProcessing}
        />

        <ErrorAlert message={error} />
        {isProcessing && <ProcessingAlert />}

        {/* Tab Navigation */}
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

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <>
          <ExpiringItemsAlert items={expiringSoon} onDelete={deleteItem} />

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <InventoryFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
            />

            <InventoryList
              items={filteredInventory}
              onDelete={deleteItem}
              searchQuery={searchQuery}
              filterCategory={filterCategory}
            />
          </div>
        </>
      )}

      {/* Shopping List Tab */}
      {activeTab === 'shopping' && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Shopping List ({shoppingList.length} items)
          </h2>

          <ShoppingList
            items={shoppingList}
            onToggle={toggleShoppingItem}
            onDelete={deleteShoppingItem}
          />
        </div>
      )}
    </MainLayout>
  );
};

export default App;