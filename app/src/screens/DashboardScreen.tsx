import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, ImageBackground, RefreshControl } from 'react-native';
import { useTeamData, matchOutcome, opponent } from '../hooks/useTeamData';
import { colors as c } from '../theme';

const LOGO = require('../../assets/logo.jpg');
const JERSEY = require('../../assets/jersey.png');

export default function DashboardScreen() {
  const { data, loading, error, reload } = useTeamData();

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color={c.accent} /></View>;
  if (error) return <View style={s.center}><Text style={s.err}>Failed to load: {error}</Text></View>;

  const team = data?.team;
  const stats = data?.team_stats ?? [];
  const foundedYear = team?.created_date ? new Date(team.created_date).getFullYear() : '—';

  const pastMatches = (data?.matches ?? []).filter(m => m.status === 'past');
  const upcomingMatches = (data?.matches ?? []).filter(m => m.status === 'upcoming');
  const recent = pastMatches.slice(0, 3);

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} tintColor={c.accent} />}
    >
      <ImageBackground source={LOGO} style={s.heroBg} imageStyle={s.heroBgImg}>
        <View style={s.heroOverlay}>
          <Image source={JERSEY} style={s.jersey} resizeMode="contain" />
          <Text style={s.teamName}>{team?.team_name ?? 'Elite Titans'}</Text>
          <Text style={s.sub}>{team?.city_name ?? ''}{team?.city_name ? ' · ' : ''}Cricket</Text>
        </View>
      </ImageBackground>

      <View style={s.row}>
        {[
          { label: 'Matches', value: data?.matches?.length ?? 0 },
          { label: 'Members', value: data?.members?.length ?? 0 },
          { label: 'Founded', value: foundedYear },
        ].map(item => (
          <View key={item.label} style={s.statBox}>
            <Text style={s.statVal}>{item.value}</Text>
            <Text style={s.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {stats.length > 0 && (
        <View style={s.card}>
          <Text style={s.cardTitle}>Team Stats</Text>
          <View style={s.statsGrid}>
            {stats.map(row => (
              <View key={row.title} style={s.statCell}>
                <Text style={s.cellVal}>{String(row.value)}</Text>
                <Text style={s.cellLabel}>{row.title}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {upcomingMatches.length > 0 && (
        <View style={s.card}>
          <Text style={s.cardTitle}>Upcoming</Text>
          {upcomingMatches.slice(0, 3).map(m => {
            const opp = opponent(m);
            const date = new Date(m.match_start_time);
            return (
              <View key={m.match_id} style={s.matchRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.opponent}>vs {opp.name}</Text>
                  <Text style={s.meta}>
                    {date.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })} · {m.ground_name ?? m.city_name ?? ''}
                  </Text>
                </View>
                <Text style={s.upcomingTag}>Upcoming</Text>
              </View>
            );
          })}
        </View>
      )}

      {recent.length > 0 && (
        <View style={s.card}>
          <Text style={s.cardTitle}>Recent Results</Text>
          {recent.map(m => {
            const opp = opponent(m);
            const out = matchOutcome(m);
            return (
              <View key={m.match_id} style={s.matchRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.opponent}>vs {opp.name}</Text>
                  <Text style={s.meta}>{m.win_by || m.match_result || ''}</Text>
                </View>
                <Text style={[
                  s.resultTag,
                  out === 'won' ? s.tagWon : out === 'lost' ? s.tagLost : s.tagDraw
                ]}>
                  {out.toUpperCase()}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      <Text style={s.updatedAt}>
        Updated: {data?.scraped_at ? new Date(data.scraped_at).toLocaleString() : '—'}
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg },
  content: { paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: c.bg },
  err: { color: c.fire, fontSize: 14 },
  heroBg: { width: '100%', height: 280 },
  heroBgImg: { opacity: 0.35 },
  heroOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 24, backgroundColor: 'rgba(0,0,0,0.5)' },
  jersey: { width: 120, height: 120, marginBottom: 10 },
  teamName: { fontSize: 30, fontWeight: '900', color: c.text, letterSpacing: 1, textShadowColor: '#000', textShadowRadius: 8, textShadowOffset: { width: 0, height: 2 } },
  sub: { color: c.accent, marginTop: 4, fontSize: 13, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 12, margin: 16, marginBottom: 12 },
  statBox: { flex: 1, backgroundColor: c.card, borderRadius: 12, paddingVertical: 18, alignItems: 'center', borderWidth: 1, borderColor: c.border },
  statVal: { fontSize: 24, fontWeight: '700', color: c.accent },
  statLabel: { fontSize: 11, color: c.sub, marginTop: 2 },
  card: { backgroundColor: c.card, borderRadius: 12, padding: 16, marginHorizontal: 16, marginBottom: 16, borderWidth: 1, borderColor: c.border },
  cardTitle: { color: c.accent, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCell: { width: '31%', backgroundColor: c.bg, borderRadius: 8, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: c.border },
  cellVal: { color: c.text, fontSize: 18, fontWeight: '800' },
  cellLabel: { color: c.sub, fontSize: 10, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  matchRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: c.border },
  opponent: { color: c.text, fontSize: 14, fontWeight: '600' },
  meta: { color: c.sub, fontSize: 11, marginTop: 2 },
  resultTag: { fontSize: 10, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, overflow: 'hidden' },
  tagWon: { backgroundColor: c.accent, color: '#000' },
  tagLost: { backgroundColor: c.fire, color: '#fff' },
  tagDraw: { backgroundColor: c.muted, color: '#fff' },
  upcomingTag: { fontSize: 10, fontWeight: '700', color: c.accent, borderWidth: 1, borderColor: c.accent, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  updatedAt: { color: c.muted, fontSize: 11, textAlign: 'center', marginTop: 8, marginHorizontal: 16 },
});
