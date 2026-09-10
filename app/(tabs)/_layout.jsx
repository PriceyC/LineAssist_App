import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    Home,
    ClipboardList,
    Plus
} from 'lucide-react-native';

//tab lout page renders and routes the bottom navigational buttons
export default function TabLayout() {
    //sets safe area for avoiding android buttons at bottom of screen if present
    const insets = useSafeAreaInsets();

    return (
        // tab bar styling 
        <Tabs
            screenOptions={{
                headerShown: false,

                tabBarActiveTintColor: '#2563eb',
                tabBarInactiveTintColor: '#94a3b8',

                tabBarStyle: {
                    height: 60 + insets.bottom,
                    paddingTop: 8,
                    paddingBottom: insets.bottom + 6,
                    borderTopWidth: 1,
                    borderTopColor: '#e2e8f0',
                    backgroundColor: '#ffffff',
                },

                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >

            {/* render each button below using the styling */}
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Home
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="incidents"
                options={{
                    title: 'Incidents',
                    tabBarIcon: ({ color, size }) => (
                        <ClipboardList
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="create"
                options={{
                    title: 'Create',
                    tabBarIcon: ({ color, size }) => (
                        <Plus
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}