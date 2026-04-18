import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTeamData } from '../hooks/useTeamData';
import { colors as c } from '../theme';

const FILTERS = ['All', 'Won', 'Lost', 'Draw'];

export default function MatchesScreen() {
  const { data, loading, error } = useTeamData();
  const [filter, setFilter] = useState('All');

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color={c.accent} /></View>;
  if (error) return <View style={s.center}><Text style={s.err}>Failed to load: {error}</Text></View>;

  const matches = (data?.matches ?? []).filter(m => {
    if (filter === 'All') return true;
    return (m.result ?? m.match_result ?? '').toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <View style={s.container}>
      <View style={s.filters}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f} style={[s.pill, filter === f && s.pillActive]} onPress={() => setFilter(f)}>
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
              <View style={[s.bar, won ? s.barWon : lost ? s.barLost : s.barDraw]} />
              <View style={s.cardBody}>
                <Text style={s.opponent}>vs {item.opponent_team_name ?? item.team_b_name ?? 'Opponent'}</Text>
                <Text style={s.meta}>{item.match_date ?? item.date ?? ''}{item.venue ? ` · ${item.venue}` : ''}</Text>
                <Text style={[s.result, won ? s.textWon : lost ? s.textLost : s.textDraw]}>
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
  container: { flex: 1, backgroundColor: c.bg },
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: c.bg },
  err: { color: c.fire },
  filters: { flexDirection: 'row', padding: 16, gap: 8 },
  pill: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: c.card, borderWidth: 1, borderColor: c.border },
  pillActive: { backgroundColor: c.accent, borderColor: c.accent },
  pillText: { color: c.sub, fontSize: 13, fontWeight: '600' },
  pillTextActive: { color: '#000', fontWeight: '700' },
  heading: { color: c.text, fontSize: 20, fontWeight: '700', marginBottom: 16 },
  empty: { color: c.sub, textAlign: 'center', marginTop: 40 },
  card: { flexDirection: 'row', backgroundColor: c.card, borderRadius: 12, marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: c.border },
  bar: { width: 4 },
  barWon: { backgroundColor: c.accent },
  barLost: { backgroundColor: c.fire },
  barDraw: { backgroundColor: c.muted },
  cardBody: { flex: 1, padding: 14 },
  opponent: { color: c.text, fontWeight: '700', fontSize: 15 },
  meta: { color: c.sub, fontSize: 12, marginTop: 2 },
  result: { fontSize: 13, fontWeight: '600', marginTop: 6 },
  textWon: { color: c.accent },
  textLost: { color: c.fire },
  textDraw: { color: c.sub },
});
