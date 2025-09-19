import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('blockbank_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call - In production, this would connect to your PHP backend
      const users = JSON.parse(localStorage.getItem('blockbank_users') || '[]');
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const userSession = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          balance: foundUser.balance || 10000
        };
        
        setUser(userSession);
        localStorage.setItem('blockbank_user', JSON.stringify(userSession));
        
        toast({
          title: "Welcome back!",
          description: "Successfully logged into your BlockBank account.",
        });
        
        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      // Simulate API call - In production, this would connect to your PHP backend
      const users = JSON.parse(localStorage.getItem('blockbank_users') || '[]');
      
      if (users.find(u => u.email === email)) {
        throw new Error('Email already exists');
      }
      
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        balance: 10000, // Starting balance
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('blockbank_users', JSON.stringify(users));
      
      const userSession = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        balance: newUser.balance
      };
      
      setUser(userSession);
      localStorage.setItem('blockbank_user', JSON.stringify(userSession));
      
      toast({
        title: "Account Created!",
        description: "Welcome to BlockBank! Your account has been created with ₹10,000 starting balance.",
      });
      
      return { success: true };
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('blockbank_user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const updateBalance = (newBalance) => {
    if (user) {
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
      localStorage.setItem('blockbank_user', JSON.stringify(updatedUser));
      
      const users = JSON.parse(localStorage.getItem('blockbank_users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex].balance = newBalance;
        localStorage.setItem('blockbank_users', JSON.stringify(users));
      }
    }
  };

  const updateUser = async (updates) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('blockbank_user', JSON.stringify(updatedUser));

      const users = JSON.parse(localStorage.getItem('blockbank_users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('blockbank_users', JSON.stringify(users));
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const users = JSON.parse(localStorage.getItem('blockbank_users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) throw new Error('User not found.');
      if (users[userIndex].password !== currentPassword) throw new Error('Incorrect current password.');

      users[userIndex].password = newPassword;
      localStorage.setItem('blockbank_users', JSON.stringify(users));
      
      return { success: true };
    } catch (error) {
      toast({
        title: "Password Update Failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateBalance,
    updateUser,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};