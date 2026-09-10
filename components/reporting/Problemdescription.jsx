import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback} from "react-native";

//input fields for user to create title and description on problem
export default function ProblemDescription({
    titleValue,
    descriptionValue,
    onTitleChange,
    onDescriptionChange
}) {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="mt-6">
                <Text className="text-2xl font-semibold text-blue-950">
                    The problem
                </Text>

                <Text className="mt-1 text-slate-900">
                    Give the issue a title and describe the problem you're
                    encountering. Please include as much detail as possible.
                </Text>

                <View className="mt-2 p-2 rounded-xl border border-slate-300">
                    <Text className="mt-4 mx-3 font-bold text-slate-900">
                        Title:
                    </Text>

                    <TextInput
                        className="mt-2 min-h-12 rounded-xl bg-white p-4 text-slate-900 border border-slate-100"
                        placeholder="Enter your problem title"
                        placeholderTextColor="#94a3b8"
                        value={titleValue}
                        onChangeText={onTitleChange}
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                    />
                </View>

                <View className="mt-2 p-2 rounded-xl border border-slate-300">
                    <Text className="mt-4 mx-3 font-bold text-slate-900">
                        Description
                    </Text>

                    <TextInput
                        className="mt-2 min-h-32 rounded-xl bg-white p-4 text-slate-900 border border-slate-100"
                        placeholder="eg: Barcode is failing to read above 95%"
                        placeholderTextColor="#94a3b8"
                        multiline
                        textAlignVertical="top"
                        value={descriptionValue}
                        onChangeText={onDescriptionChange}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}