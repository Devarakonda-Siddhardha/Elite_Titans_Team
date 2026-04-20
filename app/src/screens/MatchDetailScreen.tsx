import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { colors as c } from '../theme';
import { Match, matchOutcome, opponent, OUR_TEAM_ID } from '../hooks/useTeamData';

export default function MatchDetailScreen({ route }: any) {
  const m: Match = route.params.match;
  const opp = opponent(m);
  const out = matchOutcome(m);
  const date = new Date(m.match_start_time);

  const ourInnings  = m.team_a_id === OUR_TEAM_ID ? m.team_a_innings?.[0] : m.team_b_innings?.[0];
  const oppInnings  = m.team_a_id === OUR_TEAM_ID ? m.team_b_innings?.[0] : m.team_a_innings?.[0];
  const ourSummary  = m.team_a_id === OUR_TEAM_ID ? m.team_a_summary : m.team_b_summary;
  const oppSummary  = m.team_a_id === OUR_TEAM_ID ? m.team_b_summary : m.team_a_summary;

  const resultColor = out === 'won' ? c.accent : out === 'lost' ? c.fire : c.muted;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>

      {/* Result Banner */}
      <View style={[s.resultBanner, { borderColor: resultColor }]}>
        <Text style={[s.resultText, { color: resultColor }]}>
          {out === 'won' ? '🏆 WON' : out === 'lost' ? '💀 LOST' : out === 'upcoming' ? '🗓 UPCOMING' : 'NO RESULT'}
        </Text>
        <Text style={s.resultDetail}>{m.match_summary?.summary || m.match_result || ''}</Text>
      </View>

      {/* Teams */}
      <View style={s.teamsRow}>
        <TeamBlock name="Elite Titans" score={ourSummary} overs={ourInnings?.overs_played} us />
        <Text style={s.vs}>VS</Text>
        <TeamBlock name={opp.name} logo={opp.logo} score={oppSummary} overs={oppInnings?.overs_played} />
      </View>

      {/* Match Info */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Match Info</Text>
        <Row label="Date" value={date.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })} />
        <Row label="Time" value={date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} />
        {m.ground_name && <Row label="Ground" value={m.ground_name} />}
        {m.city_name && <Row label="City" value={m.city_name} />}
        <Row label="Format" value={`${m.match_type ?? 'Limited Overs'} · ${m.overs} Overs`} />
        {m.ball_type && <Row label="Ball" value={m.ball_type} />}
        {m.tournament_name ? <Row label="Tournament" value={m.tournament_name} /> : null}
        {m.toss_details ? <Row label="Toss" value={String(m.toss_details)} /> : null}
      </View>

      {/* Innings Summaries */}
      {(ourInnings || oppInnings) && (
        <View style={s.card}>
          <Text style={s.cardTitle}>Scorecard</Text>
          {ourInnings && (
            <InningsBlock
              teamName="Elite Titans"
              runs={ourInnings.total_run}
              wickets={ourInnings.total_wicket}
              overs={ourInnings.overs_played}
              extras={ourInnings.total_extra}
              us
            />
          )}
          {oppInnings && (
            <InningsBlock
              teamName={opp.name}
              runs={oppInnings.total_run}
              wickets={oppInnings.total_wicket}
              overs={oppInnings.overs_played}
              extras={oppInnings.total_extra}
            />
          )}
          <Text style={s.noStats}>
            🏏 Detailed batting & bowling stats coming soon
          </Text>
        </View>
      )}

    </ScrollView>
  );
}

function TeamBlock({ name, logo, score, overs, us }: any) {
  return (
    <View style={s.teamBlock}>
      {logo ? (
        <Image source={{ uri: logo }} style={s.teamLogo} />
      ) : (
        <View style={[s.teamLogo, s.teamLogoFallback, us && { backgroundColor: c.fire }]}>
          <Text style={s.teamLogoText}>{(name || '?')[0]}</Text>
        </View>
      )}
      <Text style={s.teamName} numberOfLines={2}>{name}</Text>
      {score ? <Text style={s.teamScore}>{score}</Text> : null}
      {overs ? <Text style={s.teamOvers}>({overs} ov)</Text> : null}
    </View>
  );
}

function InningsBlock({ teamName, runs, wickets, overs, extras, us }: any) {
  return (
    <View style={[s.innings, us && s.inningsUs]}>
      <View style={s.inningsHeader}>
        <Text style={[s.inningsTeam, us && { color: c.accent }]}>{teamName}</Text>
        <Text style={s.inningsScore}>{runs}/{wickets}</Text>
      </View>
      <Text style={s.inningsMeta}>{overs} overs · extras {extras}</Text>
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
  content: { padding: 16, paddingBottom: 40 },

  resultBanner: { borderWidth: 2, borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 16 },
  resultText: { fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  resultDetail: { color: c.sub, fontSize: 13, marginTop: 4, textAlign: 'center' },

  teamsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: c.card, borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: c.border },
  teamBlock: { flex: 1, alignItems: 'center', gap: 6 },
  teamLogo: { width: 52, height: 52, borderRadius: 26 },
  teamLogoFallback: { backgroundColor: c.muted, justifyContent: 'center', alignItems: 'center' },
  teamLogoText: { color: '#fff', fontWeight: '900', fontSize: 20 },
  teamName: { color: c.text, fontWeight: '700', fontSize: 13, textAlign: 'center' },
  teamScore: { color: c.accent, fontSize: 20, fontWeight: '900' },
  teamOvers: { color: c.sub, fontSize: 11 },
  vs: { color: c.muted, fontWeight: '900', fontSize: 16, marginHorizontal: 8 },

  card: { backgroundColor: c.card, borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: c.border },
  cardTitle: { color: c.accent, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: c.border },
  key: { color: c.sub, fontSize: 13 },
  val: { color: c.text, fontSize: 13, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },

  innings: { backgroundColor: c.bg, borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: c.border },
  inningsUs: { borderColor: c.accent },
  inningsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inningsTeam: { color: c.text, fontWeight: '700', fontSize: 14 },
  inningsScore: { color: c.accent, fontSize: 22, fontWeight: '900' },
  inningsMeta: { color: c.sub, fontSize: 11, marginTop: 4 },

  noStats: { color: c.muted, fontSize: 12, textAlign: 'center', marginTop: 8, fontStyle: 'italic' },
});
