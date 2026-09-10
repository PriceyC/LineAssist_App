import api from "./api";
import {
    getLocalNotes,
    createLocalNote,
    addToSyncQueue
} from "./localDB";

// Get all notes for an incident
export const getIncidentNotes = async (incidentId, local = false) => {
    if (local) {
        return getLocalNotes(Number(incidentId));
    }

    try {
        return await api.get(`/notes/incidents/${incidentId}`);
    } catch (error) {
        return getLocalNotes(Number(incidentId));
    }
};

// Create a new incident note
export const createIncidentNote = async (incidentId, userId, note, local = false) => {
    if (local) {
        const localId = await createLocalNote({
            incident_local_id: Number(incidentId),
            created_by: userId,
            note
        });

        await addToSyncQueue(
            'note',
            localId,
            'CREATE'
        );

        return {
            local_id: localId
        };
    }

    try {
        return await api.post(`/notes/incidents/${incidentId}`, {
            user_id: userId,
            note
        });
    } catch (error) {
        console.log('API unavailable. Creating note locally.');

        const localId = await createLocalNote({
            incident_local_id: Number(incidentId),
            created_by: userId,
            note
        });

        await addToSyncQueue(
            'note',
            localId,
            'CREATE'
        );

        return {
            local_id: localId
        };
    }
};