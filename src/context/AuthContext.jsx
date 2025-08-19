import { useContext } from 'react'; //poder pasar a los hijos que esten ciertas cosas
import {createContext, useState} from 'react';

 //dentro del key tengan acceso al login 
const AuthContext = createContext();

export const AuthProvider = ({ children }) => { //crear proveedor
  const [auth, setAuth] = useState(localStorage.getItem('auth')); 
  const [user, setUser] = useState(localStorage.getItem('id'));

  const login = (id, name) => {
    localStorage.setItem('auth', true);
    localStorage.setItem('id', id);
    localStorage.setItem('name', name);
    setAuth(true);
    setUser(id);
  };

  const logout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('id');
    localStorage.removeItem('name');
    localStorage.removeItem('twitter');
    localStorage.removeItem('linkedin');
    localStorage.removeItem('reddit');
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
