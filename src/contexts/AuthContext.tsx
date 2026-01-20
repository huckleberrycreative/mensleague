import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  };

  useEffect(() => {
    let cancelled = false;

    const applySession = (nextSession: Session | null) => {
      if (cancelled) return;

      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);

      if (nextSession?.user) {
        // Don't block routing/UI on role lookup
        checkAdminRole(nextSession.user.id)
          .then((hasAdminRole) => {
            if (!cancelled) setIsAdmin(hasAdminRole);
          })
          .catch((error) => {
            console.error('Error checking admin role:', error);
            if (!cancelled) setIsAdmin(false);
          });
      } else {
        setIsAdmin(false);
      }
    };

    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession);
    });

    // THEN get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession } }) => {
        applySession(initialSession);
      })
      .catch((error) => {
        console.error('getSession() failed:', error);
        if (!cancelled) {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Ensure context updates immediately so the UI can redirect without waiting
    // for onAuthStateChange/getSession timing.
    setSession(data.session ?? null);
    setUser(data.user ?? null);

    if (data.user) {
      // Don't block sign-in on role lookup
      checkAdminRole(data.user.id)
        .then((hasAdminRole) => setIsAdmin(hasAdminRole))
        .catch(() => setIsAdmin(false));
    } else {
      setIsAdmin(false);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    setSession(null);
    setUser(null);
    setIsAdmin(false);
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
