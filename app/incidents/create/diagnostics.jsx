import { View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, router} from 'expo-router';
import { useState } from 'react';
import DiagnosticsSelect from '../../../components/reporting/diagnosticsSelect';
import { createDiagnosticSession } from '../../../services/diagnostics';

//start of the diagnostic troubleshooting process, pulls initial data needed to begin the process
export default function Diagnostics(){
    //pull required data for storing the results correctly from the params
    const { incidentid, local } = useLocalSearchParams();

    //set state for the diagnostic session
    const [diagnostic, setDiagnostic] = useState(null);

    //sets the diagnostic from sleection on the page
    const handleSelectedDiagnostic = (selectedDiagnostic) => {
        setDiagnostic(selectedDiagnostic);
    }

    //returns if no diagnostic selected, else will create a new diagnostic session, passing the session id and other data to troubelshooting page to begin the questions/ansers section
    const handleContinue = async () => {
        if (!diagnostic) return;

        try {
            const session = await createDiagnosticSession(
                incidentid,
                diagnostic.id,
                local === 'true'
            );

            //also checks whether its being pulled and stored locally 
            router.push({
                pathname: '/incidents/create/Troubleshooting',
                params: {
                    incidentid: incidentid,
                    sessionid: session.local_id ?? session.id,
                    diagnosticid: diagnostic.id,
                    local: local === 'true' ? 'true' : 'false'
                }
            });
        } catch (error) {
            console.error('Failed to create diagnostic session:', error);
        }
    };

    return(
        <View className='flex-1 mt-16 bg-white pt-4 px-6'>
            <Text className='text-3xl font-bold text-blue-950'>
                Diagnostic Troubleshooting
            </Text>

            {/* render the diagnostic selections */}
            <DiagnosticsSelect
                onSelect={handleSelectedDiagnostic}
            />

            {/* button to continue on to troubelshooting */}
            <Pressable
                className={`mt-6 rounded-xl p-4 ${
                    diagnostic ? 'bg-blue-950' : 'bg-slate-300'
                }`}
                onPress={handleContinue}
                disabled={!diagnostic}
            >
                <Text className='text-center font-semibold text-white'>
                    Start Troubleshooting
                </Text>
            </Pressable>
        </View>
    )
}