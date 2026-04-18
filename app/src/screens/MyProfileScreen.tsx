import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useTeamData } from '../hooks/useTeamData';
import { colors as c } from '../theme';

// TODO: replace with auth/user system when ready
const MY_NAME = 'Sid';
const MY_ROLE = 'Player';

const CRICHEROES_URL = 'https://cricheroes.com/team-profile/6955664/elite-titans';

export default function MyProfileScreen({ navigation }: any) {
  const { data } = useTeamData();
  const members = data?.members ?? [];
  const me = members.find(m => m.name?.toLowerCase().includes(MY_NAME.toLowerCase()));

  const initial = MY_NAME[0].toUpperCase();

  const pastMatches = (data?.matches ?? []).filter(m => m.status === 'past');
  const won = pastMatches.filter(m => {
    const wid = typeof m.winning_team_id === 'string' ? parseInt(m.winning_team_id, 10) : m.winning_team_id;
    return wid === 6955664;
  }).length;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* Close button */}
      <TouchableOpacity style={s.closeBtn} onPress={() => navigation.goBack()}>
        <Text style={s.closeText}>✕</Text>
      </TouchableOpacity>

      {/* Avatar */}
      <View style={s.avatarWrap}>
        <View style={s.avatar}>
          <Text style={s.initial}>{initial}</Text>
        </View>
      </View>

      <Text style={s.name}>{MY_NAME}</Text>
      <Text style={s.role}>{me?.is_captain ? 'Captain' : me?.badges?.join(' · ') || MY_ROLE} · Elite Titans</Text>
      {me?.is_captain && (
        <View style={s.captainBadge}>
          <Text style={s.captainText}>CAPTAIN</Text>
        </View>
      )}

      {/* Team summary */}
      <View style={s.statsRow}>
        <Stat label="Matches" value={pastMatches.length} />
        <Stat label="Won" value={won} accent />
        <Stat label="Squad" value={data?.members?.length ?? 0} />
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>My Team</Text>
        <Row label="Team" value="Elite Titans" />
        <Row label="City" value="Hyderabad" />
        <Row label="Founded" value="2024" />
        <Row label="Captain" value="Akhilesh Aravapalli" />
      </View>

      <TouchableOpacity style={s.btn} onPress={() => Linking.openURL(CRICHEROES_URL)}>
        <Text style={s.btnText}>View Team on Cricheroes ↗</Text>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.key}>{label}</Text>
      <Text style={s.val}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg },
  content: { alignItems: 'center', paddingBottom: 40, paddingTop: 24 },
  closeBtn: { alignSelf: 'flex-end', marginRight: 20, marginBottom: 8, padding: 6 },
  closeText: { color: c.sub, fontSize: 20 },
  avatarWrap: { marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: c.fire, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: c.accent },
  initial: { fontSize: 44, fontWeight: '900', color: c.text },
  name: { fontSize: 28, fontWeight: '900', color: c.text, letterSpacing: 0.5 },
  role: { color: c.sub, fontSize: 13, marginTop: 4 },
  captainBadge: { marginTop: 10, backgroundColor: c.accent, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 20 },
  captainText: { color: '#000', fontWeight: '900', fontSize: 11, letterSpacing: 1 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 20, marginHorizontal: 16 },
  stat: { flex: 1, backgroundColor: c.card, borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: c.border },
  statVal: { color: c.text, fontSize: 20, fontWeight: '800' },
  statLabel: { color: c.sub, fontSize: 10, marginTop: 2 },
  card: { width: '90%', backgroundColor: c.card, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: c.border, marginTop: 16 },
  cardTitle: { color: c.accent, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: c.border },
  key: { color: c.sub, fontSize: 14 },
  val: { color: c.text, fontSize: 14, fontWeight: '600' },
  btn: { marginTop: 20, width: '90%', backgroundColor: c.fire, borderRadius: 12, padding: 16, alignItems: 'center' },
  btnText: { color: c.text, fontWeight: '700', fontSize: 15 },
});
