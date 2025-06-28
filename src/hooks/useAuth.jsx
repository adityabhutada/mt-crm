
import React, { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const getStoredUsers = () => {
  const users = localStorage.getItem('crm_users');
  if (users) {
    return JSON.parse(users);
  }
  return [
    { id: 1, email: 'agency@example.com', role: 'agency', name: 'Agency Admin', password: 'password' },
    { id: 2, email: 'vendor1@example.com', role: 'vendor', name: 'Vendor One', vendorId: 'vendor_1', password: 'password' },
    { id: 3, email: 'vendor2@example.com', role: 'vendor', name: 'Vendor Two', vendorId: 'vendor_2', password: 'password' },
    { id: 5, email: 'agent1@example.com', role: 'agent', name: 'Agent Smith', agentId: 'agent_1', password: 'password' },
    { id: 6, email: 'agent2@example.com', role: 'agent', name: 'Agent Jones', agentId: 'agent_2', password: 'password' }
  ];
};

const storeUsers = (users) => {
  localStorage.setItem('crm_users', JSON.stringify(users));
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(getStoredUsers());

  useEffect(() => {
    const savedUser = localStorage.getItem('crm_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('crm_user', JSON.stringify(foundUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const signup = (name, email, password, role) => {
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return { success: false, error: 'User with this email already exists.' };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password, 
      role,
    };

    if (role === 'vendor') {
      newUser.vendorId = `vendor_${Date.now()}`;
    } else if (role === 'agent') {
      newUser.agentId = `agent_${Date.now()}`;
    }
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    storeUsers(updatedUsers);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crm_user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
