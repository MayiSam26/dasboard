// UserSessionContext.tsx
import React, { createContext, useState, ReactNode } from 'react'
import axios from 'axios';
import baseurl from './axios';

type UserSession = {
    token: string | null;
    login: (usuario: string, pass: string) => void; 
    logout: () => void;
    checkToken: () => void;
  };
  
  type UserSessionProviderProps = {
    children: ReactNode;
  };
  
  const initialUserSession: UserSession = {
    token: null,
    login: (usuario: string, pass: string) => {},
    logout: () => {},
    checkToken: () => {},
  };

export const UserSessionContext = createContext<UserSession>(initialUserSession);

export const UserSessionProvider: React.FC<UserSessionProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  const login = async (usuario: string, pass: string) => {
    try {
      const url = baseurl+"session-user"
      const response = await axios.post(url, { usuario, pass });
      const{data} = response
      if (token) {
        setToken(token);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
     
    }
  };
  const logout = () => {
    setToken(null);
  };

  const checkToken = () => {
   
  };

  return (
    <UserSessionContext.Provider value={{ token, login, logout, checkToken }}>
      {children}
    </UserSessionContext.Provider>
  );
};
