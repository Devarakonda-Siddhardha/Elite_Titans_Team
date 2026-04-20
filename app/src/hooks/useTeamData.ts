import { useEffect, useState, useCallback } from 'react';

const REPO = 'Devarakonda-Siddhardha/Elite_Titans_Team';
const BRANCH = 'main';
const PATH = 'scraper/data.json';

const DATA_URL =
  process.env.EXPO_PUBLIC_DATA_URL ||
  `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${PATH}`;

export interface Match {
  match_id: number;
  match_start_time: string;
  status: string;
  match_result?: string;
  win_by?: string;
  winning_team_id?: number | string;
  winning_team?: string;
  team_a_id: number;
  team_a: string;
  team_a_logo?: string;
  team_b_id: number;
  team_b: string;
  team_b_logo?: string;
  ground_name?: string;
  city_name?: string;
  overs?: number;
  match_type?: string;
  [k: string]: any;
}

export interface TeamStatRow {
  title: string;
  value: string | number;
}

export interface Member {
  player_id: number | null;
  slug: string | null;
  name: string | null;
  badges: string[];
  is_captain: boolean;
  profile_photo: string | null;
}

export interface PlayerStats {
  player_id: number;
  name: string;
  profile_photo?: string | null;
  city_name?: string;
  batting_hand?: string;
  bowling_style?: string;
  batter_category?: string;
  bowler_category?: string;
  playing_role?: string;
  dob?: string;
  total_matches?: number;
  total_runs?: number;
  total_wickets?: number;
  innings?: number | null;
  high_score?: number | null;
  batting_avg?: number | null;
  strike_rate?: number | null;
  sixes?: number | null;
  fours?: number | null;
  overs_bowled?: number | null;
  economy?: number | null;
}

export interface TeamData {
  scraped_at: string;
  team: Record<string, any> | null;
  team_stats: TeamStatRow[] | null;
  matches: Match[];
  members: Member[];
  player_stats?: PlayerStats[];
  leaderboard: any;
}

export function useTeamData() {
  const [data, setData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    return fetch(`${DATA_URL}?t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        }
      })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => {
        // guard: never replace good data with empty scrape
        if (d.matches?.length === 0 && data?.matches?.length > 0) return;
        setData(d);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}

export const OUR_TEAM_ID = 6955664;

export function matchOutcome(m: Match): 'won' | 'lost' | 'upcoming' | 'live' | 'nr' {
  if (m.status === 'upcoming') return 'upcoming';
  if (m.status === 'live') return 'live';
  const wid = typeof m.winning_team_id === 'string' ? parseInt(m.winning_team_id, 10) : m.winning_team_id;
  if (!wid) return 'nr';
  return wid === OUR_TEAM_ID ? 'won' : 'lost';
}

export function opponent(m: Match): { name: string; logo?: string } {
  if (m.team_a_id === OUR_TEAM_ID) return { name: m.team_b, logo: m.team_b_logo };
  return { name: m.team_a, logo: m.team_a_logo };
}
