'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase';

export interface ProfileData {
  id: string;
  username: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  button_style: string | null;
  theme: string | null;
}

export interface LinkData {
  id: string;
  profile_id: string;
  title: string;
  url: string;
  position: number;
  is_visible: boolean;
}

interface ProfileContextValue {
  profile: ProfileData | null;
  links: LinkData[];
  loading: boolean;
  refreshLinks: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setLinks: React.Dispatch<React.SetStateAction<LinkData[]>>;
}

const ProfileContext = createContext<ProfileContextValue>({
  profile: null,
  links: [],
  loading: true,
  refreshLinks: async () => {},
  refreshProfile: async () => {},
  setLinks: () => {},
});

export function ProfileProvider({ children, userId }: { children: React.ReactNode; userId: string }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  const refreshProfile = useCallback(async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, username, full_name, bio, avatar_url, button_style, theme')
      .eq('id', userId)
      .single();
    if (data) setProfile(data as ProfileData);
  }, [userId]);

  const refreshLinks = useCallback(async () => {
    const { data } = await supabase
      .from('links')
      .select('*')
      .eq('profile_id', userId)
      .order('position', { ascending: true });
    if (data) setLinks(data as LinkData[]);
  }, [userId]);

  useEffect(() => {
    const init = async () => {
      await Promise.all([refreshProfile(), refreshLinks()]);
      setLoading(false);
    };
    init();
  }, [refreshProfile, refreshLinks]);

  return (
    <ProfileContext.Provider value={{ profile, links, loading, refreshLinks, refreshProfile, setLinks }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
