import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import { useTeamData } from '../hooks/useTeamData';
import { colors as c } from '../theme';

const LOGO = require('../../assets/logo.jpg');

export default function MembersScreen() {
  const { data, loading, error } = useTeamData();

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color={c.accent} /></View>;
  if (error) return <View style={s.center}><Text style={s.err}>Failed to load: {error}</Text></View>;

  const members = data?.members ?? [];

  return (
    <FlatList
      style={s.container}
      contentContainerStyle={s.content}
      data={members}
      keyExtractor={(_, i) => String(i)}
      ListHeaderComponent={<Text style={s.heading}>Squad ({members.length})</Text>}
      ListEmptyComponent={<Text style={s.empty}>No members found</Text>}
      renderItem={({ item }) => (
        <View style={s.card}>
          {item.profile_photo ? (
            <Image source={{ uri: item.profile_photo }} style={s.avatar} />
          ) : (
            <View style={[s.avatar, s.avatarFallback]}>
              <Text style={s.avatarText}>
                {(item.name ?? item.player_name ?? '?')[0].toUpperCase()}
              </Text>
            </View>
          )}
          <View style={s.info}>
            <View style={s.nameRow}>
              <Text style={s.name}>{item.name ?? item.player_name ?? 'Unknown'}</Text>
              {item.is_captain && <Text style={s.captain}>C</Text>}
            </View>
            <Text style={s.role}>{item.badges?.join(' · ') || item.player_role || 'Player'}</Text>
          </View>
        </View>
      )}
    />
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg },
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: c.bg },
  err: { color: c.fire },
  heading: { color: c.text, fontSize: 20, fontWeight: '700', marginBottom: 16 },
  empty: { color: c.sub, textAlign: 'center', marginTop: 40 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: c.card, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: c.border },
  avatar: { width: 46, height: 46, borderRadius: 23, marginRight: 14 },
  avatarFallback: { backgroundColor: c.fire, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: c.text, fontWeight: '700', fontSize: 18 },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { color: c.text, fontWeight: '600', fontSize: 15 },
  captain: { backgroundColor: c.accent, color: '#000', fontSize: 10, fontWeight: '900', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  role: { color: c.sub, fontSize: 12, marginTop: 2 },
});
