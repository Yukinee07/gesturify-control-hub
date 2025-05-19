
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkSubscription: () => Promise<any>;
  isSubscribed: boolean;
  subscriptionTier: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error.message);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await checkSubscription();
        }
      }
      
      setIsLoading(false);
    };
    
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setSession(session);
        
        if (session?.user) {
          await checkSubscription();
        } else {
          setIsSubscribed(false);
          setSubscriptionTier(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
        await checkSubscription();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: error.message || "An error occurred during sign-in.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "An error occurred during sign-up.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          variant: "destructive",
          title: "Sign out failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Signed out",
          description: "You've successfully signed out.",
        });
        setIsSubscribed(false);
        setSubscriptionTier(null);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message || "An error occurred during sign-out.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscription = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }
      
      setIsSubscribed(!!data.subscribed);
      setSubscriptionTier(data.subscription_tier);
      return data;
    } catch (error) {
      console.error('Error checking subscription:', error);
      setIsSubscribed(false);
      setSubscriptionTier(null);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    checkSubscription,
    isSubscribed,
    subscriptionTier,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
