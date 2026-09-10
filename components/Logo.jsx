import { View, Text } from "react-native";

export default function Logo({ width = "w-14", height = "h-14" }){
    return(
        <View
            className={`${width} ${height} mb-6 rounded-2xl bg-blue-950 items-center justify-center border border-white`}
        >
            <Text className="text-white text-4xl font-bold tracking-tight">
                LA
            </Text>
        </View>
    );
}