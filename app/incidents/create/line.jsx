import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import LineSelect from '../../../components/reporting/lineSelect';

//Select line lets suer select a line during the incident creation process
export default function SelectLine(){
    //pulls site id from params so it can then pull correct line data
    const { siteid } = useLocalSearchParams();

    //pases the line to the next page, uses online or local id dependant on connection
    const handleSelectLine = (line) => {
        router.push({
            pathname: '/incidents/create/problem',
            params: {
                lineid: String(line.lineid ?? line.line_id)
            }
        });
    };

    return (
        <SafeAreaView
            className="flex-1 bg-blue-950"
            edges={['top', 'bottom']}
        >
            <View className="flex-1">
                <View className="bg-blue-950 mt-6">
                    <Text className="text-3xl px-4 font-bold text-white">
                        Select the Line
                    </Text>

                    <Text className="mt-2 text-slate-500 text-center">
                        Select the production line that is experiencing the problem
                    </Text>
                </View>

                {/* Line selection component */}
                <View className="flex-1 mt-6 bg-white px-6 pt-6">
                    <LineSelect
                        siteId={siteid}
                        onSelect={handleSelectLine}
                    />
                </View>

            </View>
        </SafeAreaView>
    );
}