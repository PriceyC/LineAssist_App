import { View, Text, Pressable, TextInput } from 'react-native';

//maps out the diagnostic questions during the diagnostic troubleshooting process
export default function DiagnosticQuestion({ step, value, onAnswer }){
    return(
        <View className='mb-6 bg-white'>
            <Text className='mb-3 text-lg font-semibold text-slate-900'>
                {step.question}
            </Text>

            {/* render boolean answer fields */}
            {step.type === 'boolean' && (
                <View className='flex-row gap-3'>
                    {/* on answer yes highlight selection */}
                    <Pressable
                        className={`flex-1 rounded-xl p-4 ${
                            value===true
                            ? 'bg-blue-950'
                            : 'bg-slate-200'
                    }`}
                    onPress={() => onAnswer(true)}
                    >
                        <Text
                            className={`text-center font-semibold ${
                                value===true
                                ? 'text-white'
                                : 'text-slate-900'
                            }`}
                        >
                            Yes
                        </Text>
                    </Pressable>

                    {/* on answer no, highlight selection */}
                    <Pressable
                        className={`flex-1 rounded-xl p-4 ${
                            value===false
                            ? 'bg-blue-950'
                            : 'bg-slate-200'
                        }`}
                        onPress={() => onAnswer(false)}
                    >
                        <Text
                            className={`text-center font-semibold ${
                                value===false
                                ? 'text-white'
                                : 'text-slate-900'
                            }`}
                        >
                            No
                        </Text>
                    </Pressable>
                </View>
            )}

            {/* render text input answer fields */}
            {step.type === 'text' && (
                <TextInput
                    classname='rounded-xl border border-slate-300 bg-white p-4'
                    placeholder='Enter answer here'
                    value={value || ''}
                    onChangeText={onAnswer}
                />
            )}

            {step.type === 'select' && (
                <View className='mt-4 gap-3'>
                    {step.options.map((option) => (
                        <Pressable
                            key={option}
                            className={`rounded-xl p-4 border-2 border-blue-950 ${
                                value === option
                                    ? 'bg-blue-950'
                                    : 'bg-slate-100'
                            }`}
                            onPress={() => onAnswer(option)}
                        >
                            <Text
                                className={`text-center font-semibold ${
                                    value === option
                                        ? 'text-white'
                                        : 'text-slate-900'
                                }`}
                            >
                                {option}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    )
}