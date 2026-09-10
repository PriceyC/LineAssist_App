import api, { API_URL } from "./api";
import { fetch } from "expo/fetch";
import { File } from "expo-file-system";

//returns evidence itself
export const getEvidence = async (incidentId) => {
    return api.get(`/evidence/incidents/${incidentId}`);
};

//uploads evidence process, from local db syncing to online db everytime
export const uploadEvidence = async (
    incidentId,
    fileUri,
    fileType,
    description
) => {

    //returns if no valid URI
    if (!fileUri) {
        throw new Error("Evidence file URI is undefined");
    }

    //sets uri as new file 
    const file = new File(fileUri);

    //if file unable to be set eg: invalid media type, will fail with error
    if (!file.exists) {
        throw new Error(`Evidence file does not exist: ${fileUri}`);
    }

    //creates new form data instance
    const formData = new FormData();

    //adds the id for incident
    formData.append(
        "incidentId",
        String(incidentId)
    );

    //adds the description
    formData.append(
        "description",
        description || ""
    );

    //adds the file
    formData.append(
        "file",
        file
    );

    //posts to the endpoint for the storage bucket in supabase
    const response = await fetch(
        `${API_URL}/storage/upload`,
        {
            method: "POST",
            body: formData
        }
    );

    //if unsuccessful will throw an error
    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Evidence upload failed with ${response.status}: ${errorText}`
        );
    }

    //returns response
    return response.json();
};

//creates new evidence
export const createEvidence = async (
    incidentId,
    type,
    uri,
    description
) => {

    return api.post(
        `/evidence/incidents/${incidentId}`,
        {
            type,
            uri,
            description
        }
    );
};