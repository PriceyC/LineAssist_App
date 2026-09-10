import { View, Text, FlatList, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import IncidentCard from '../../../components/incidents/IncidentCard';
import { getIncidents } from '../../../services/incidents';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import LoadingScreen from '../../../components/loadingState';
import FilterButton from '../../../components/FilterButton';

//page renders all incidents on site, and allows them to be filtered utilising the bakcend filtering functionality with url params
export default function Incidents() {
    //pull the global user auth and site id from that data
    const { user } = useAuth();
    const siteid = user?.site_id;

    //set the state for the cards
    const [incidents, setIncidents] = useState([]);
    const [statusFilter, setStatusFilter] = useState(null);
    const [severityFilter, setSeverityFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //use effect to trigger on rerender
    useEffect(() => {
        //load Incidents calls the API and sets the data in the state, catches errors to be displayed by storing in state and then if successful sets laoding to false to return the component
        const loadIncidents = async () => {
            try {
                setLoading(true);

                const data = await getIncidents(
                    siteid,
                    statusFilter,
                    severityFilter
                );

                setIncidents(data);
            } catch (error) {
                console.error(error);
                setError('Failed to load incidents');
            } finally {
                setLoading(false);
            }
        };

        if (siteid) {
            loadIncidents();
        }
    }, [siteid, statusFilter, severityFilter]);

    //renders a loading indication to the user
    if(loading){
        return <LoadingScreen message="Loading incidents..." />;
    }

    //displays error infomation to inform the user something has gone wrong
    if(error){
        return <Text>{error}</Text>;
    }

    return (
        <View className="flex-1 bg-slate-100">

            <Text className="text-xl bg-blue-950 font-bold text-white pt-12 p-6">
                Active Incidents
            </Text>

            {/* Filters */}
            <View className="bg-white py-3">

                <Text className="px-6 mb-2 text-xs font-semibold text-slate-500">
                    STATUS
                </Text>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 24 }}
                >
                    <FilterButton
                        label="All"
                        active={statusFilter === null}
                        onPress={() => setStatusFilter(null)}
                    />

                    <FilterButton
                        label="Open"
                        active={statusFilter === 'Open'}
                        onPress={() => setStatusFilter('Open')}
                    />

                    <FilterButton
                        label="Investigating"
                        active={statusFilter === 'Investigating'}
                        onPress={() => setStatusFilter('Investigating')}
                    />

                    <FilterButton
                        label="Waiting for Site"
                        active={statusFilter === 'Waiting for Site'}
                        onPress={() => setStatusFilter('Waiting for Site')}
                    />

                    <FilterButton
                        label="Closed"
                        active={statusFilter === 'Closed'}
                        onPress={() => setStatusFilter('Closed')}
                    />
                </ScrollView>

                <Text className="px-6 mt-4 mb-2 text-xs font-semibold text-slate-500">
                    SEVERITY
                </Text>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 24 }}
                >
                    <FilterButton
                        label="All"
                        active={severityFilter === null}
                        onPress={() => setSeverityFilter(null)}
                    />

                    <FilterButton
                        label="Low"
                        active={severityFilter === 'Low'}
                        onPress={() => setSeverityFilter('Low')}
                    />

                    <FilterButton
                        label="Medium"
                        active={severityFilter === 'Medium'}
                        onPress={() => setSeverityFilter('Medium')}
                    />

                    <FilterButton
                        label="High"
                        active={severityFilter === 'High'}
                        onPress={() => setSeverityFilter('High')}
                    />

                    <FilterButton
                        label="Urgent"
                        active={severityFilter === 'Urgent'}
                        onPress={() => setSeverityFilter('Urgent')}
                    />
                </ScrollView>

            </View>

            {/* maps over data and renders an incident card for each incidnet*/}
            <FlatList
                className="px-6 bg-slate-100"
                contentContainerStyle={{ paddingTop: 12 }}
                data={incidents}
                keyExtractor={(item) => item.incidentid.toString()}
                renderItem={({ item }) => (
                    <IncidentCard
                        incident={item}
                        onPress={() => {
                            //checks whether incident has been saved locally
                            const isLocal = item.is_local === 1;

                            //routes to incidnet detail page with chekc for whether it should load from local or online db
                            router.push({
                                pathname: `/incidents/${item.incidentid}`,
                                params: {
                                    local: isLocal ? 'true' : 'false'
                                }
                            });
                        }}
                    />
                )}
            />

        </View>
    );
}