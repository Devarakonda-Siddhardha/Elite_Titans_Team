import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import DashboardScreen from './src/screens/DashboardScreen';
import MembersScreen from './src/screens/MembersScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const icons: Record<string, string> = {
  Dashboard: '🏏',
  Members: '👥',
  Matches: '⚔️',
  Settings: '⚙️',
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: '#0a0a0a', shadowColor: 'transparent' },
          headerTitleStyle: { color: '#fff', fontWeight: '700' },
          tabBarStyle: {
            backgroundColor: '#111',
            borderTopColor: '#222',
            paddingBottom: 6,
            height: 60,
          },
          tabBarActiveTintColor: '#1DB954',
          tabBarInactiveTintColor: '#555',
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 11, marginBottom: 2 }}>{route.name}</Text>
          ),
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22 }}>{icons[route.name]}</Text>
          ),
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Members" component={MembersScreen} />
        <Tab.Screen name="Matches" component={MatchesScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
