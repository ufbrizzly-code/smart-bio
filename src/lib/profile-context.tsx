'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase';
import { Profile, Link as AppLink } from '@/lib/types';

export interface LinkData extends AppLink {}

interface ProfileContextValue {
  profile: Profile | null;
  links: LinkData[];
  loading: boolean;
  refreshLinks: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setLinks: React.Dispatch<React.SetStateAction<LinkData[]>>;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
}

const ProfileContext = createContext<ProfileContextValue>({
  profile: null,
  links: [],
  loading: true,
  refreshLinks: async () => {},
  refreshProfile: async () => {},
  setLinks: () => {},
  setProfile: () => {},
});

export function ProfileProvider({ children, userId }: { children: React.ReactNode; userId: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  const refreshProfile = useCallback(async () => {
    let { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    // Fail-safe: Create a profile if the row is truly missing (PGRST116 = No rows returned)
    if (error && error.code === 'PGRST116') {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username: 'user_' + Math.floor(Math.random() * 100000), 
          theme: 'minimal',
          button_style: 'solid',
          button_roundness: 'rounder'
        })
        .select('*')
        .single();
      
      if (!insertError) {
        data = newProfile;
      } else {
        console.error("Critical: Profile creation failed after missing row check.", insertError.message, insertError.details, insertError);
      }
    } else if (error) {
      console.error("Critical: Could not fetch profile row from database.", error.message, error.details);
    }
    
    if (data) setProfile(data as Profile);
  }, [userId, supabase]);

  const refreshLinks = useCallback(async () => {
    const { data } = await supabase
      .from('links')
      .select('*')
      .eq('profile_id', userId)
      .order('position', { ascending: true });
    if (data) setLinks(data as LinkData[]);
  }, [userId, supabase]);

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([refreshProfile(), refreshLinks()]);
      } catch (err) {
        console.error("Critical: Initialization error in ProfileProvider.", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [refreshProfile, refreshLinks]);

  return (
    <ProfileContext.Provider value={{ profile, links, loading, refreshLinks, refreshProfile, setLinks, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
