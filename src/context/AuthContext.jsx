import { useContext } from 'react'; //poder pasar a los hijos que esten ciertas cosas
import {createContext, useState} from 'react';

 //dentro del key tengan acceso al login 
const AuthContext = createContext();

export const AuthProvider = ({ children }) => { //crear proveedor
  const [auth, setAuth] = useState(localStorage.getItem('auth')); 
  
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

  const login = (id, name) => {
    const userObject = { id, name };
    localStorage.setItem('auth', true);
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
 
  //
  return (
    <AuthContext.Provider value={{ user, auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
