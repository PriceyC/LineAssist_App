import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';

const diagnostics = require('../../data/diagnostics');

//diagnostic select to choose which troubleshhoting process you wnat to take
export default function DiagnosticsSelect({ onSelect }){
    //set the selecetd in state
    const [selectedDiagnostic, setSelectedDiagnostic] = useState(null);

    //when button is pressed set diagnostic in state and pass up on select to parent component
    const handleSelect = (diagnostic) => {
        setSelectedDiagnostic(diagnostic.id);
        onSelect(diagnostic);
    };

    return(
        <View className="mt-6">
            <Text className="mt-1 text-lg font-semibold text-slate-600">
                Choose Diagnostic Process
            </Text>

            <Text className="mt-1 text-slate-500">
                Select the troubleshooting process that best matches the problem you're experiencing
            </Text>

            <View className="mt-4 flex-row flex-wrap justify-between">
                {diagnostics.map((diagnostic) => (
                    <Pressable
                        key={diagnostic.id}
                        onPress={() => handleSelect(diagnostic)}
                        className={`mb-4 w-[48%] aspect-square rounded-xl p-4 items-center justify-center ${
                            selectedDiagnostic === diagnostic.id
                                ? 'bg-blue-100 border-2 border-blue-950'
                                : 'bg-white border border-slate-200'
                        }`}
                        style={{ elevation: 3 }}
                    >
                        <Text
                            className="text-lg font-semibold text-slate-900 text-center"
                            numberOfLines={2}
                        >
                            {diagnostic.name}
                        </Text>

                        <Text
                            className="mt-2 text-sm text-slate-500 text-center"
                            numberOfLines={4}
                        >
                            {diagnostic.description}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}