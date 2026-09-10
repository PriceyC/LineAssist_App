import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router'
import { useEffect, useState } from 'react';
import LineStatusCard from '../../../components/site/LineStatusCard'
import { getLines } from '../../../services/lines';
import { getSites } from '../../../services/sites';
import { useAuth } from '../../../context/AuthContext';
import { getIncidents } from '../../../services/incidents';
import { saveLines, getOfflineLines } from '../../../services/localDB';
import DashboardHeader from '../../../components/incidents/DashboardHeader';
import NewestIncidentCard from '../../../components/incidents/NewestIncident';
import LoadingScreen from '../../../components/loadingState';

//Home dashboard page that displays line stats and most recent incident, and starting point for naviagtion after successful login
export default function Home() {
    //set state for store line/site/indient data as well as loading and error state
    const [lines,setLines] = useState([]);
    const [site, setSite] = useState([]);
    const [newestIncident, setNewestIncident] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //pull userv data from global auth and site id from user data
    const { user } = useAuth();
    const siteid = user?.site_id;

    //use effect rerenders on page load
    useEffect(() => {
        //if there is no current site id then return
        if (!siteid) return;

        //load dashboard pull sites and lines data to then render the line cards
        const loadDashboard = async () => {
            try {
                //user site gets data for the header, data and incidents request line and icnident data respectively
                const userSite = await getSites(siteid);
                const data = await getLines(siteid);
                const incidents = await getIncidents(siteid);

                // Cache the latest online lines to be saved to the offline db in case of loss of connection we can still render the page with most recent cache
                await saveLines(data);

                //set the site, line and most recent incident
                setSite(userSite);
                setLines(data);
                setNewestIncident(incidents[0] ?? null);

            } catch (error) {
                //if this fails to get online data, then pull the offline data instead, this is a secondary fall bakc if the global network polling does not catch in time
                const offlineLines = await getOfflineLines(siteid);

                //set the offline line data as the lines
                setLines(offlineLines);
            } finally {
                //set loading to false to rmeove the animation and allow the page to render
                setLoading(false);
            }
        };

        //loads the dashboard data
        loadDashboard();
    }, [siteid]);


    //renders a loading indication to the user
    if(loading){
        return <LoadingScreen message="Loading"/>;
    }

    //displays error infomation to inform the user something has gone wrong
    if(error){
        return <Text>{error}</Text>;
    }

    //if no user logged in then returns before rendering
    if (!user) {
        return null;
    }

    return (

        <View className='flex-1 bg-white'>
            {/* loads header with site name passed */}
            <DashboardHeader siteName={site.name}/>

            <View className='flex-1 mx-4 p-6'>
                <Text className='text-xl font-semibold text-slate-500 mb-3'>
                    Production lines
                </Text>

                {/* maps and renders a linestatus card for each line in line data, on press passes data to load the line detail page */}
                {lines.map((line) => (
                    <LineStatusCard
                        key={line.lineid ?? line.line_id}
                        line={line}
                        onPress={() => {
                            router.push({
                                pathname: '/sites/[siteid]/lines/[lineid]',
                                params: {
                                    siteid: String(siteid),
                                    lines: 'line',
                                    lineid: String(line.lineid ?? line.line_id),
                                },
                            });
                        }}
                    />
                ))}
            </View>

            <View className="mx-4 p-6">
                <Text className="text-lg font-semibold text-slate-500 mb-3">
                    Latest incident
                </Text>

                {/* passes the newest incidnt data to be rendered */}
                <NewestIncidentCard incident={newestIncident} />
            </View>
        </View>    
    );
}