import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import type { AuthContextType } from './types';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
