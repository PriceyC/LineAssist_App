import { View, Text, Pressable} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';
import Logo from '../Logo';

//dashboard header to display user and site infomation + logo and logout button
export default function DashboardHeader({ siteName }) {
    //already has site name pass as prop, so pulls user and logout from global auth
    const { user, logout } = useAuth();

    return (
        <View className="flex-row items-center justify-between bg-blue-950 px-6 pt-14 pb-5 border-b border-slate-100">
            <View>
                <Text className="text-lg font-semibold text-slate-400">
                    Site
                </Text>

                <Text className="text-3xl font-extrabold text-white">
                    {siteName}
                </Text>

                <View className="mt-4">
                    <Text className="text-base font-semibold text-white">
                        Welcome: {user?.name}
                    </Text>

                    <Text className="text-sm text-slate-500">
                        {user?.role}
                    </Text>
                </View>
            </View>

            {/* logo + logout button */}
            <View className="mt-8 items-center">
                <Logo width="w-16" height="h-16" />

                <Pressable
                    className="rounded-lg bg-red-600 px-3 py-2 active:bg-red-700"
                    onPress={() => {
                        logout();
                        router.replace('/login');
                    }}
                >
                    <Text className="text-xs font-semibold text-white">
                        Log Out
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}