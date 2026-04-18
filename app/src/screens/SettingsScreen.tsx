import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { useTeamData } from '../hooks/useTeamData';
import { colors as c } from '../theme';

const LOGO = require('../../assets/logo.jpg');
const JERSEY = require('../../assets/jersey.png');

const TEAM_ID = '6955664';
const CRICHEROES_URL = `https://cricheroes.com/team-profile/${TEAM_ID}/elite-titans`;

export default function SettingsScreen() {
  const { data } = useTeamData();
  const team = data?.team;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Image source={LOGO} style={s.banner} resizeMode="contain" />

      <View style={s.profileRow}>
        <Image source={JERSEY} style={s.jersey} resizeMode="contain" />
        <View>
          <Text style={s.teamName}>{team?.team_name ?? 'Elite Titans'}</Text>
          <Text style={s.tagline}>Hyderabad · Est. 2024</Text>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>Team</Text>
        <Row label="Name" value={team?.team_name ?? 'Elite Titans'} />
        <Row label="City" value="Hyderabad" />
        <Row label="Founded" value="2024" />
        <Row label="Captain" value="Akhilesh Aravapalli" captain />
        <Row label="Team ID" value={TEAM_ID} />
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>Links</Text>
        <TouchableOpacity onPress={() => Linking.openURL(CRICHEROES_URL)} style={s.link}>
          <Text style={s.linkText}>View on Cricheroes ↗</Text>
        </TouchableOpacity>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>Data</Text>
        <Row label="Last synced" value={data?.scraped_at ? new Date(data.scraped_at).toLocaleString() : '—'} />
        <Row label="Matches" value={String(data?.matches?.length ?? 0)} />
        <Row label="Members" value={String(data?.members?.length ?? 0)} />
      </View>
    </ScrollView>
  );
}

function Row({ label, value, captain }: { label: string; value: string | number; captain?: boolean }) {
  return (
    <View style={s.row}>
      <Text style={s.key}>{label}</Text>
      <View style={s.valRow}>
        {captain && <Text style={s.captainBadge}>C</Text>}
        <Text style={s.val}>{String(value)}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg },
  content: { paddingBottom: 40 },
  banner: { width: '100%', height: 220, backgroundColor: '#1a0000' },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: c.border },
  jersey: { width: 80, height: 80 },
  teamName: { color: c.text, fontSize: 20, fontWeight: '900', letterSpacing: 0.5 },
  tagline: { color: c.accent, fontSize: 13, fontWeight: '600', marginTop: 3 },
  card: { backgroundColor: c.card, borderRadius: 12, padding: 16, marginHorizontal: 16, marginTop: 16, borderWidth: 1, borderColor: c.border },
  cardTitle: { color: c.accent, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: c.border },
  key: { color: c.sub, fontSize: 14 },
  valRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  captainBadge: { backgroundColor: c.accent, color: '#000', fontSize: 10, fontWeight: '900', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  val: { color: c.text, fontSize: 14, fontWeight: '600', maxWidth: 200, textAlign: 'right' },
  link: { paddingVertical: 10 },
  linkText: { color: c.accent, fontSize: 15, fontWeight: '600' },
});
