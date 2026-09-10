import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import DiagnosticQuestion from "../../../components/reporting/diagnosticQuestion";
import { addDiagnosticAnswer, completeDiagnosticSession } from "../../../services/diagnostics";
//pull diagnostic questions from json data files
const diagnostics = require('../../../data/diagnostics');

//troubleshooting progresses user through the diagnostic troublehsooting questions and records the answers for the diagnostic session
export default function Troubleshooting(){
    //pull all data require to store in the session through local params
    const {
        incidentid,
        sessionid,
        diagnosticid,
        local
    } = useLocalSearchParams();

    //sets state for the steps, answer data and sumit state
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);

    //pulls diagnostic type by sleected diagnostic id
    const diagnostic = diagnostics.find(
        item => item.id === diagnosticid
    );

    //if no diagnostic data can be pulled then render that to user
    if (!diagnosticid || !diagnostic) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-slate-100 p-6">
                <Text className="text-lg font-semibold text-red-600">
                    Diagnostics not found
                </Text>
            </SafeAreaView>
        );
    }

    //set step to the current step and answer answer for selected step
    const step = diagnostic.steps[currentStep];
    const answer = answers[step.id];

    //calculates total steps and where in the process user is
    const totalSteps = diagnostic.steps.length;
    const currentStepNumber = currentStep + 1;

    //gets value for the answer and store as key value pair with stepid in state
    const handleAnswer = (value) => {
        setAnswers(previous => ({
            ...previous,
            [step.id]: value
        }));
    };

    //checks whether there are more steps, if so moves user on, otherwise submits their anwers when all quetsions completed
    const handleNext = async () => {
        //if no value for an answer returns
        if (
            answer === undefined ||
            answer === null ||
            answer === ''
        ){
            return;
        }

        //if more steps to complete, increasees current step to move user along
        if (currentStep < totalSteps - 1) {
            setCurrentStep(previous => previous + 1);
            return;
        }

        //if already submitting then return in case user presses more than once
        if (submitting) return;

        //otherwise set submitting to true to lock process 
        setSubmitting(true);

        //try catch to end process if an exception caught
        try {
            //for each step, save the answer with the stepid and sesion id, once all steps saved, save the session
            for (const step of diagnostic.steps) {
                const stepAnswer = answers[step.id];

                await addDiagnosticAnswer(
                    sessionid,
                    step.id,
                    stepAnswer,
                    local === 'true'
                );
            }

            await completeDiagnosticSession(
                sessionid,
                local === 'true'
            );

            //route back to the incident
            router.replace({
                pathname: '/incidents/[id]',
                params: {
                    id: String(incidentid),
                    local: local === 'true'
                        ? 'true'
                        : 'false'
                }
            });
        } catch (error) {
            console.error(
                'Failed to add diagnostic results',
                error
            );
            setSubmitting(false);
        }
    };

    //back button reduces curret step count, otherwise returns to previous page
    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(previous => previous - 1);
        } else {
            router.back();
        }
    };

    return (
        <SafeAreaView
            className="flex-1 bg-whites"
            edges={['top', 'bottom']}
        >
            <View className="flex-1">
                {/* header section */}
                <View className="px-6 pt-4">
                    <Text
                        className="text-3xl font-bold text-slate-900"
                        numberOfLines={2}
                    >
                        {diagnostic.name}
                    </Text>

                    <Text
                        className="mt-2 text-slate-500"
                        numberOfLines={3}
                    >
                        {diagnostic.description}
                    </Text>
                </View>


                {/* progress bar*/}
                <View className="mt-6 w-full bg-slate-100 border-y border-slate-200 px-6 py-4">
                    {/* step */}
                    <View className="flex-row items-center justify-between">
                        <Text className="text-sm font-bold text-slate-700">
                            Step {currentStepNumber} of {totalSteps}
                        </Text>

                        <Text
                            className="ml-4 flex-1 text-right text-sm font-semibold text-slate-500"
                            numberOfLines={1}
                        >
                            {step.linedesc || step.line || diagnostic.name}
                        </Text>
                    </View>


                    {/* progress pills / ovals */}
                    <View className="mt-4 flex-row gap-1.5">
                        {diagnostic.steps.map((_, index) => (
                            <View
                                key={index}
                                className={`h-2 flex-1 rounded-full ${
                                    index < currentStepNumber
                                        ? 'bg-blue-950'
                                        : 'bg-slate-300'
                                }`}
                            />
                        ))}
                    </View>
                </View>


                {/* current diagnostic question */}
                <View className="flex-1 px-6 pt-6">
                    <DiagnosticQuestion
                        step={step}
                        value={answer}
                        onAnswer={handleAnswer}
                    />
                </View>

                {/* bottom buttons */}
                <View className="border-t border-slate-200 bg-white px-6 pt-4 pb-2">
                    <View className="flex-row gap-3">
                        <Pressable
                            className="flex-1 rounded-xl bg-slate-200 py-4 active:bg-slate-300"
                            onPress={handleBack}
                        >
                            <Text className="text-center font-semibold text-slate-900">
                                Previous
                            </Text>
                        </Pressable>

                        <Pressable
                            className={`flex-1 rounded-xl py-4 ${
                                answer !== undefined &&
                                answer !== null &&
                                answer !== ''
                                    ? 'bg-blue-950 active:bg-blue-600'
                                    : 'bg-slate-300'
                            }`}
                            onPress={handleNext}
                            disabled={
                                submitting ||
                                answer === undefined ||
                                answer === null ||
                                answer === ''
                            }
                        >
                            <Text className="text-center font-semibold text-white">
                                {submitting
                                    ? 'Submitting...'
                                    : currentStep === totalSteps - 1
                                        ? 'Complete'
                                        : 'Next'
                                }
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}