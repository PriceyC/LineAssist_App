import api from "./api";
import diagnostics from "../data/diagnostics";
import { 
    createLocalDiagnosticSession,
    createLocalDiagnosticAnswer,
    getLocalDiagnosticSessions,
    getLocalDiagnosticAnswers,
    completeLocalDiagnosticSession,
    addToSyncQueue 
} from "./localDB";

//get all diagnostic sessions for a single incident
export const getDiagnosticSessions = async (incidentId, local = false) => {
    //if local passed wil do offline first data
    if (local) {
        return await getLocalDiagnosticSessions(Number(incidentId));
    }

    //if online fails will fall back to local
    try{
        return await api.get(`/diagnostics/incidents/${incidentId}`);
    } catch (error) {
        return await getLocalDiagnosticSessions(Number(incidentId));
    }
};

//get single diagnostic session - unused currently
export const getDiagnosticSession = async (sessionId) => {
    return api.get(`/diagnostics/${sessionId}`);
}

//get all answers belonging to the diagnostic session
//will do offline if local passed, otherwise try online with offline as a fallback
export const getDiagnosticAnswers = async (sessionId, local = false) => {
    if (local) {
        return getLocalDiagnosticAnswers(Number(sessionId));
    }

    try{
        return await api.get(`/diagnostics/${sessionId}/answers`);
    } catch (error) {
        return getLocalDiagnosticAnswers(Number(sessionId));
    }
};

//get all diagnostic definitions from the JSON files
export const getDiagnosticdefinitions = (diagnosticType) => {
    return diagnostics.find(
        diagnostic => diagnostic.id === diagnosticType
    )
}

//creates a new diagnostic session
//will do offline if local passed, otherwise try online with offline as a fallback
export const createDiagnosticSession = async (incidentId, diagnosticType, local = false) => {
    //if doing local will add the session to the local db and then set it up in the sync queue
    if (local){
        const localId = await createLocalDiagnosticSession({
            incident_local_id: Number(incidentId),
            diagnostic_type: diagnosticType
        });

        await addToSyncQueue('diagnostic_session', localId, 'CREATE');

        return {
            local_id: localId
        };
    }

    //will post to online endpoint if not local, if that fails will again revert to local process as above
    try{
        return await api.post(`/diagnostics/incidents/${incidentId}`, {
            diagnostic_type: diagnosticType
        });
    } catch (error) {
        const localId = await createLocalDiagnosticSession({
            incident_local_id: Number(incidentId),
            diagnostic_type: diagnosticType
        });

        await addToSyncQueue('diagnostic_session', localId, 'CREATE');

        return {
            local_id: localId
        };
    }
};

//add answer to the diagnostic session
//will do offline if local passed, otherwise try online with offline as a fallback
export const addDiagnosticAnswer = async (
    sessionId,
    stepId,
    answer,
    local = false
) => {

    //local will try offline db then add to sync queue
    if (local){
        const localId = await createLocalDiagnosticAnswer({
            session_local_id: Number(sessionId),
            question_id: stepId,
            answer
        });

        await addToSyncQueue(
            'diagnostic_answer',
            localId,
            'CREATE'
        );

        return {
            local_id: localId
        };
    }

    //otherwise will attempt online post to endpoint, with local as fallback
    try{
        return await api.post(`/diagnostics/${sessionId}/answers`, {
            step_id: stepId,
            answer: String(answer)
        });
    } catch (error) {
        const localId = await createLocalDiagnosticAnswer({
            session_local_id: Number(sessionId),
            question_id: stepId,
            answer
        });

        await addToSyncQueue(
            'diagnostic_answer',
            localId,
            'CREATE'
        );

        return {
            local_id: localId
        };
    }
};

//completes the diagnostic diagnostic session, updating to completion time from null to current time
//will do offline if local passed, otherwise try online with offline as a fallback
export const completeDiagnosticSession = async (sessionId, local = false) => {
    if (local){
        await completeLocalDiagnosticSession(sessionId);

        return {
            local_id: Number(sessionId)
        };
    }

    //online will update online db and fall back to local if fails
    try{
        return await api.patch(`/diagnostics/${sessionId}`, {
            completed_at: new Date().toISOString()
        });
    } catch (error) {
        await completeLocalDiagnosticSession(sessionId);

        return {
            local_id: Number(sessionId)
        };
    }
};