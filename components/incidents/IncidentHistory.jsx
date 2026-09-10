import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { getHistory } from '../../services/history';

//redners all recorded status updates on an incident, was an implementation for support side if I'd gotten to that point i.e is a to do
export default function IncidentHistory({ incidentId, local }){
    //set the state for the cards
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //use effect to trigger on rerender
    useEffect(() => {
        //load Incidents calls the API and sets the data in the state, catches errors to be displayed by storing in state and then if successful sets laoding to false to return the component
        const loadHistory = async () => {
            if (local) {
                setLoading(false);
                return;
            }

            try {
                const data = await getHistory(incidentId);
                setHistory(data);
            } catch (error) {
                console.error(error);
                setError('Failed to load incident history');
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, [incidentId]);

    //renders a loading indication to the user
    if(loading){
        return <Text>Loading History...</Text>;
    }

    //displays error infomation to inform the user something has gone wrong
    if(error){
        return <Text>{error}</Text>;
    }

    return(
        <View className='mt-6'>
            <Text className='mb-3 text-xl font-bold text-blue-950'>
                History
            </Text>

            {local ? (
                <Text className='text-slate-500'>
                    Incident history cannot be loaded while offline.
                </Text>
            ) : history.length === 0 ? (
                <Text className='text-slate-900'>
                    No history for this incident yet.
                </Text>
            ) : (
                history.map((item) => (
                    <View
                        key={item.id}
                        className='mb-3 rounded-xl bg-white p-4 border border-blue-950'
                    >
                        <Text className='font-semibold text-blue-950'>
                            {item.statusdesc}
                        </Text>

                        <Text className='mt-1 text-slate-500'>
                            {item.changed_by_name}
                        </Text>

                        <Text className='mt-1 text-slate-400'>
                            {new Date(item.changed_at).toLocaleString('en-GB')}
                        </Text>
                    </View>
                ))
            )}
        </View>
    )
}