import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const USERS_STORAGE_KEY = 'walmatUsers';
const IS_LOGGED_IN_KEY = 'isLoggedIn';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const storedAuth = localStorage.getItem(IS_LOGGED_IN_KEY);
      return storedAuth === 'true';
    } catch (error) {
      console.error("Error al cargar el estado de autenticación de localStorage:", error);
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error al cargar el usuario actual de localStorage:", error);
      return null;
    }
  });

  const getStoredUsers = useCallback(() => {
    try {
      const users = localStorage.getItem(USERS_STORAGE_KEY);
      const parsedUsers = users ? JSON.parse(users) : [];

      if (parsedUsers.length === 0) {
        const defaultUser = {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          role: 'admin',
        };
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([defaultUser]));
        console.log('Usuario por defecto creado en localStorage:', defaultUser);
        return [defaultUser];
      }

      return parsedUsers;
    } catch (error) {
      console.error("Error al leer usuarios de localStorage:", error);
      return [];
    }
  }, []);

  const setStoredUsers = useCallback((users) => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Error al guardar usuarios en localStorage:", error);
    }
  }, []);

  const saveAuthStatus = useCallback((status) => {
    try {
      localStorage.setItem(IS_LOGGED_IN_KEY, status);
    } catch (error) {
      console.error("Error al guardar estado de login en localStorage:", error);
    }
  }, []);

  const saveCurrentUser = useCallback((user) => {
    try {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.error("Error al guardar usuario actual en localStorage:", error);
    }
  }, []);

  useEffect(() => {
    saveAuthStatus(isAuthenticated);
  }, [isAuthenticated, saveAuthStatus]);

  useEffect(() => {
    saveCurrentUser(currentUser);
  }, [currentUser, saveCurrentUser]);

  const register = async (username, email, password) => {
    const users = getStoredUsers();

    const userExists = users.some(
      (user) => user.username === username || user.email === email
    );

    if (userExists) {
      throw new Error('El nombre de usuario o correo electrónico ya están registrados.');
    }

    const newId = users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 1;

    const newUser = {
      id: newId,
      username,
      email,
      password,
      role: 'user',
    };

    setStoredUsers([...users, newUser]);
    console.log('Usuario registrado:', newUser);
    return newUser;
  };

  const login = async (username, password) => {
    const users = getStoredUsers();
    const foundUser = users.find(
      (user) => user.username === username && user.password === password
    );

    if (foundUser) {
      setIsAuthenticated(true);
      setCurrentUser({ username: foundUser.username, email: foundUser.email, role: foundUser.role });
      console.log('Login exitoso para:', foundUser.username);
      return true;
    }
    throw new Error('Credenciales inválidas.');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    console.log('Usuario deslogueado.');
  };

  const contextValue = {
    isAuthenticated,
    currentUser,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};