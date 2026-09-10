import { View, Text } from "react-native";

export default function IncidentHeader({ incident }){
    return(
        <View className="bg-blue-950 rounded-xl mt-4 p-5">
            <Text className="text-2xl font-bold text-white">
                {incident.title}
            </Text>

            <Text className="mt-2 text-white">
                {incident.description}
            </Text>

            {/* incident details */}
            <View className="mt-5 flex-row flex-wrap">
                <View className="w-1/2 mb-4">
                    <Text className="text-xs font-semibold text-slate-400 uppercase">
                        Line
                    </Text>
                    <Text className="mt-1 text-base font-semibold text-white">
                        {incident.linedesc ?? incident.description}
                    </Text>
                </View>

                <View className="w-1/2 mb-4">
                    <Text className="text-xs font-semibold text-slate-400 uppercase">
                        Device
                    </Text>
                    <Text className="mt-1 text-base font-semibold text-white">
                        {incident.device_desc || 'Not assigned'}
                    </Text>
                </View>

                <View className="w-1/2">
                    <Text className="text-xs font-semibold text-slate-400 uppercase">
                        Severity
                    </Text>
                    <Text className="mt-1 text-base font-semibold text-white">
                        {incident.severitydesc}
                    </Text>
                </View>

                <View className="w-1/2">
                    <Text className="text-xs font-semibold text-slate-400 uppercase">
                        Status
                    </Text>
                    <Text className="mt-1 text-base font-semibold text-white">
                        {incident.statusdesc}
                    </Text>
                </View>
            </View>
        </View>
    )
}