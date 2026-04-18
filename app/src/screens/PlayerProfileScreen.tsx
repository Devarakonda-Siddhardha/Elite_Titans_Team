import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { colors as c } from '../theme';
import { Member } from '../hooks/useTeamData';

const JERSEY = require('../../assets/jersey.png');

const CRICHEROES_BASE = 'https://cricheroes.com/player-profile';

export default function PlayerProfileScreen({ route }: any) {
  const member: Member = route.params.member;
  const name = member.name ?? 'Unknown';
  const initial = name[0].toUpperCase();
  const profileUrl = member.player_id && member.slug
    ? `${CRICHEROES_BASE}/${member.player_id}/${member.slug}/career`
    : null;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* Avatar */}
      <View style={s.avatarWrap}>
        {member.profile_photo ? (
          <Image source={{ uri: member.profile_photo }} style={s.avatar} />
        ) : (
          <View style={[s.avatar, s.avatarFallback]}>
            <Text style={s.avatarInitial}>{initial}</Text>
          </View>
        )}
        {member.is_captain && (
          <View style={s.captainBadge}>
            <Text style={s.captainText}>CAPTAIN</Text>
          </View>
        )}
      </View>

      {/* Name */}
      <Text style={s.name}>{name}</Text>
      {member.badges?.length > 0 && (
        <Text style={s.role}>{member.badges.join(' · ')}</Text>
      )}

      {/* Jersey decoration */}
      <Image source={JERSEY} style={s.jerseyDeco} resizeMode="contain" />

      {/* Info card */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Player Info</Text>
        <Row label="Name" value={name} />
        <Row label="Role" value={member.badges?.join(', ') || 'Player'} />
        <Row label="Captain" value={member.is_captain ? 'Yes' : 'No'} />
        {member.player_id && <Row label="Player ID" value={String(member.player_id)} />}
      </View>

      {/* Cricheroes link */}
      {profileUrl && (
        <TouchableOpacity style={s.btn} onPress={() => Linking.openURL(profileUrl)}>
          <Text style={s.btnText}>View Full Stats on Cricheroes ↗</Text>
        </TouchableOpacity>
      )}
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
  container: { flex: 1, backgroundColor: c.bg },
  content: { alignItems: 'center', paddingBottom: 40, paddingTop: 32 },
  avatarWrap: { alignItems: 'center', marginBottom: 8 },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: c.accent },
  avatarFallback: { backgroundColor: c.fire, justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { fontSize: 44, fontWeight: '900', color: c.text },
  captainBadge: { marginTop: 10, backgroundColor: c.accent, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 20 },
  captainText: { color: '#000', fontWeight: '900', fontSize: 11, letterSpacing: 1 },
  name: { color: c.text, fontSize: 26, fontWeight: '900', marginTop: 12, letterSpacing: 0.5 },
  role: { color: c.sub, fontSize: 13, marginTop: 4 },
  jerseyDeco: { width: 80, height: 80, opacity: 0.25, marginVertical: 16 },
  card: { width: '90%', backgroundColor: c.card, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: c.border, marginBottom: 20 },
  cardTitle: { color: c.accent, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: c.border },
  key: { color: c.sub, fontSize: 14 },
  val: { color: c.text, fontSize: 14, fontWeight: '600' },
  btn: { width: '90%', backgroundColor: c.fire, borderRadius: 12, padding: 16, alignItems: 'center' },
  btnText: { color: c.text, fontWeight: '700', fontSize: 15 },
});
