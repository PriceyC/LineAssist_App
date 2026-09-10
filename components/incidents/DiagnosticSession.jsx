import { View, Text } from "react-native";

//redners renders the diagostic session using diagnostic definitions and asnwers
export default function DiagnosticSession({ session, answers, definition }) {
    return(
        <View className='mb-4 rounded-xl bg-white p-4 border border-blue-950'>
            <Text className='text-lg font-bold text-slate-900'>
                {definition?.name}
            </Text>

            {/* maps throught he answers for the definition using setp ids */}
             {answers.map((answer) => {
                const step = definition?.steps.find(
                    step => step.id === answer.step_id
                );

                return (
                    <View
                        key={answer.id}
                        className="mt-4 border-t border-slate-200 pt-3"
                    >
                        <Text className="font-semibold text-slate-900">
                            {step?.question}
                        </Text>

                        <Text className="mt-1 text-slate-600">
                            {String(answer.answer)}
                        </Text>
                    </View>
                );
            })}
        </View>
    )
}