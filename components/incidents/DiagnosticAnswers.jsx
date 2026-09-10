import { View, Text } from "react-native";

//redners diagnostic answer for the incident detail
export default function DiagnosticAnswers({ answers }){
    //check to make sure there are answers to render before rendering
    if(!answers || answers.length == 0){
        return(
            <Text className='text-slate-500'>
                No Answers have been recorded
            </Text>
        )
    }

    return(
        <View className='mt-3'>
            {answers.map((answer) => (
                <View 
                    key={answer.id}
                    className='mb-3 rounded-lg bg-slate-50 p-3'
                >
                    <Text className='font-semibold text-slate-900'>
                        {answer.step_id}
                    </Text>

                    <Text className='mt-1 text-slate-600'>
                        {answer.answer}
                    </Text>
                </View>
            ))}
        </View>
    )
}