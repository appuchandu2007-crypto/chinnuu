import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../supabase';

export interface UserProfile {
  id: string; // use id instead of uid
  name?: string;
  email?: string;
  gender?: string;
  dob?: string;
  age?: number;
  emotion?: string;
  phone_number?: string;
  language?: string;
  created_at: string | number;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (data) {
        setProfile(data as UserProfile);
      } else if (error && error.code === 'PGRST116') {
        // Create initial profile
        const newProfile = {
          id: userId,
          name: currentUser.user_metadata?.name || '',
          email: currentUser.email || '',
        };
        const { error: insertError } = await supabase.from('profiles').insert([newProfile]);
        if (!insertError) {
          setProfile({ ...newProfile, created_at: Date.now() } as UserProfile);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
        
      if (error) {
        console.warn("Supabase update error:", error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      // Always update local state so the app flow can continue using the newly provided values
      setProfile(prev => prev ? { ...prev, ...data } : { id: user.id, created_at: Date.now(), ...data });
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, updateProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
