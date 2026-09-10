import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import Logo from '../../../components/Logo';

//create incident function is beginning page to start the creation process
export default function CreateIncident() {
    //pull user from global auth and then pull the site id from the user data to be stored when submitting the incident assigning to correct site and user
    const { user } = useAuth();
    const siteid = user?.site_id;

    return (
        <View className="flex-1 items-center justify-center bg-white p-6">
            <Logo width='w-24' height='h-24' />

            <Text className="text-2xl text-blue-950 font-bold">
                Report a new incident
            </Text>

            <Text className='mt-2 text-slate-500'>
                Start gathering details on the incident
            </Text>

            {/* button to progress that passes siteid along url params */}
            <Pressable 
                className='mt-8 rounded-xl bg-blue-950 p-4'
                onPress={() => router.push({
                    pathname: '/incidents/create/line', 
                    params: {
                        siteid: siteid,
                }})}
            >
                <Text className='text-xenter font-semibold text-white'>
                    Start Report
                </Text>
            </Pressable>
        </View>
    );
}