import { View, ActivityIndicator, Text } from 'react-native';

export default function LoadingScreen({ message = 'Loading...' }){
    return (
        <View className="flex-1 items-center justify-center bg-slate-50">
            <ActivityIndicator size="large" color="#2563eb" />

            <Text className="mt-4 text-sm font-medium text-slate-500">
                {message}
            </Text>
        </View>
    );
}