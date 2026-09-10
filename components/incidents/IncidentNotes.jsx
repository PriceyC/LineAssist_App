import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import IncidentNote from './IncidentNote';
import { getIncidentNotes } from '../../services/notes';

//renders the notes on incident detail, notes appear on precreated tickets but functionality to create notes was down for support side
export default function IncidentNotes({ incidentId, local}){
    //set the state for the cards
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //use effect to trigger on rerender
    useEffect(() => {
        //load Incidents calls the API and sets the data in the state, catches errors to be displayed by storing in state and then if successful sets laoding to false to return the component
        const loadNotes = async () => {
            try {
                const data = await getIncidentNotes(incidentId, local);
                setNotes(data);
            } catch (error) {
                console.error(error);
                setError('Failed to load incident notes');
            } finally {
                setLoading(false);
            }
        };

        loadNotes();
    }, [incidentId]);

    //renders a loading indication to the user
    if(loading){
        return <Text>Loading your sites...</Text>;
    }

    //displays error infomation to inform the user something has gone wrong
    if(error){
        return <Text>{error}</Text>;
    }

    return(
        <View className='mt-4'>
            <Text className='mb-3 text-xl font-bold text-slate-900'>
                Notes
            </Text>

            {/* conditionally redners based of if notes ahve been craeted for the incident */}
            {notes.length == 0 ? (
                <Text className='text-slate-900'>
                    No notes have been added yet.
                </Text>
            ) : (
                notes.map((note) => (
                    <IncidentNote
                        key={note.id}
                        note={note}
                    />
                ))
            )}
        </View>
    )
}