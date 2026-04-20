import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MatchesScreen from './MatchesScreen';
import MatchDetailScreen from './MatchDetailScreen';
import { colors as c } from '../theme';

const Stack = createNativeStackNavigator();

export default function MatchesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: c.bg },
        headerTintColor: c.accent,
        headerTitleStyle: { color: c.text, fontWeight: '800' },
        contentStyle: { backgroundColor: c.bg },
      }}
    >
      <Stack.Screen name="MatchesList" component={MatchesScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="MatchDetail"
        component={MatchDetailScreen}
        options={({ route }: any) => ({
          title: `vs ${route.params?.match?.team_a_id === 6955664 ? route.params?.match?.team_b : route.params?.match?.team_a}`,
        })}
      />
    </Stack.Navigator>
  );
}
