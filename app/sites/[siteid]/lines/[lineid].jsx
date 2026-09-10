import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { getLine } from '../../../../services/lines';
import { getDevices } from '../../../../services/lines';
import { saveDevices } from '../../../../services/localDB';
import LoadingScreen from '../../../../components/loadingState';
import DashboardHeader from '../../../../components/incidents/DashboardHeader';
import { useAuth } from '../../../../context/AuthContext';
import { getSites } from '../../../../services/sites';

//line detail page shows all devices and details for selected line from the dashboard
export default function LineDetail(){
    //get the line from locla params and user and site id from global auth
    const { lineid } = useLocalSearchParams();
    const { user } = useAuth();
    const siteid = user?.site_id;

    //set data in state as well as loading and error states
    const [site, setSite] = useState([]);
    const [line, setLine] = useState(null);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //loads the date
    useEffect(() => {
        const loadLine = async () => {
            try {
                //gets site data for the header, then pulls line data for selected line, and device data for that line
                const userSite = await getSites(siteid);
                const lineData = await getLine(lineid);
                const deviceData = await getDevices(lineid);

                //if device data then saves locally
                if(deviceData?.length > 0){
                    await saveDevices(deviceData);
                }

                //set the data in state
                setSite(userSite);
                setLine(lineData);
                setDevices(deviceData);
            } catch (error) {
                console.error(error);
                setError('Failed to load line details');
            } finally {
                setLoading(false);
            }
        };

        loadLine();
    }, [lineid]);

    if (loading) {
        return <LoadingScreen message="Loading line..." />;
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-100 p-6">
                <Text className="text-lg font-semibold text-red-600">
                    {error}
                </Text>
            </View>
        );
    }

    return (
        <View className='flex-1 bg-white'>
            <DashboardHeader siteName={site.name}/>
            <ScrollView 
                className="flex-1 bg-white"
                contentContainerStyle={{
                    paddingBottom: 50,
                }}
            >

                {/* line details */}
                <View className="rounded-xl bg-white m-3 p-5 border-2 border-blue-950">
                    <Text className="text-3xl font-bold text-blue-950">
                        {line.linedesc ?? line.description}
                    </Text>

                    <Text className="mt-2 text-slate-500">
                        {line.system_type}
                    </Text>

                    <Text className="mt-4 font-semibold text-slate-900">
                        Status
                    </Text>

                    <Text className="mt-1 text-slate-600">
                        {line.statusdesc || 'Status not available whilst offline'}
                    </Text>
                </View>

                {/* devices data */}
                <View className="mt-6 bg-white">
                    <Text className="text-2xl mx-3 font-bold text-slate-900">
                        Devices
                    </Text>

                    <Text className="mt-1 mx-3 text-slate-500">
                        Devices associated with this production line
                    </Text>

                    <View className="mt-4">
                        {devices.map((device) => (
                            <View
                                key={device.deviceid ?? device.device_id}
                                className="mb-3 bg-white p-5 border border-slate-200"
                            >
                                <Text className="text-lg font-semibold text-slate-900">
                                    {device.device_desc ?? device.description}
                                </Text>

                                <Text className="mt-1 text-slate-500">
                                    {device.device_type}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}