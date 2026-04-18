import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MembersScreen from './MembersScreen';
import PlayerProfileScreen from './PlayerProfileScreen';
import { colors as c } from '../theme';

const Stack = createNativeStackNavigator();

export default function MembersStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: c.bg },
        headerTintColor: c.accent,
        headerTitleStyle: { color: c.text, fontWeight: '800' },
        headerBackTitle: 'Squad',
        contentStyle: { backgroundColor: c.bg },
      }}
    >
      <Stack.Screen name="MembersList" component={MembersScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="PlayerProfile"
        component={PlayerProfileScreen}
        options={({ route }: any) => ({ title: route.params?.member?.name ?? 'Player' })}
      />
    </Stack.Navigator>
  );
}
