import { View, Text, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import LoadingScreen from '../components/loadingState';

//login screen to login to the app
export default function Login(){
    //sets state for data and loading/error state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [siteId, setSiteId] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //sets the user in global auth
    const { loginUser } = useAuth();

    //log in logic that checks the credentials entered
    const handleLogin = async () => {

        //if missing input throws error
        if (!email.trim() || !password || !siteId.trim()) {
            setError('Please enter your email, password and site ID.');
            return;
        }

        //sets loading to true to start animation
        setLoading(true);
        setError(null);

        //attempts to login user
        try {
            await loginUser(
                email.trim(),
                password,
                siteId.trim()
            );

            //if successful routes to home
            router.replace('/(tabs)/home');

        } catch (error) {
            //if fails throws an error of unsuccesfful login
            console.error('Login failed:', error);
            setError('Invalid email, password or site ID.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingScreen message="Loading your Dashboard..." />;
    }

    return (
        <View className="flex-1 justify-center bg-slate-100 p-6">
            <Logo width='w-32' height='h-32'/>

            <Text className="text-4xl font-bold text-blue-950">
                LineAssist
            </Text>

            <Text className="mt-2 text-lg text-slate-500">
                Diagnostics & support for autocoding systems
            </Text>

            <View className="mt-8">
                <Text className="font-semibold text-slate-600">
                    Email
                </Text>

                <TextInput
                    className="mt-2 rounded-xl bg-white p-4 text-slate-900 border border-slate-300"
                    placeholder="Enter your email"
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <Text className="mt-4 font-semibold text-slate-600">
                    Password
                </Text>

                <TextInput
                    className="mt-2 rounded-xl bg-white p-4 text-slate-900 border border-slate-300"
                    placeholder="Enter your password"
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="none"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <Text className="mt-4 font-semibold text-slate-500">
                    Site ID
                </Text>

                <TextInput
                    className="mt-2 rounded-xl bg-white p-4 text-slate-900 border border-slate-300"
                    placeholder="Enter your site ID"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    value={siteId}
                    onChangeText={setSiteId}
                />

                {/* //if error renders the error for the user */}
                {error && (
                    <Text className="mt-4 text-red-600">
                        {error}
                    </Text>
                )}

                <Pressable
                    className={`mt-6 rounded-xl p-4 ${
                        loading ? 'bg-slate-400' : 'bg-blue-950'
                    }`}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text className="text-center font-semibold text-white">
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}