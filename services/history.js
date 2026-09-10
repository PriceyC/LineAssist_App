import api from "./api";

//returns all the history using the incident id from the backend endpoint
export const getHistory = async (IncidentId) => {
    return api.get(`/history/incidents/${IncidentId}`)
}