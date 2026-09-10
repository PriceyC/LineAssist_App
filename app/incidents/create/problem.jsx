import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import ProblemDescription from '../../../components/reporting/Problemdescription';

//problem allows user to set the title and description fo rtheir incident
export default function SelectProblem(){
    //line id passed from lineselect
    const { lineid } = useLocalSearchParams();

    //set state for storing user input
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');

    //passes details through to the next page
    const handleContinue = () => {
        router.push({
            pathname: '/incidents/create/review',
            params: {
                lineid: lineid,
                description: description,
                title: title
            }
        });
    };

    //trims off whitespace of user input and if value remains the button can be pressed to continue to review
    const canContinue = title.trim() && description.trim();

    return (
        <SafeAreaView
            className="flex-1 bg-blue-950"
            edges={['top', 'bottom']}
        >
            <View className="flex-1">
                <View className="bg-blue-950 mt-6 px-4">
                    <Text className="text-3xl px-3 font-bold text-white">
                        Report the Problem
                    </Text>

                    <Text className="mt-2 px-3 text-slate-300">
                        Describe the problem you are experiencing
                    </Text>
                </View>

                <View className="flex-1 mt-6 bg-white px-6 pt-6">
                    <ProblemDescription
                        titleValue={title}
                        descriptionValue={description}
                        onTitleChange={setTitle}
                        onDescriptionChange={setDescription}
                    />

                    <View className="mt-auto pb-4">
                        <Pressable
                            className={`rounded-xl p-4 ${
                                canContinue
                                    ? 'bg-blue-600 active:bg-blue-700'
                                    : 'bg-slate-300'
                            }`}
                            onPress={handleContinue}
                            disabled={!canContinue}
                        >
                            <Text
                                className={`text-center font-semibold ${
                                    canContinue
                                        ? 'text-white'
                                        : 'text-slate-500'
                                }`}
                            >
                                Continue
                            </Text>
                        </Pressable>
                    </View>

                </View>

            </View>
        </SafeAreaView>
    );
}