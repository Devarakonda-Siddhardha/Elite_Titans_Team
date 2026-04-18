import { useEffect, useState } from 'react';

const GIST_URL =
  'https://gist.githubusercontent.com/raw/elite-titans.json';

// Fallback to local data.json during dev if GIST_ID not set
const DATA_URL =
  process.env.EXPO_PUBLIC_GIST_URL || GIST_URL;

export interface TeamData {
  scraped_at: string;
  team: Record<string, any> | null;
  team_stats: Record<string, any> | null;
  matches: any[];
  members: any[];
  leaderboard: any;
}

export function useTeamData() {
  const [data, setData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(DATA_URL)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
