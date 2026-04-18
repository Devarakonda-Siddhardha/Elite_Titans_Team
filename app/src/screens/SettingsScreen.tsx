import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image, ImageBackground,
} from 'react-native';
import { useTeamData } from '../hooks/useTeamData';

const LOGO = require('../../assets/logo.jpg');
const JERSEY = require('../../assets/jersey.png');

const TEAM_ID = '6955664';
const TEAM_SLUG = 'elite-titans';
const CRICHEROES_URL = `https://cricheroes.com/team-profile/${TEAM_ID}/${TEAM_SLUG}`;

export default function SettingsScreen() {
  const { data } = useTeamData();
  const team = data?.team;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* Logo banner */}
      <ImageBackground source={LOGO} style={s.banner} imageStyle={s.bannerImg}>
        <View style={s.bannerOverlay}>
          <Image source={JERSEY} style={s.jersey} resizeMode="contain" />
          <Text style={s.teamName}>{team?.team_name ?? 'Elite Titans'}</Text>
          <Text style={s.sport}>{team?.sports_type_name ?? 'Cricket'}</Text>
        </View>
      </ImageBackground>

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
  content: { paddingBottom: 40 },

  banner: { width: '100%', height: 220 },
  bannerImg: { opacity: 0.4 },
  bannerOverlay: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  jersey: { width: 90, height: 90, marginBottom: 8 },
  teamName: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  sport: { color: '#f5a623', fontSize: 12, fontWeight: '600', marginTop: 2 },

  card: { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, marginHorizontal: 16, marginBottom: 16, marginTop: 16 },
  cardTitle: { color: '#f5a623', fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#2a2a2a' },
  key: { color: '#888', fontSize: 14 },
  val: { color: '#fff', fontSize: 14, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  link: { paddingVertical: 10 },
  linkText: { color: '#f5a623', fontSize: 15, fontWeight: '600' },
});
