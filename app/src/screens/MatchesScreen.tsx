import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useTeamData, matchOutcome, opponent, Match } from '../hooks/useTeamData';
import { colors as c } from '../theme';

const FILTERS: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'won', label: 'Won' },
  { key: 'lost', label: 'Lost' },
];

export default function MatchesScreen() {
  const { data, loading, error, reload } = useTeamData();
  const [filter, setFilter] = useState('all');

  const matches = useMemo(() => {
    const all = data?.matches ?? [];
    const sorted = [...all].sort((a, b) =>
      new Date(b.match_start_time).getTime() - new Date(a.match_start_time).getTime()
    );
    if (filter === 'all') return sorted;
    return sorted.filter(m => matchOutcome(m) === filter);
  }, [data, filter]);

  if (loading && !data) return <View style={s.center}><ActivityIndicator size="large" color={c.accent} /></View>;
  if (error) return <View style={s.center}><Text style={s.err}>Failed to load: {error}</Text></View>;

  return (
    <View style={s.container}>
      <View style={s.filters}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[s.pill, filter === f.key && s.pillActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[s.pillText, filter === f.key && s.pillTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        contentContainerStyle={s.content}
        data={matches}
        keyExtractor={m => String(m.match_id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} tintColor={c.accent} />}
        ListHeaderComponent={<Text style={s.heading}>{matches.length} {matches.length === 1 ? 'match' : 'matches'}</Text>}
        ListEmptyComponent={<Text style={s.empty}>No matches found</Text>}
        renderItem={({ item }) => <MatchCard m={item} />}
      />
    </View>
  );
}

function MatchCard({ m }: { m: Match }) {
  const opp = opponent(m);
  const out = matchOutcome(m);
  const date = new Date(m.match_start_time);
  const dateStr = date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });

  const barStyle = out === 'won' ? s.barWon : out === 'lost' ? s.barLost : out === 'upcoming' ? s.barUpcoming : s.barDraw;
  const tagStyle = out === 'won' ? s.tagWon : out === 'lost' ? s.tagLost : out === 'upcoming' ? s.tagUpcoming : s.tagDraw;

  return (
    <View style={s.card}>
      <View style={[s.bar, barStyle]} />
      <View style={s.cardBody}>
        <View style={s.cardTop}>
          {opp.logo ? (
            <Image source={{ uri: opp.logo }} style={s.oppLogo} />
          ) : (
            <View style={[s.oppLogo, s.oppLogoFallback]}>
              <Text style={s.oppLogoText}>{(opp.name || '?')[0]}</Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={s.opponent}>vs {opp.name}</Text>
            <Text style={s.meta}>{dateStr}{m.ground_name ? ` · ${m.ground_name}` : ''}</Text>
          </View>
          <Text style={[s.tag, tagStyle]}>{out.toUpperCase()}</Text>
        </View>
        {(m.match_result || m.win_by) && (
          <Text style={s.result}>{m.match_result}{m.win_by ? ` ${m.win_by}` : ''}</Text>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg },
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: c.bg },
  err: { color: c.fire },
  filters: { flexDirection: 'row', padding: 16, gap: 8, flexWrap: 'wrap' },
  pill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: c.card, borderWidth: 1, borderColor: c.border },
  pillActive: { backgroundColor: c.accent, borderColor: c.accent },
  pillText: { color: c.sub, fontSize: 12, fontWeight: '600' },
  pillTextActive: { color: '#000', fontWeight: '700' },
  heading: { color: c.sub, fontSize: 12, fontWeight: '600', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  empty: { color: c.sub, textAlign: 'center', marginTop: 40 },
  card: { flexDirection: 'row', backgroundColor: c.card, borderRadius: 12, marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: c.border },
  bar: { width: 4 },
  barWon: { backgroundColor: c.accent },
  barLost: { backgroundColor: c.fire },
  barDraw: { backgroundColor: c.muted },
  barUpcoming: { backgroundColor: '#4a90e2' },
  cardBody: { flex: 1, padding: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  oppLogo: { width: 40, height: 40, borderRadius: 20 },
  oppLogoFallback: { backgroundColor: c.fire, justifyContent: 'center', alignItems: 'center' },
  oppLogoText: { color: '#fff', fontWeight: '800' },
  opponent: { color: c.text, fontWeight: '700', fontSize: 15 },
  meta: { color: c.sub, fontSize: 11, marginTop: 2 },
  tag: { fontSize: 10, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, overflow: 'hidden' },
  tagWon: { backgroundColor: c.accent, color: '#000' },
  tagLost: { backgroundColor: c.fire, color: '#fff' },
  tagDraw: { backgroundColor: c.muted, color: '#fff' },
  tagUpcoming: { backgroundColor: '#4a90e2', color: '#fff' },
  result: { color: c.sub, fontSize: 12, marginTop: 8, paddingLeft: 52, fontWeight: '500' },
});
