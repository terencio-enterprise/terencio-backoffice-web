import { useEffect, useState } from 'react';
import { AuthService } from '../services/auth.service';
import type { LoginRequest, LoginResponse } from '../types';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      const isAuth = AuthService.isAuthenticated();
      if (isAuth) {
        // Load user data from localStorage if available
        const savedUser = localStorage.getItem('terencio_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(credentials);
      setUser(response);
      localStorage.setItem('terencio_user', JSON.stringify(response));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('terencio_user');
    AuthService.logout();
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
