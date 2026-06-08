import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../api/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    const storedToken = await AsyncStorage.getItem('@token');
    const storedUser = await AsyncStorage.getItem('@user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }

  async function signIn(email, password) {
    const response = await authService.login({ email, password });
    const { token, user } = response.data.data;

    setToken(token);
    setUser(user);

    await AsyncStorage.setItem('@token', token);
    await AsyncStorage.setItem('@user', JSON.stringify(user));
  }

  async function signOut() {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('@token');
    await AsyncStorage.removeItem('@user');
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}