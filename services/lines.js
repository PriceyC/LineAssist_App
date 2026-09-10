import api from './api';
import {
    getOfflineLines,
    getOfflineLine,
    getDevices as getOfflineDevices
} from './localDB';

//returns all lines for a site
export const getLines = async (siteid) => {
    //tries online api first then falls back to offline loading, as lines need to be caches on first app load
    try{
        return await api.get(`/lines/site/${siteid}`);

    } catch (error){
        try{
            const lines = await getOfflineLines(siteid);

            return lines;
        } catch (offlineError) {
            throw offlineError;
        }
    }
};

// Get a single line
export const getLine = async (lineid) => {
    try{
        return await api.get(`/lines/${lineid}`);
    } catch (error) {
        return await getOfflineLine(lineid);
    }
};

// Get devices belonging to a line
export const getDevices = async (lineid) => {
    try{
        return await api.get(`/devices/line/${lineid}`);
    } catch (error) {
        return await getOfflineDevices(lineid);
    }
};