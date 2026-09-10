import {
    View,
    Text,
    Pressable,
    Image,
    TextInput
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { saveEvidenceFile } from '../../../services/evidenceStorage';
import { createLocalEvidence } from '../../../services/localDB';
import { useLocalSearchParams } from 'expo-router';

//incident evdience page allows photo to be taken and stored. Stores locally first unlike rest of the app that is dependant on cinnection, then sill sync straight to the online db if connected
export default function IncidentEvidence(){
    //pull incident id, local id and whether its locla or not from the paarams
    const { incidentId, localIncidentId, local } = useLocalSearchParams();

    //set state for storing the image description and saving state
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);

    //take phot using expo image picker
    const takePhoto = async () => {
        //get user permissions from the phone
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        //if permissions not granted returns as failed
        if (!permission.granted) {
            return;
        }

        //result is output of image picker with set media type and quality
        const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7 });

        //if result is not cancelled
        if (!result.canceled) {
            //sets a temporrary uri for the phot
            const temporaryUri = result.assets[0].uri;

            //saves the phot which sets a permanent uri for the photo
            const permanentUri = await saveEvidenceFile(
                temporaryUri
            );

            //store uri and decsription in state
            setImage(permanentUri);
            setDescription('');
        }
    };

    //saves the evidence 
    const saveEvidence = async () => {
        //returns if no image or decsription
        if (!image || !description.trim()) {
            return;
        }
        //if already saving returns
        if (saving) {
            return;
        }

        //sets saving to true whilst it is in progress
        setSaving(true);

        //try catch to stop if any errors
        try {
            //saves evidence locally first
            const evidenceId = await createLocalEvidence({
                incident_local_id: Number(localIncidentId),
                file_uri: image,
                file_type: 'image/jpeg',
                description: description.trim()
            });

            //sets evidence state to null
            setImage(null);
            setDescription('');

            //pushes user back to incident for the evidence, which will be shown locally whilst it syncs online
            router.push({
                        pathname: `/incidents/${incidentId}`,
                        params: {
                            local: local === 'true' ? 'true' : 'false'
                        }
                    });
        } catch (error) {
            console.error('saving evidence failed')
        } finally {
            setSaving(false);
        }
    };

    return (
        <View className="flex-1 px-6 pt-14">

            {/* Header */}
            <View className="items-center">
                <Text className="text-2xl font-bold text-slate-900">
                    Evidence
                </Text>

                <Text className="mt-2 text-center text-slate-500">
                    Record evidence to attach to your incident
                </Text>
            </View>

            {/* before photo */}
            {!image && (
                <View className="mt-8 w-full flex-1 items-center">

                    <View className="w-full rounded-2xl border border-slate-200 bg-white p-8 items-center">

                        <Text className="text-lg font-semibold text-slate-900">
                            Add Evidence
                        </Text>

                        <Text className="mt-2 text-center text-sm text-slate-500">
                            Take a photo of the equipment, fault or other
                            relevant evidence.
                        </Text>

                        <Pressable
                            className="mt-6 rounded-xl bg-blue-950 px-8 py-4 active:bg-blue-900"
                            onPress={takePhoto}
                        >
                            <Text className="font-semibold text-white">
                                Take Photo
                            </Text>
                        </Pressable>

                    </View>

                </View>
            )}

            {/* after photo */}
            {image && (
                <View
                    style={{
                        width: '100%',
                        flexShrink: 0,
                        alignSelf: 'stretch',
                        }}
                >

                    {/* Photo preview */}
                    <View
                        className="w-full"
                        style={{
                            alignSelf: 'stretch',
                        }}
                    >
                        <Text className="mb-3 text-center font-semibold text-slate-900">
                            Photo Preview
                        </Text>

                        <Image
                            source={{ uri: image }}
                            style={{
                                width: '100%',
                                height: 250,
                                borderRadius: 12,
                                flexShrink: 0
                            }}
                            resizeMode="cover"
                        />
                    </View>

                    {/* description section*/}
                    <View
                        style={{
                            width: '100%',
                            flexShrink: 0,
                        }}
                    >
                        <Text className="font-semibold text-slate-900">
                            Description
                        </Text>

                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Describe what this photo shows..."
                            multiline
                            textAlignVertical="top"
                            className="mt-2 rounded-xl border border-slate-200 bg-white p-4 text-slate-900"
                            style={{
                                width: '100%',
                                minHeight: 96,
                                flexShrink: 0
                            }}
                        />
                    </View>

                    {/* Button for saving and retrying */}
                    <View className="mt-4 w-full flex-row gap-3">

                        <Pressable
                            className="flex-1 rounded-xl bg-slate-200 p-4 active:bg-slate-300"
                            onPress={takePhoto}
                            disabled={saving}
                        >
                            <Text className="text-center font-semibold text-slate-900">
                                Retake
                            </Text>
                        </Pressable>

                        <Pressable
                            className={`flex-1 rounded-xl p-4 ${
                                description.trim()
                                    ? 'bg-blue-600 active:bg-blue-700'
                                    : 'bg-slate-300'
                            }`}
                            onPress={saveEvidence}
                            disabled={
                                saving ||
                                !description.trim()
                            }
                        >
                            <Text className="text-center font-semibold text-white">
                                {saving
                                    ? 'Saving...'
                                    : 'Save Evidence'}
                            </Text>
                        </Pressable>

                    </View>

                </View>
            )}

        </View>
    );
}