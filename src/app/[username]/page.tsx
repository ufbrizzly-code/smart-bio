import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { LinkTree } from '@/components/LinkTree';
import { Profile, Link } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ username: string }>;
}

// Demo data for when Supabase isn't configured yet
const DEMO_PROFILE: Profile = {
  id: 'demo',
  username: 'demo',
  full_name: 'Abdullah',
  bio: 'Creator & Developer 🚀 Building cool things on the internet.',
  avatar_url: '',
  created_at: new Date().toISOString(),
};

const DEMO_LINKS: Link[] = [
  { id: '1', profile_id: 'demo', title: '🎵 My Latest Track on Spotify', url: 'https://spotify.com', position: 0, is_visible: true, created_at: '', click_count: 342 },
  { id: '2', profile_id: 'demo', title: '🛒 Exclusive Merch Store', url: 'https://example.com', position: 1, is_visible: true, created_at: '', click_count: 218 },
  { id: '3', profile_id: 'demo', title: '📸 Follow me on Instagram', url: 'https://instagram.com', position: 2, is_visible: true, created_at: '', click_count: 156 },
  { id: '4', profile_id: 'demo', title: '🇸🇪 Swedish Summer Offer (Limited!)', url: 'https://example.com', position: 3, is_visible: true, created_at: '', click_count: 89,
    rules: [{ id: 'r1', link_id: '4', rule_type: 'click_limit', config: { max_clicks: 500 }, is_active: true }]
  },
];

export default async function UsernamePage({ params }: PageProps) {
  const { username } = await params;
  const cleanUsername = username.replace('@', '').toLowerCase();

  // If Supabase isn't configured, show demo mode
  if (!isSupabaseConfigured()) {
    return (
      <main className="min-h-screen bg-background text-foreground/90 selection:bg-accent/10">
        <LinkTree 
          profile={{ ...DEMO_PROFILE, username: cleanUsername, full_name: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1) }} 
          links={DEMO_LINKS} 
        />
      </main>
    );
  }

  // Real Supabase mode
  const supabase = getSupabase();

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', cleanUsername)
    .single();

  if (profileError || !profile) {
    return (
      <div className="min-h-screen grid place-items-center text-center p-8">
        <div className="space-y-4 max-w-sm">
          <h2 className="text-2xl font-bold">Profile Not Found</h2>
          <p className="text-foreground/60">
            This profile hasn&apos;t been claimed yet. Claim @{cleanUsername} on our homepage!
          </p>
          <a href="/" className="inline-block glass px-6 py-2 rounded-full font-medium hover:bg-accent hover:text-background transition-all">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const { data: links, error: linksError } = await supabase
    .from('links')
    .select(`
      *,
      rules:link_rules(*)
    `)
    .eq('profile_id', profile.id)
    .order('position', { ascending: true });

  if (linksError) {
    console.error('Error fetching links:', linksError);
  }

  return (
    <main className="min-h-screen bg-background text-foreground/90 selection:bg-accent/10">
      <LinkTree 
        profile={profile as Profile} 
        links={(links || []) as Link[]}
      />
    </main>
  );
}
