import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { NetworkProvider, useNetwork } from '../context/NetworkContext';
import { syncPendingData } from '../services/sync';
import NetworkStatusBanner from '../components/NetworkStatusBanner';

//layout provide routing throughout the application
function AppContent() {
    //checks if app is online
    const { isOnline } = useNetwork();

    //if online then syncs any changes
    useEffect(() => {
        if (isOnline) {
            syncPendingData();
        }
    }, [isOnline]);

    return (
        <>
            <NetworkStatusBanner />

            <Stack
                 screenOptions={{
                    headerShown: false,
                    contentStyle: {
                    backgroundColor: '#ffffff',
                    },
                }}
            >
                <Stack.Screen
                    name="index"
                />

                <Stack.Screen
                    name="login"
                />

                <Stack.Screen
                    name="sites/[siteid]/lines/[lineid]"
                    options={{
                        title: 'Line',
                    }}
                />

                <Stack.Screen
                    name="incidents/[id]"
                    options={{
                        title: 'Incident',
                    }}
                />

                <Stack.Screen
                    name="incidents/create/problem"
                    options={{
                        title: 'Problem',
                    }}
                />

                <Stack.Screen
                    name="incidents/create/diagnostics"
                    options={{
                        title: 'Diagnostics',
                    }}
                />
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        //wraps app in auth global context and hten the global network context
        <NetworkProvider>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </NetworkProvider>
    );
}