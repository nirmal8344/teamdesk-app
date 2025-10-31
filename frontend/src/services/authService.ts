import { User } from '../types';

// This is a mock authentication service.
// In a real app, it would make API calls and handle JWTs.

const MOCK_AUTH_TOKEN = 'mock-jwt-token-for-teamdesk';

export const login = (email: string, password: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simple mock validation
      if (email === 'alex@example.com' && password === 'password') {
        localStorage.setItem('authToken', MOCK_AUTH_TOKEN);
        resolve();
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
};

export const register = (userData: Pick<User, 'name'|'email'> & {password: string}): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            localStorage.setItem('authToken', MOCK_AUTH_TOKEN);
            resolve();
        }, 500);
    });
};

export const logout = (): Promise<void> => {
    return new Promise(resolve => {
        localStorage.removeItem('authToken');
        resolve();
    });
};

export const forgotPassword = (email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email) {
                console.log(`Password reset link sent to ${email}`);
                resolve();
            } else {
                reject(new Error("Email not found"));
            }
        }, 500);
    });
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('authToken') === MOCK_AUTH_TOKEN;
};
