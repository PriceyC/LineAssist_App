import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';

//renders most recent incident for site on dashboard 
export default function NewestIncidentCard({ incident }){
    //if no incidents created on site, which wont show as we have seeded data, render message to the user
    if (!incident) {
        return (
            <View className="bg-white rounded-xl p-4 mb-3 border border-slate-200">
                <Text className="text-base font-semibold text-slate-900">
                    No recent incidents
                </Text>

                <Text className="text-xs text-slate-500 mt-1">
                    No incidents have been recorded for this site.
                </Text>
            </View>
        );
    }

    return (
        <Pressable
            className="bg-white rounded-xl p-4 mb-3 border border-slate-200 active:bg-slate-50"
            style={{ elevation: 3 }}
            onPress={() =>
                router.push({
                    pathname: '/incidents/[id]',
                    params: {
                        id: String(
                            incident.incidentid ??
                            incident.incident_id
                        ),
                    },
                })
            }
        >
            <View className="flex-row items-center">
                <View className="flex-1 mr-4">
                    <Text
                        className="text-base font-semibold text-slate-900"
                        numberOfLines={1}
                    >
                        {incident.title}
                    </Text>

                    <Text
                        className="text-xs text-slate-500 mt-1"
                        numberOfLines={1}
                    >
                        {incident.description}
                    </Text>
                </View>

                <View className="items-end justify-between">
                    <View className="bg-slate-100 rounded-full px-3 py-1">
                        <Text className="text-xs font-medium text-slate-700">
                            Priority: {incident.severitydesc}
                        </Text>
                    </View>

                    <ChevronRight
                        size={22}
                        color="#64748b"
                        strokeWidth={2.5}
                        style={{ marginTop: 10 }}
                    />
                </View>
            </View>
        </Pressable>
    );
}