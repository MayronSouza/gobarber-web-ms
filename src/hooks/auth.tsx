/* eslint-disable camelcase */
import React, { createContext, useCallback, useContext, useState } from 'react';
import api from '../services/api';

interface UserAuth {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}
interface AuthState {
  token: string;
  user: UserAuth;
}
interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: UserAuth;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoStackMS: token');
    const user = localStorage.getItem('@GoStackMS: user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem('@GoStackMS: token', token);
    localStorage.setItem('@GoStackMS: user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoStackMS: token');
    localStorage.removeItem('@GoStackMS: user');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
