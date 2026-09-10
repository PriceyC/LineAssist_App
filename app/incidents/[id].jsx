import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { getIncident } from '../../services/incidents';
import { getDiagnosticSessions, getDiagnosticAnswers, getDiagnosticdefinitions } from '../../services/diagnostics';
import IncidentNotes from '../../components/incidents/IncidentNotes';
import IncidentHistory from '../../components/incidents/IncidentHistory';
import DiagnosticSession from '../../components/incidents/DiagnosticSession';
import IncidentEvidenceList from '../../components/incidents/IncidentEvidence';
import LoadingScreen from '../../components/loadingState';
import { cacheServerIncident, getLocalIncidentByServerId } from '../../services/localDB';
import IncidentHeader from '../../components/incidents/IncidentHeader';
import { BackHandler } from 'react-native';

//incident detail page that renders all details for an incident and allows user to progres to diagnostic steps or evidence creation
export default function Incident() {
    //pull id from local params
    const { id, local } = useLocalSearchParams();

    //sets state for the incident data and loading/error state
    const [incident, setIncident] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //diagnostic data set in state, definitions pulled from json data file using diagnostic id
    const [diagnosticSession, setDiagnosticSession] = useState([]);
    const [diagnosticAnswer, setDiagnosticAnswer] = useState({});
    const [diagnosticdefinitions, setDiagnosticDefinitions] = useState({});

    //use effect to trigger on rerender
    useEffect(() => {
        //load Incidents calls the API and sets the data in the state, catches errors to be displayed by storing in state and then if successful sets laoding to false to return the component
        const loadIncident = async () => {
            try {
                //gets the incident either from local or online
                const data = await getIncident(id, local === 'true');

                if (local !== 'true') {
                    await cacheServerIncident(data);

                    const localIncident = await getLocalIncidentByServerId(
                        data.incidentid
                    );

                    data.local_id = localIncident.local_id;
                }

                setIncident(data);

            } catch (error) {
                console.error('failed to laod selected incident:', error);
            } finally {
                setLoading(false);
            }
        };

        //load all diagnostics session data
        const loadDiagnostics = async () => {
            try {
                const sessions = await getDiagnosticSessions(
                    Number(id),
                    local === 'true'
                );

                if (!Array.isArray(sessions)) {
                    console.error('Diagnostic sessions is not an array:', sessions);
                    return;
                }

                setDiagnosticSession(sessions);

                //store definitions and answers as json
                const definitions = {};
                const answers = {};

                //maps for each session the definitions to the questions+answers
                for (const session of sessions) {
                    const sessionId = session.local_id ?? session.id;

                    const sessionAnswers = await getDiagnosticAnswers(
                        Number(sessionId),
                        local === 'true'
                    );

                    answers[sessionId] = sessionAnswers;

                    const definition = getDiagnosticdefinitions(
                        session.diagnostic_type
                    );

                    if (definition) {
                        definitions[session.diagnostic_type] = definition;
                    }
                }
                setDiagnosticDefinitions(definitions);
                setDiagnosticAnswer(answers);

            }  catch (error) {
                console.error('failed to laod diagnostics data:', error);
            }
        };
        //calls both functions
        loadIncident();
        loadDiagnostics();
    }, [id, local]);

    //second use effect handles routng back to incidents, so if user presses back button on their phone, it wouldnt go back to incident creation process or diagnostic process etc
    useEffect(() => {
        const onBackPress = () => {
            router.replace('/(tabs)/incidents');
            return true;
        };

        const subscription = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );
        
        return () => subscription.remove();
    }, []);


    //renders a loading indication to the user
    if(loading){
        return <LoadingScreen message="Loading incident..." />;
    }

    //displays error infomation to inform the user something has gone wrong
    if(error){
        return <Text>{error}</Text>;
    }

    return (
        <View className='flex-1 p-6 mb-4'>
            <ScrollView className="flex-1 bg-white">

                <IncidentHeader incident={incident} />

                <IncidentHistory incidentId={id} local={local === 'true'}/>
                <IncidentNotes incidentId={id} local={local === 'true'} />

                <Pressable
                    className='mt-6 rounded-xl bg-blue-950 p-4'
                    onPress={() => {
                        router.push({
                            pathname: '/incidents/create/IncidentEvidence',
                            params: {
                                incidentId: String(id),
                                localIncidentId: String(incident.local_id),
                                local: local === 'true' ? 'true' : 'false'
                            }
                        });
                    }}
                >
                    <Text className='text-center font-semibold text-white'>
                        Record Image Evidence
                    </Text>
                </Pressable>

                <IncidentEvidenceList incidentId={incident.local_id} />

                <Pressable
                    className='mt-6 rounded-xl bg-blue-950 p-4'
                    onPress={() => {
                        router.push({
                            pathname: '/incidents/create/diagnostics',
                            params: {
                                incidentid: String(id),
                                local: local === 'true' ? 'true' : 'false'
                            }
                        });
                    }}
                >
                    <Text className='text-center font-semibold text-white'>
                        Start Troubleshooting Diagnostics
                    </Text>
                </Pressable>

                <View className='mt-6'>
                    <Text className='text-xl font-bold text-blue-950 mb-2'>
                        Diagnostic Sessions Completed
                    </Text>

                    {diagnosticSession.map((session) => (
                        <DiagnosticSession
                            key={session.local_id ?? session.id}
                            session={session}
                            answers={diagnosticAnswer[session.local_id ?? session.id] || []}
                            definition={diagnosticdefinitions[session.diagnostic_type]}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}