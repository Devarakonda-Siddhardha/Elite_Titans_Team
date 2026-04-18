import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text, Image, View } from 'react-native';
import DashboardScreen from './src/screens/DashboardScreen';
import MembersScreen from './src/screens/MembersScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const LOGO = require('./assets/logo.jpg');

const icons: Record<string, string> = {
  Dashboard: '🏏',
  Members: '👥',
  Matches: '⚔️',
  Settings: '⚙️',
};

function HeaderLogo() {
  return (
    <Image
      source={LOGO}
      style={{ width: 32, height: 32, borderRadius: 6, marginRight: 10 }}
      resizeMode="cover"
    />
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: '#0a0a0a', shadowColor: 'transparent', elevation: 0 },
          headerTitleStyle: { color: '#fff', fontWeight: '800', fontSize: 18 },
          headerRight: () => <HeaderLogo />,
          tabBarStyle: {
            backgroundColor: '#111',
            borderTopColor: '#1e1e1e',
            paddingBottom: 6,
            height: 62,
          },
          tabBarActiveTintColor: '#f5a623',
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
