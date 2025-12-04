import { createContext, useContext, ReactNode } from 'react';
import { useAuth as useClerkAuth } from '@clerk/clerk-expo';
import { useUser } from '@/hooks/useUser';

interface AuthContextType {
  user: any;
  isSignedIn: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, signOut } = useClerkAuth();
  const { user, isLoading } = useUser();

  return (
    <AuthContext.Provider value={{ user, isSignedIn: !!isSignedIn, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}