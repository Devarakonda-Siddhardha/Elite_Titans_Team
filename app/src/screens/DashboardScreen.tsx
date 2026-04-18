import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, ImageBackground,
} from 'react-native';
import { useTeamData } from '../hooks/useTeamData';

const LOGO = require('../../assets/logo.jpg');
const JERSEY = require('../../assets/jersey.png');

export default function DashboardScreen() {
  const { data, loading, error } = useTeamData();

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color="#f5a623" /></View>;
  if (error) return <View style={s.center}><Text style={s.err}>Failed to load: {error}</Text></View>;

  const team = data?.team;
  const stats = data?.team_stats;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* Hero with logo as background */}
      <ImageBackground source={LOGO} style={s.heroBg} imageStyle={s.heroBgImg}>
        <View style={s.heroOverlay}>
          <Image source={JERSEY} style={s.jersey} resizeMode="contain" />
          <Text style={s.teamName}>{team?.team_name ?? 'Elite Titans'}</Text>
          <Text style={s.sub}>{team?.city ?? ''}{team?.city ? ' · ' : ''}{team?.sports_type_name ?? 'Cricket'}</Text>
        </View>
      </ImageBackground>

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
  content: { paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' },
  err: { color: '#ff4444', fontSize: 14 },

  heroBg: { width: '100%', height: 280 },
  heroBgImg: { opacity: 0.35 },
  heroOverlay: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 24, backgroundColor: 'rgba(0,0,0,0.45)',
  },
  jersey: { width: 120, height: 120, marginBottom: 10 },
  teamName: { fontSize: 30, fontWeight: '900', color: '#fff', letterSpacing: 1, textShadowColor: '#000', textShadowRadius: 8, textShadowOffset: { width: 0, height: 2 } },
  sub: { color: '#f5a623', marginTop: 4, fontSize: 13, fontWeight: '600' },

  row: { flexDirection: 'row', gap: 12, margin: 16, marginBottom: 12 },
  statBox: {
    flex: 1, backgroundColor: '#1a1a1a', borderRadius: 12,
    paddingVertical: 18, alignItems: 'center',
    borderWidth: 1, borderColor: '#2a2a2a',
  },
  statVal: { fontSize: 24, fontWeight: '700', color: '#f5a623' },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2 },

  card: { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, marginHorizontal: 16, marginBottom: 16 },
  cardTitle: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 12 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#2a2a2a' },
  key: { color: '#aaa', fontSize: 13, textTransform: 'capitalize' },
  val: { color: '#fff', fontSize: 13, fontWeight: '600' },
  updatedAt: { color: '#555', fontSize: 11, textAlign: 'center', marginTop: 8, marginHorizontal: 16 },
});
