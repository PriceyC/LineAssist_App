import api from './api';
import { uploadEvidence, createEvidence } from './evidence';
import {
    getPendingSyncItems,
    getLocalIncident,
    updateLocalIncidentServerId,
    getLocalDiagnosticSession,
    updateLocalDiagnosticSessionServerId,
    getLocalDiagnosticAnswer,
    updateLocalDiagnosticAnswerServerId,
    getLocalEvidenceItem,
    updateLocalEvidenceServerId,
    markSyncItemComplete
} from './localDB';

//syncing data from lcoal db ro online db
export async function syncPendingData(){
    //retrieve items awaiting sync from local db
    const pendingItems = await getPendingSyncItems();

    //checks if theres anything to sync before running
    if (pendingItems.length === 0) return;

    //begin iterating through pending changes for incidents and start syncing one by one
    for (const item of pendingItems){
        //checks its an incident
        if ( item.entity_type !== 'incident' || item.operation !== 'CREATE') continue;
        
        //try catch to stop if error
        try{
            //gets lcoal incident by id
            const incident = await getLocalIncident(item.local_id);
            //if fails then returns
            if (!incident) continue;

            //checks if the incident already has server id
            if (incident.server_id) {
                //marks as complete already
                await markSyncItemComplete(item.id);
                continue;
            }

            //posts to online db
            const response = await api.post('/incidents', {
                site_id: incident.site_id,
                line_id: incident.line_id,
                device_id: incident.device_id,
                created_by: incident.created_by,
                title: incident.title,
                description: incident.description,
                severityid: incident.severity_id
            });

            //update local incident with server id returned
            await updateLocalIncidentServerId(
                item.local_id,
                response.incidentid
            );

            //marks the sync as complete for that incident
            await markSyncItemComplete(item.id);

        } catch (error){
            console.error(
                `Failed to sync incident ${item.local_id}:`,
                error
            );
        }
    }

    //evidence sync
    for (const item of pendingItems){
        //checks there it is evidence
        if (item.entity_type !== 'evidence' || item.operation !== 'CREATE') continue;

        //try catch for error handling
        try {
            //gets local evidence and checks it exists
            const evidence = await getLocalEvidenceItem(item.local_id);
            if (!evidence) continue;

            //checks if already synced
            if (evidence.server_id){
                await markSyncItemComplete(item.id);
                continue;
            }

            //get icnident eveidence associated with
            const incident = await getLocalIncident(evidence.incident_local_id);
            if (!incident) continue;

            //check incidnet has been synced already before trying to sync evidence 
            if (!incident.server_id) continue;
        
            //upload image to Supabase Storage
            const uploaded = await uploadEvidence(
                incident.server_id,
                evidence.file_uri,
                evidence.file_type,
                evidence.description
            );

            //create Postgres evidence record
            const serverEvidence = await createEvidence(
                incident.server_id,
                uploaded.type,
                uploaded.path,
                uploaded.description
            );

            //update local record
            await updateLocalEvidenceServerId(
                evidence.local_id,
                serverEvidence.id
            );

            //mark sync queue item complete
            await markSyncItemComplete(item.id);

        } catch (error) {
            console.error(
                `Failed to sync evidence ${item.local_id}:`,
                error
            );
        }
    }

    //diagnostic session sync
    for (const item of pendingItems) {
        //check its correct to sync
        if (item.entity_type !== 'diagnostic_session' || item.operation !== 'CREATE') continue;

        try {
            const session = await getLocalDiagnosticSession(item.local_id);
            if (!session) continue;

            //check already synced previously
            if (session.server_id) {
                await markSyncItemComplete(item.id);
                continue;
            }

            //get incident linked to 
            const incident = await getLocalIncident(session.incident_local_id);
            if (!incident) continue;

            //check incidnet is synced before syncing diagnostic
            if (!incident.server_id) continue;

            //post to online db
            const response = await api.post(
                `/diagnostics/incidents/${incident.server_id}`,
                {
                    diagnostic_type: session.diagnostic_type
                }
            );

            //updates the completed at online to current time
            if (session.completed_at){
                await api.patch(
                    `/diagnostics/${response.id}`,
                    {
                        completed_at: session.completed_at
                    }
                );
            }

            //update server id
            await updateLocalDiagnosticSessionServerId(
                item.local_id,
                response.id
            );

            //mark as complete in sync queue
            await markSyncItemComplete(item.id);

        } catch (error) {
            console.error(
                `Failed to sync diagnostic session ${item.local_id}:`,
                error
            );
        }
    }

    //sync diagnostic asnwers
    for (const item of pendingItems) {
        if (item.entity_type !== 'diagnostic_answer' || item.operation !== 'CREATE') continue;

        try{
            const answer = await getLocalDiagnosticAnswer(item.local_id);
            if (!answer) continue;

            //already synced previously
            if (answer.server_id) {
                await markSyncItemComplete(item.id);
                continue;
            }
            
            const session = await getLocalDiagnosticSession(answer.session_local_id);
            if (!session) continue;

            if (!session.server_id) continue;

            const response = await api.post(
                `/diagnostics/${session.server_id}/answers`,
                {
                    step_id: answer.question_id,
                    answer: String(answer.answer)
                }
            );

            await updateLocalDiagnosticAnswerServerId(
                item.local_id,
                response.id
            );

            await markSyncItemComplete(item.id);

        } catch (error){
            console.error(
                `Failed to sync diagnostic answer ${item.local_id}:`,
                error
            );
        }
    }
}