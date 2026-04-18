import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { useTeamData } from '../hooks/useTeamData';

const FILTERS = ['All', 'Won', 'Lost', 'Draw'];

export default function MatchesScreen() {
  const { data, loading, error } = useTeamData();
  const [filter, setFilter] = useState('All');

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color="#1DB954" /></View>;
  if (error) return <View style={s.center}><Text style={s.err}>Failed to load: {error}</Text></View>;

  const matches = (data?.matches ?? []).filter(m => {
    if (filter === 'All') return true;
    return (m.result ?? m.match_result ?? '').toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <View style={s.container}>
      {/* Filter pills */}
      <View style={s.filters}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[s.pill, filter === f && s.pillActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[s.pillText, filter === f && s.pillTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        contentContainerStyle={s.content}
        data={matches}
        keyExtractor={(_, i) => String(i)}
        ListHeaderComponent={<Text style={s.heading}>Matches ({matches.length})</Text>}
        ListEmptyComponent={<Text style={s.empty}>No matches found</Text>}
        renderItem={({ item }) => {
          const result = item.result ?? item.match_result ?? '';
          const won = result.toLowerCase().includes('won');
          const lost = result.toLowerCase().includes('lost');
          return (
            <View style={s.card}>
              <View style={[s.resultBar, won ? s.won : lost ? s.lost : s.draw]} />
              <View style={s.cardBody}>
                <Text style={s.opponent}>
                  vs {item.opponent_team_name ?? item.team_b_name ?? 'Opponent'}
                </Text>
                <Text style={s.meta}>
                  {item.match_date ?? item.date ?? ''}{item.venue ? ` · ${item.venue}` : ''}
                </Text>
                <Text style={[s.result, won ? s.wonText : lost ? s.lostText : s.drawText]}>
                  {result || 'Result pending'}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' },
  err: { color: '#ff4444' },
  filters: { flexDirection: 'row', padding: 16, gap: 8 },
  pill: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20, backgroundColor: '#1a1a1a',
  },
  pillActive: { backgroundColor: '#1DB954' },
  pillText: { color: '#888', fontSize: 13 },
  pillTextActive: { color: '#fff', fontWeight: '700' },
  heading: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 16 },
  empty: { color: '#888', textAlign: 'center', marginTop: 40 },
  card: {
    flexDirection: 'row', backgroundColor: '#1a1a1a',
    borderRadius: 12, marginBottom: 10, overflow: 'hidden',
  },
  resultBar: { width: 4 },
  won: { backgroundColor: '#1DB954' },
  lost: { backgroundColor: '#ff4444' },
  draw: { backgroundColor: '#888' },
  cardBody: { flex: 1, padding: 14 },
  opponent: { color: '#fff', fontWeight: '700', fontSize: 15 },
  meta: { color: '#888', fontSize: 12, marginTop: 2 },
  result: { fontSize: 13, fontWeight: '600', marginTop: 6 },
  wonText: { color: '#1DB954' },
  lostText: { color: '#ff4444' },
  drawText: { color: '#888' },
});
