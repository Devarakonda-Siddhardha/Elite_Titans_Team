import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, Image,
} from 'react-native';
import { useTeamData } from '../hooks/useTeamData';

const JERSEY = require('../../assets/jersey.png');

export default function DashboardScreen() {
  const { data, loading, error } = useTeamData();

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color="#1DB954" /></View>;
  if (error) return <View style={s.center}><Text style={s.err}>Failed to load: {error}</Text></View>;

  const team = data?.team;
  const stats = data?.team_stats;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* Header */}
      <View style={s.hero}>
        <Image source={JERSEY} style={s.jersey} resizeMode="contain" />
        <Text style={s.teamName}>{team?.team_name ?? 'Elite Titans'}</Text>
        <Text style={s.sub}>{team?.city ?? ''} · {team?.sports_type_name ?? 'Cricket'}</Text>
      </View>

      {/* Quick Stats */}
      <View style={s.row}>
        {[
          { label: 'Matches', value: data?.matches?.length ?? 0 },
          { label: 'Members', value: data?.members?.length ?? 0 },
          { label: 'Founded', value: team?.established_year ?? '—' },
        ].map(item => (
          <View key={item.label} style={s.statBox}>
            <Text style={s.statVal}>{item.value}</Text>
            <Text style={s.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Team Stats */}
      {stats && (
        <View style={s.card}>
          <Text style={s.cardTitle}>Team Stats</Text>
          {Object.entries(stats).slice(0, 8).map(([k, v]) => (
            <View key={k} style={s.statRow}>
              <Text style={s.key}>{k.replace(/_/g, ' ')}</Text>
              <Text style={s.val}>{String(v)}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={s.updatedAt}>
        Updated: {data?.scraped_at ? new Date(data.scraped_at).toLocaleString() : '—'}
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' },
  err: { color: '#ff4444', fontSize: 14 },
  hero: { alignItems: 'center', paddingVertical: 20 },
  jersey: { width: 160, height: 160, marginBottom: 12 },
  teamName: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  sub: { color: '#888', marginTop: 4, fontSize: 13 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statBox: {
    flex: 1, backgroundColor: '#1a1a1a', borderRadius: 12,
    paddingVertical: 18, alignItems: 'center',
  },
  statVal: { fontSize: 24, fontWeight: '700', color: '#1DB954' },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  card: { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, marginBottom: 16 },
  cardTitle: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 12 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#2a2a2a' },
  key: { color: '#aaa', fontSize: 13, textTransform: 'capitalize' },
  val: { color: '#fff', fontSize: 13, fontWeight: '600' },
  updatedAt: { color: '#555', fontSize: 11, textAlign: 'center', marginTop: 8 },
});
