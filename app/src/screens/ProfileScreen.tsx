import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { useTeamData } from '../hooks/useTeamData';
import { colors as c } from '../theme';

const LOGO = require('../../assets/logo.jpg');
const JERSEY = require('../../assets/jersey.png');

const CRICHEROES_URL = 'https://cricheroes.com/team-profile/6955664/elite-titans';

export default function ProfileScreen() {
  const { data } = useTeamData();
  const team = data?.team;

  const pastMatches = (data?.matches ?? []).filter(m => m.status === 'past');
  const won = pastMatches.filter(m => {
    const wid = typeof m.winning_team_id === 'string' ? parseInt(m.winning_team_id, 10) : m.winning_team_id;
    return wid === 6955664;
  }).length;
  const winPct = pastMatches.length ? Math.round((won / pastMatches.length) * 100) : 0;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* Logo */}
      <Image source={LOGO} style={s.logo} resizeMode="contain" />

      {/* Team name */}
      <Text style={s.teamName}>{team?.team_name ?? 'Elite Titans'}</Text>
      <Text style={s.tagline}>Hyderabad · Est. 2024</Text>

      {/* Jersey */}
      <Image source={JERSEY} style={s.jersey} resizeMode="contain" />

      {/* Win stats */}
      <View style={s.statsRow}>
        <Stat label="Played" value={pastMatches.length} />
        <Stat label="Won" value={won} accent />
        <Stat label="Win %" value={`${winPct}%`} accent />
        <Stat label="Members" value={data?.members?.length ?? 0} />
      </View>

      {/* Captain */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Leadership</Text>
        <View style={s.captainRow}>
          <View style={s.captainAvatar}>
            <Text style={s.captainInitial}>A</Text>
          </View>
          <View>
            <Text style={s.captainName}>Akhilesh Aravapalli</Text>
            <Text style={s.captainRole}>Captain</Text>
          </View>
          <View style={s.cBadge}><Text style={s.cBadgeText}>C</Text></View>
        </View>
      </View>

      <TouchableOpacity style={s.btn} onPress={() => Linking.openURL(CRICHEROES_URL)}>
        <Text style={s.btnText}>View on Cricheroes ↗</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <View style={s.stat}>
      <Text style={[s.statVal, accent && { color: c.accent }]}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg },
  content: { alignItems: 'center', paddingBottom: 40, paddingTop: 16 },
  logo: { width: 200, height: 200, borderRadius: 16 },
  teamName: { color: c.text, fontSize: 28, fontWeight: '900', marginTop: 16, letterSpacing: 1 },
  tagline: { color: c.accent, fontSize: 13, fontWeight: '600', marginTop: 4 },
  jersey: { width: 120, height: 120, marginTop: 12 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 16, marginHorizontal: 16 },
  stat: { flex: 1, backgroundColor: c.card, borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: c.border },
  statVal: { color: c.text, fontSize: 20, fontWeight: '800' },
  statLabel: { color: c.sub, fontSize: 10, marginTop: 2 },
  card: { width: '90%', backgroundColor: c.card, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: c.border, marginTop: 16 },
  cardTitle: { color: c.accent, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  captainRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  captainAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: c.fire, justifyContent: 'center', alignItems: 'center' },
  captainInitial: { color: c.text, fontSize: 22, fontWeight: '900' },
  captainName: { color: c.text, fontSize: 16, fontWeight: '700' },
  captainRole: { color: c.sub, fontSize: 12, marginTop: 2 },
  cBadge: { marginLeft: 'auto', backgroundColor: c.accent, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  cBadgeText: { color: '#000', fontWeight: '900', fontSize: 12 },
  btn: { marginTop: 20, width: '90%', backgroundColor: c.fire, borderRadius: 12, padding: 16, alignItems: 'center' },
  btnText: { color: c.text, fontWeight: '700', fontSize: 15 },
});
