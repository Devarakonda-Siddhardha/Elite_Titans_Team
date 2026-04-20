import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { colors as c } from '../theme';
import { Member, PlayerStats, useTeamData } from '../hooks/useTeamData';

const JERSEY = require('../../assets/jersey.png');
const CRICHEROES_BASE = 'https://cricheroes.com/player-profile';

export default function PlayerProfileScreen({ route }: any) {
  const member: Member = route.params.member;
  const { data } = useTeamData();

  const name = member.name ?? 'Unknown';
  const initial = name[0].toUpperCase();

  // match career stats by player_id
  const stats: PlayerStats | undefined = data?.player_stats?.find(
    p => p.player_id === member.player_id
  );

  const profileUrl = member.player_id && member.slug
    ? `${CRICHEROES_BASE}/${member.player_id}/${member.slug}/career`
    : null;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* Avatar */}
      <View style={s.avatarWrap}>
        {(member.profile_photo || stats?.profile_photo) ? (
          <Image source={{ uri: member.profile_photo || stats?.profile_photo! }} style={s.avatar} />
        ) : (
          <View style={[s.avatar, s.avatarFallback]}>
            <Text style={s.avatarInitial}>{initial}</Text>
          </View>
        )}
        {member.is_captain && (
          <View style={s.captainBadge}><Text style={s.captainText}>CAPTAIN</Text></View>
        )}
      </View>

      <Text style={s.name}>{name}</Text>
      <Text style={s.role}>{stats?.playing_role || member.badges?.join(' · ') || 'Player'}</Text>

      {/* Quick career numbers */}
      {stats && (
        <View style={s.quickRow}>
          <QuickStat label="Matches" value={stats.total_matches ?? '—'} />
          <QuickStat label="Runs" value={stats.total_runs ?? '—'} accent />
          <QuickStat label="Wickets" value={stats.total_wickets ?? '—'} accent />
        </View>
      )}

      {/* Batting stats */}
      {stats && (
        <View style={s.card}>
          <Text style={s.cardTitle}>⚔️ Batting</Text>
          <Row label="Innings" value={stats.innings ?? '—'} />
          <Row label="Runs" value={stats.total_runs ?? '—'} />
          <Row label="High Score" value={stats.high_score ?? '—'} />
          <Row label="Average" value={stats.batting_avg?.toFixed(2) ?? '—'} />
          <Row label="Strike Rate" value={stats.strike_rate?.toFixed(2) ?? '—'} />
          <Row label="Fours" value={stats.fours ?? '—'} />
          <Row label="Sixes" value={stats.sixes ?? '—'} />
        </View>
      )}

      {/* Bowling stats */}
      {stats && (stats.overs_bowled || stats.economy) && (
        <View style={s.card}>
          <Text style={s.cardTitle}>🎯 Bowling</Text>
          <Row label="Wickets" value={stats.total_wickets ?? '—'} />
          <Row label="Overs" value={stats.overs_bowled ?? '—'} />
          <Row label="Economy" value={stats.economy?.toFixed(2) ?? '—'} />
          {stats.bowling_style && <Row label="Style" value={stats.bowling_style} />}
        </View>
      )}

      {/* Player info */}
      <View style={s.card}>
        <Text style={s.cardTitle}>📋 Info</Text>
        {stats?.batting_hand && <Row label="Batting" value={stats.batting_hand} />}
        {stats?.bowling_style && <Row label="Bowling" value={stats.bowling_style} />}
        {stats?.city_name && <Row label="City" value={stats.city_name} />}
        {member.player_id && <Row label="Player ID" value={String(member.player_id)} />}
      </View>

      {!stats && (
        <View style={s.noStats}>
          <Image source={JERSEY} style={s.jerseyDeco} resizeMode="contain" />
          <Text style={s.noStatsText}>Career stats load after next scrape</Text>
        </View>
      )}

      {profileUrl && (
        <TouchableOpacity style={s.btn} onPress={() => Linking.openURL(profileUrl)}>
          <Text style={s.btnText}>Full Profile on Cricheroes ↗</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

function QuickStat({ label, value, accent }: { label: string; value: any; accent?: boolean }) {
  return (
    <View style={s.quickStat}>
      <Text style={[s.quickVal, accent && { color: c.accent }]}>{String(value)}</Text>
      <Text style={s.quickLabel}>{label}</Text>
    </View>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <View style={s.row}>
      <Text style={s.key}>{label}</Text>
      <Text style={s.val}>{String(value)}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg },
  content: { alignItems: 'center', paddingBottom: 40, paddingTop: 28 },
  avatarWrap: { alignItems: 'center', marginBottom: 8 },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: c.accent },
  avatarFallback: { backgroundColor: c.fire, justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { fontSize: 44, fontWeight: '900', color: c.text },
  captainBadge: { marginTop: 10, backgroundColor: c.accent, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 20 },
  captainText: { color: '#000', fontWeight: '900', fontSize: 11, letterSpacing: 1 },
  name: { color: c.text, fontSize: 26, fontWeight: '900', marginTop: 10, letterSpacing: 0.5 },
  role: { color: c.sub, fontSize: 13, marginTop: 4, marginBottom: 16 },
  quickRow: { flexDirection: 'row', gap: 12, marginBottom: 16, paddingHorizontal: 16 },
  quickStat: { flex: 1, backgroundColor: c.card, borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: c.border },
  quickVal: { color: c.text, fontSize: 22, fontWeight: '900' },
  quickLabel: { color: c.sub, fontSize: 10, marginTop: 2 },
  card: { width: '90%', backgroundColor: c.card, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: c.border, marginBottom: 14 },
  cardTitle: { color: c.accent, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: c.border },
  key: { color: c.sub, fontSize: 13 },
  val: { color: c.text, fontSize: 13, fontWeight: '600' },
  noStats: { alignItems: 'center', marginVertical: 20 },
  jerseyDeco: { width: 80, height: 80, opacity: 0.2 },
  noStatsText: { color: c.muted, fontSize: 12, marginTop: 8, fontStyle: 'italic' },
  btn: { width: '90%', backgroundColor: c.fire, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  btnText: { color: c.text, fontWeight: '700', fontSize: 15 },
});
