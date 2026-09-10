import { Text, Pressable } from "react-native";

export default function FilterButton({ label, active, onPress }){
    return(
        <Pressable
            onPress={onPress}
            className={`mr-2 rounded-full px-4 py-2 ${
                active
                    ? 'bg-blue-600'
                    : 'bg-white border border-slate-300'
            }`}
        >
            <Text
                className={`text-sm font-semibold ${
                    active
                        ? 'text-white'
                        : 'text-slate-600'
                }`}
            >
                {label}
            </Text>
        </Pressable>
    )
};