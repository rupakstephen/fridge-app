import { useState } from 'react';
import { storageService } from '../utils/storage';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const login = async (email, password) => {
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return false;
    }

    try {
      const userData = await storageService.get(`user_${email}`);
      if (!userData) {
        setError('User not found');
        return false;
      }
      
      if (userData.password !== password) {
        setError('Invalid password');
        return false;
      }
      
      setUser({ email, provider: 'email' });
      return true;
    } catch (err) {
      setError('Login failed');
      return false;
    }
  };

  const signup = async (email, password) => {
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return false;
    }

    try {
      const existing = await storageService.get(`user_${email}`);
      if (existing) {
        setError('User already exists');
        return false;
      }
      
      await storageService.set(`user_${email}`, { email, password });
      setUser({ email, provider: 'email' });
      return true;
    } catch (err) {
      setError('Signup failed');
      return false;
    }
  };

  const loginWithGoogle = (email) => {
    setUser({ email, provider: 'google' });
    setError('');
  };

  const logout = () => {
    setUser(null);
    setError('');
  };

  return { user, error, login, signup, loginWithGoogle, logout };
};
