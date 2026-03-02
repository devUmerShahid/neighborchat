import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from "react";
import { supabase } from '../services/supabase';

interface AuthContextType {
  user: any;
  signUp: (email: string, password: string, anonName: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Ensures a row exists in the profiles table for the given user
async function ensureProfile(user: any) {
  if (!user) return;
  const anonName = user.user_metadata?.anonymous_name || 'Anonymous';
  const { error } = await supabase
    .from('profiles')
    .upsert(
      { id: user.id, anonymous_name: anonName },
      { onConflict: 'id' }
    );
  if (error) {
    console.error('Failed to ensure profile:', error.message);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) ensureProfile(currentUser);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) ensureProfile(currentUser);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, anonName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: {
          anonymous_name: anonName
        },
      }
    });
    if (error) throw error;
    // Create profile immediately after signup
    if (data.user) await ensureProfile(data.user);
    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // Ensure profile exists on sign in
    if (data.user) await ensureProfile(data.user);
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}