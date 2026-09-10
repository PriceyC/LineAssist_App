import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import SeveritySelect from "../../../components/incidents/SeveritySelect";
import { createIncident } from '../../../services/incidents';
import { useAuth } from "../../../context/AuthContext";

//review summarises the data for the incident inputted by the user and lets them select a severity to assign to the incident
export default function ReviewIncident() {
    //pull data from the params from previous steps
    const { lineid, title, description } = useLocalSearchParams();

    //get global user data and then set site and user id
    const { user } = useAuth();
    const siteid = user?.site_id;
    const userid = user?.userid;

    //set state for storing sevreity data and laoding/error states
    const [severity, setSeverity] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //submit function checks data is complete before submitting
    const handleSubmit = async () => {
        //if severity is not selected then return
        if (!severity) return;

        //try to submit otherwise catch error
        try{
            //sets loading to true to render anumation
            setLoading(true);
            setError(null);

            //sets the incident data from the previous steps
            const incident = await createIncident({
                site_id: siteid,
                line_id: Number(lineid),
                created_by: userid,
                title: title.trim(),
                description: description.trim(),
                severityid: severity.severityid
            });

            //sets incdent id as either a offline or online id dependant on cinnection
            const incidentId = incident.incidentid ?? incident.local_id;

            //routes to new incident created,c hceking offline first as will default to offline if no connection during creation process
            router.replace({
                pathname: '/incidents/[id]',
                params: {
                    id: String(incidentId),
                    local: incident.local_id ? 'true' : 'false'
                }
            });
        } catch (error) {
            console.error(error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView
            className="flex-1 bg-blue-950"
            edges={['top', 'bottom']}
        >
            <View className="flex-1">
                {/* header section*/}
                <View className="bg-blue-950 mt-6 px-4">
                    <Text className="text-3xl mx-3 font-bold text-white">
                        Review Incident
                    </Text>

                    <Text className="mt-2 text-slate-300 mx-3">
                        Check the details below before submitting your incident.
                    </Text>
                </View>

                {/* content section */}
                <View className="flex-1 mt-6 bg-white px-6 pt-6">
                    <ScrollView
                        className="flex-1"
                        showsVerticalScrollIndicator={false}
                    >

                        {/* review info */}
                        <View className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                            <Text className="text-xl font-bold text-blue-950">
                                Incident Details
                            </Text>

                            {/* line info */}
                            <View className="mt-5">
                                <Text className="text-sm font-semibold text-slate-500">
                                    Production Line
                                </Text>

                                <Text className="mt-1 text-base font-semibold text-slate-900">
                                    {lineid}
                                </Text>
                            </View>

                            {/* problem */}
                            <View className="mt-4">
                                <Text className="text-sm font-semibold text-slate-500">
                                    Problem
                                </Text>

                                <Text className="mt-1 text-lg font-semibold text-slate-900">
                                    {title}
                                </Text>

                                <Text className="mt-2 text-base leading-6 text-slate-600">
                                    {description}
                                </Text>
                            </View>
                        </View>


                        {/* severity */}
                        <View className="mt-6">
                            <Text className="text-xl font-bold text-blue-950">
                                Severity
                            </Text>

                            <Text className="mt-1 text-slate-500">
                                Select the severity of the incident before submitting.
                            </Text>

                            <View className="mt-4">
                                <SeveritySelect value={severity} onSelect={setSeverity}/>
                            </View>
                        </View>


                        {/* if error */}
                        {error && (
                            <View className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                                <Text className="font-semibold text-red-700">
                                    Unable to create incident
                                </Text>

                                <Text className="mt-1 text-sm text-red-600">
                                    Please check your connection and try again.
                                </Text>
                            </View>
                        )}
                    </ScrollView>


                    {/* submit section */}
                    <View className="pt-4 pb-4">
                        <Pressable
                            className={`rounded-xl p-4 ${
                                severity
                                    ? 'bg-blue-950 active:bg-blue-700'
                                    : 'bg-slate-300'
                            }`}
                            onPress={handleSubmit}
                            disabled={!severity || loading}
                        >
                            <Text className="text-center font-semibold text-white">
                                {loading
                                    ? 'Creating Incident...'
                                    : 'Submit Incident'
                                }
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}