import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity } from 'react-native';
import DashboardScreen from './src/screens/DashboardScreen';
import MembersStack from './src/screens/MembersStack';
import MatchesScreen from './src/screens/MatchesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import MyProfileScreen from './src/screens/MyProfileScreen';
import { colors as c } from './src/theme';

const Tab = createBottomTabNavigator();
const Root = createNativeStackNavigator();

// TODO: replace with real user name from auth
const MY_INITIAL = 'S';

const icons: Record<string, string> = {
  Dashboard: '🏏',
  Members: '👥',
  Matches: '⚔️',
  Settings: '⚙️',
};

function ProfileButton() {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('MyProfile')} activeOpacity={0.75} style={{ marginRight: 14 }}>
      <View style={{
        width: 34, height: 34, borderRadius: 17,
        backgroundColor: c.fire, borderWidth: 2, borderColor: c.accent,
        justifyContent: 'center', alignItems: 'center',
      }}>
        <Text style={{ color: '#fff', fontWeight: '900', fontSize: 16 }}>{MY_INITIAL}</Text>
      </View>
    </TouchableOpacity>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: c.bg, shadowColor: 'transparent', elevation: 0, borderBottomWidth: 1, borderBottomColor: c.border },
        headerTitleStyle: { color: c.text, fontWeight: '800', fontSize: 18 },
        headerRight: () => <ProfileButton />,
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
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Root.Navigator screenOptions={{ headerShown: false }}>
          <Root.Screen name="Tabs" component={Tabs} />
          <Root.Screen
            name="MyProfile"
            component={MyProfileScreen}
            options={{
              presentation: 'modal',
              headerShown: true,
              title: MY_INITIAL,
              headerStyle: { backgroundColor: c.bg },
              headerTitleStyle: { color: c.text, fontWeight: '900', fontSize: 22 },
              headerTintColor: c.accent,
            }}
          />
        </Root.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
