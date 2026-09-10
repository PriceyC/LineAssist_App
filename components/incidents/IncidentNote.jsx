import { View, Text } from 'react-native';

//returns to note with name note and created time, again was to be done on support side if gotten to that side of the app
export default function IncidentNote({ note }) {
    return(
        <View className='mb-3 rounded-xl bg-white p-4'>
            <Text className='font-semibold text-slate-900'>
                {note.user_name}
            </Text>

            <Text className='mt-1 text-slate-700'>
                {note.note}
            </Text>

            {/* convert to local time to device */}
            <Text className='mt-2 text-xs text-slate-400'>
                {new Date(note.created_at).toLocaleString()}
            </Text>
        </View>
    )
}
