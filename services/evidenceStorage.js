import { Directory, File, Paths } from 'expo-file-system';

//creates local temporary storage for image
const evidenceDirectory = new Directory(
    Paths.document,
    'evidence'
);

//saves image to local expo storage 
export function saveEvidenceFile(sourceUri) {

    //if nowhere to store creates one
    if (!evidenceDirectory.exists) {
        evidenceDirectory.create();
    }

    //sets filename
    const filename = `evidence_${Date.now()}.jpg`;

    //sets destination where file is saved
    const destination = new File(
        evidenceDirectory,
        filename
    );

    //returns the uri
    const source = new File(sourceUri);

    //copy the camera image into local storage
    source.copy(destination);

    return destination.uri;
}