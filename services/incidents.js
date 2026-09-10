import api from './api'
import { createLocalIncident, addToSyncQueue, getLocalIncident, getLocalIncidents } from './localDB';

//get incidents returns all incidents open on site
export const getIncidents = async (siteid, lineStatus, severity) => {
    let endpoint = `/incidents?siteid=${siteid}`;

    //if line status param is provided, add it to the URL
    if (lineStatus) {
        endpoint += `&status=${encodeURIComponent(lineStatus)}`;
    }

    //if severity param is provided, add it to the URL
    if (severity) {
        endpoint += `&severity=${encodeURIComponent(severity)}`;
    }

    try{
        //Try to get incidents from the API first
        return await api.get(endpoint);
    } catch (error) {
        //If API is unavailable, use local SQLite data
        return await getLocalIncidents(siteid);
    }
};

//get single incident using id to be used when clicking from incidents list
export const getIncident = async (id, local = false) => {

    if (local){
        const result = await getLocalIncident(Number(id));

        if (!result) {
            throw new Error(`Local incident ${id} was not found`);
        }

        return result;
    }

    try{
        return await api.get(`/incidents/${id}`);
    } catch (error) {
        return await getLocalIncident(Number(id));
    }
};

//create an incident
export async function createIncident(incident){
    try{
        return await api.post('/incidents', incident);
    } catch (error){
        console.log('API unreachable, moving to offline creation');

        const localId = await createLocalIncident({
            site_id: incident.site_id,
            line_id: incident.line_id,
            device_id: incident.device_id ?? null,
            title: incident.title,
            description: incident.description,
            severity_id: incident.severityid,
            status_id: 1,
            created_by: incident.created_by
        })

        await addToSyncQueue('incident', localId, 'CREATE');

        return { local_id: localId };
    }
}

export const getSeverity = async () => {
    return api.get('/severity');
}