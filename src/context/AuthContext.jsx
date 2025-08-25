import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(localStorage.getItem('auth') === 'true'); 
  
  // Obtener el objeto user del localStorage o crear uno por defecto
  const getUserFromStorage = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
      }
    }
    return null;
  };

  const [user, setUser] = useState(getUserFromStorage());

  // Verificar el estado de autenticación al cargar la aplicación
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth') === 'true';
    const storedUser = getUserFromStorage();
    
    if (storedAuth && storedUser) {
      setAuth(true);
      setUser(storedUser);
    } else {
      // Limpiar datos si no hay autenticación válida
      logout();
    }
  }, []);

  const login = (id, name, additionalData = {}) => {
    const userObject = { 
      id, 
      name,
      ...additionalData
    };
    localStorage.setItem('auth', 'true');
    localStorage.setItem('user', JSON.stringify(userObject));
    setAuth(true);
    setUser(userObject);
  };

  const logout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
    localStorage.removeItem('linkedin');
    localStorage.removeItem('reddit');
    localStorage.removeItem('mastodon');
    setAuth(false);
    setUser(null);
  };

  const updateUser = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const isAuthenticated = () => {
    return auth && user !== null;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      auth, 
      login, 
      logout, 
      updateUser,
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
