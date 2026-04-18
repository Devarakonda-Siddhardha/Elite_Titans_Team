import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text, Image } from 'react-native';
import DashboardScreen from './src/screens/DashboardScreen';
import MembersScreen from './src/screens/MembersScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { colors as c } from './src/theme';

const Tab = createBottomTabNavigator();
const LOGO = require('./assets/logo.jpg');

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
          headerStyle: { backgroundColor: c.bg, shadowColor: 'transparent', elevation: 0, borderBottomWidth: 1, borderBottomColor: c.border },
          headerTitleStyle: { color: c.text, fontWeight: '800', fontSize: 18 },
          headerRight: () => (
            <Image source={LOGO} style={{ width: 32, height: 32, borderRadius: 6, marginRight: 14, borderWidth: 1, borderColor: c.accent }} resizeMode="cover" />
          ),
          tabBarStyle: { backgroundColor: c.bg, borderTopColor: c.border, paddingBottom: 6, height: 62 },
          tabBarActiveTintColor: c.accent,
          tabBarInactiveTintColor: c.muted,
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 11, marginBottom: 2 }}>{route.name}</Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: focused ? 24 : 21 }}>{icons[route.name]}</Text>
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
