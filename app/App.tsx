import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Text, Image, TouchableOpacity } from 'react-native';
import DashboardScreen from './src/screens/DashboardScreen';
import MembersStack from './src/screens/MembersStack';
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

function LogoButton() {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Settings')} activeOpacity={0.75}>
      <Image
        source={LOGO}
        style={{ width: 32, height: 32, borderRadius: 6, marginRight: 14, borderWidth: 1, borderColor: c.accent }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerStyle: { backgroundColor: c.bg, shadowColor: 'transparent', elevation: 0, borderBottomWidth: 1, borderBottomColor: c.border },
            headerTitleStyle: { color: c.text, fontWeight: '800', fontSize: 18 },
            headerRight: () => <LogoButton />,
            tabBarStyle: { backgroundColor: c.bg, borderTopColor: c.border },
            tabBarActiveTintColor: c.accent,
            tabBarInactiveTintColor: c.muted,
            tabBarLabel: ({ color }) => (
              <Text style={{ color, fontSize: 11 }}>{route.name}</Text>
            ),
            tabBarIcon: ({ color, focused }) => (
              <Text style={{ fontSize: focused ? 24 : 21 }}>{icons[route.name]}</Text>
            ),
          })}
        >
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
          <Tab.Screen name="Members" component={MembersStack} options={{ headerShown: false }} />
          <Tab.Screen name="Matches" component={MatchesScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
