import { View, Text, Pressable } from "react-native";

//hardcode severities as easier than pulling the data each time
const severities = [
    {
        severityid: 1,
        severitydesc: 'Low'
    },
    {
        severityid: 2,
        severitydesc: 'Medium'
    },
    {
        severityid: 3,
        severitydesc: 'High'
    },
    {
        severityid: 4,
        severitydesc: 'Urgent'
    }
];

//allows user to sleect severity from list
export default function SeveritySelect({ value, onSelect }){
    return(
        <View className='mt-2 mb-2 rounded-xl border border-slate-200'>
            {severities.map((severity) => {
                //maps value to severity id to render selected differently
                const selected = value?.severityid === severity.severityid;

                return (
                    <Pressable
                        key={severity.severityid}
                        className={`mb-4 rounded-xl p-4 ${
                            selected
                                ? 'border-2 border-blue-950 bg-blue-50'
                                : 'bg-white'
                        }`}
                        onPress={() => onSelect(severity)}
                    >
                        <Text className='text-lg font-semibold text-slate-900'>
                            {severity.severitydesc}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}