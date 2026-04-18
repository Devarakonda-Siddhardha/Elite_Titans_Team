import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking,
} from 'react-native';
import { useTeamData } from '../hooks/useTeamData';

const TEAM_ID = '6955664';
const TEAM_SLUG = 'elite-titans';
const CRICHEROES_URL = `https://cricheroes.com/team-profile/${TEAM_ID}/${TEAM_SLUG}`;

export default function SettingsScreen() {
  const { data } = useTeamData();
  const team = data?.team;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.heading}>Profile & Settings</Text>

      {/* Team info */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Team</Text>
        <Row label="Name" value={team?.team_name ?? 'Elite Titans'} />
        <Row label="City" value={team?.city ?? '—'} />
        <Row label="Sport" value={team?.sports_type_name ?? 'Cricket'} />
        <Row label="Founded" value={team?.established_year ?? '—'} />
        <Row label="Team ID" value={TEAM_ID} />
      </View>

      {/* Links */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Links</Text>
        <TouchableOpacity onPress={() => Linking.openURL(CRICHEROES_URL)} style={s.link}>
          <Text style={s.linkText}>View on Cricheroes ↗</Text>
        </TouchableOpacity>
      </View>

      {/* Data */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Data</Text>
        <Row label="Last synced" value={data?.scraped_at ? new Date(data.scraped_at).toLocaleString() : '—'} />
        <Row label="Total matches" value={String(data?.matches?.length ?? 0)} />
        <Row label="Total members" value={String(data?.members?.length ?? 0)} />
      </View>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.key}>{label}</Text>
      <Text style={s.val}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 16, paddingBottom: 40 },
  heading: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 20 },
  card: { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, marginBottom: 16 },
  cardTitle: { color: '#1DB954', fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#2a2a2a' },
  key: { color: '#888', fontSize: 14 },
  val: { color: '#fff', fontSize: 14, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  link: { paddingVertical: 10 },
  linkText: { color: '#1DB954', fontSize: 15, fontWeight: '600' },
});
