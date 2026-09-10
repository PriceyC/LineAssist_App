import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

// Incident card returns relevant details for each incident
export default function IncidentCard({ incident, onPress }) {
    return (
        <Pressable
            className="mb-3 rounded-xl bg-white p-4 border border-blue-950 active:bg-slate-50"
            style={{ elevation: 3 }}
            onPress={onPress}
        >
            <View className="flex-row items-center justify-between">
                {/* incident information */}
                <View className="flex-1 mr-4">
                    <Text
                        className="text-lg font-bold text-slate-900"
                        numberOfLines={1}
                    >
                        {incident.title}
                    </Text>

                    <Text
                        className="mt-1 text-sm text-slate-600"
                        numberOfLines={1}
                    >
                        {incident.linedesc}
                    </Text>

                    <Text className="mt-2 text-xs font-semibold text-slate-500">
                        Severity: {incident.severitydesc}
                    </Text>
                </View>

                {/* status + navigation arrow */}
                <View className="flex-row items-center">
                    <View className="mr-2 rounded-full bg-slate-100 px-3 py-1">
                        <Text className="text-xs font-semibold text-slate-700">
                            {incident.statusdesc}
                        </Text>
                    </View>

                    <ChevronRight
                        size={20}
                        color="#64748b"
                        strokeWidth={2.5}
                    />
                </View>
            </View>
        </Pressable>
    );
}