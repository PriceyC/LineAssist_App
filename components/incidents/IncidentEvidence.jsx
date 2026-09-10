import {
    View,
    Text,
    Image
} from 'react-native';
import { useEffect, useState } from 'react';
import { getLocalEvidence } from '../../services/localDB';

// incident eveidence list renders all images recorder to the incident
export default function IncidentEvidenceList({ incidentId }){
    //sets state to store evidence data
    const [evidence, setEvidence] = useState([]);


    useEffect(() => {
        const loadEvidence = async () => {
            try {
                // gets all evidence using incident id and stores in state
                const data = await getLocalEvidence(Number(incidentId));
                setEvidence(data);
            } catch (error) {
                console.error(
                    'FAILED TO LOAD LOCAL EVIDENCE:',error);
            }
        };

        loadEvidence();
    }, [incidentId]);

    return (
        <View className="mt-6">
            <Text className="text-2xl font-bold text-slate-900">
                Evidence
            </Text>

            {/* checks theers evidence to render */}
            {evidence.length === 0 && (
                <Text className="mt-2 text-slate-500">
                    No evidence recorded.
                </Text>
            )}

            {evidence.map((item) => (
                <View
                    key={item.local_id}
                    className="mt-4 rounded-xl bg-white p-4 border border-blue-950"
                >
                    <Image
                        source={{ uri: item.file_uri }}
                        style={{
                            width: '100%',
                            height: 220,
                            borderRadius: 12
                        }}
                        resizeMode="cover"
                    />

                    <Text className="mt-3 font-semibold text-blue-950">
                        {item.description}
                    </Text>

                    {/* indicates whether the image has been synced to online db or not */}
                    {item.sync_status === 'pending' ? (
                        <Text className="mt-2 text-sm text-yellow-600">
                            Pending sync
                        </Text>
                    ) : (
                        <Text className="mt-2 text-sm text-green-600">
                            Synced
                        </Text>
                    )}
                </View>
            ))}
        </View>
    );
}