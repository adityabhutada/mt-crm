
import { useState, useEffect, createContext, useContext } from 'react';

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
    const savedUser = localStorage.getItem('crm_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock authentication - in production, this would be a real API call
    const mockUsers = [
      { id: 1, email: 'agency@example.com', role: 'agency', name: 'Agency Admin' },
      { id: 2, email: 'vendor1@example.com', role: 'vendor', name: 'Vendor One', vendorId: 'vendor_1' },
      { id: 3, email: 'vendor2@example.com', role: 'vendor', name: 'Vendor Two', vendorId: 'vendor_2' },
      { id: 4, email: 'firm@example.com', role: 'firm', name: 'Law Firm', firmId: 'firm_1' }
    ];

    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('crm_user', JSON.stringify(foundUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crm_user');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
