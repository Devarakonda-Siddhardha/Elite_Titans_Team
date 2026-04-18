import React from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator,
} from 'react-native';
import { useTeamData } from '../hooks/useTeamData';

export default function MembersScreen() {
  const { data, loading, error } = useTeamData();

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color="#1DB954" /></View>;
  if (error) return <View style={s.center}><Text style={s.err}>Failed to load: {error}</Text></View>;

  const members = data?.members ?? [];

  return (
    <FlatList
      style={s.container}
      contentContainerStyle={s.content}
      data={members}
      keyExtractor={(_, i) => String(i)}
      ListHeaderComponent={<Text style={s.heading}>Members ({members.length})</Text>}
      ListEmptyComponent={<Text style={s.empty}>No members found</Text>}
      renderItem={({ item }) => (
        <View style={s.card}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>
              {(item.player_name ?? item.name ?? '?')[0].toUpperCase()}
            </Text>
          </View>
          <View style={s.info}>
            <Text style={s.name}>{item.player_name ?? item.name ?? 'Unknown'}</Text>
            <Text style={s.role}>{item.player_role ?? item.role ?? 'Player'}</Text>
          </View>
          {item.matches_played != null && (
            <Text style={s.matches}>{item.matches_played} matches</Text>
          )}
        </View>
      )}
    />
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' },
  err: { color: '#ff4444' },
  heading: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 16 },
  empty: { color: '#888', textAlign: 'center', marginTop: 40 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1a1a1a', borderRadius: 12,
    padding: 14, marginBottom: 10,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#1DB954', justifyContent: 'center', alignItems: 'center',
    marginRight: 14,
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  info: { flex: 1 },
  name: { color: '#fff', fontWeight: '600', fontSize: 15 },
  role: { color: '#888', fontSize: 12, marginTop: 2 },
  matches: { color: '#1DB954', fontSize: 12, fontWeight: '600' },
});
