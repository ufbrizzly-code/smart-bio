import { notFound } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { LinkTree } from '@/components/LinkTree';
import { Profile, Link } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ username: string }>;
}

/**
 * Public Bio Page (/username)
 */
export default async function UsernamePage({ params }: PageProps) {
  const { username } = await params;
  
  // Clean up username (remove @ if present)
  const cleanUsername = username.replace('@', '').toLowerCase();


  const supabase = getSupabase();

  // 1. Fetch Profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', cleanUsername)
    .single();

  if (profileError || !profile) {
    // If not found, show a demo page for now or 404
    // For MVP demonstration, return a mock if database is empty
    return (
      <div className="min-h-screen grid place-items-center text-center p-8">
        <div className="space-y-4 max-w-sm">
          <h2 className="text-2xl font-bold">Profile Not Found</h2>
          <p className="text-foreground/60">
            This profile hasn't been claimed yet. Claim @{cleanUsername} on our homepage!
          </p>
          <a href="/" className="inline-block glass px-6 py-2 rounded-full font-medium hover:bg-accent hover:text-background transition-all">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  // 2. Fetch Links with their rules
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
