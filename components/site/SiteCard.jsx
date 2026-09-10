import { View, Text, Pressable } from 'react-native'

export default function SiteCard({ site, onPress }){
    return(
        <Pressable
            className='mb-4 rounded-xl bg-white p-5'
            onPress={onPress}
        >
            <Text className="text-xl font-semibold text-slate-900">
                {site.name}
            </Text>

            <Text className="mt-1 text-slate-500">
                {site.location}
            </Text>
        </Pressable>
    )
}