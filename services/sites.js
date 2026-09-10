import api from "./api";
import { getOfflineSites } from "./localDB";

//import the api function and use that to process requests for /sites
export const getSites = async (id) => {
    try {
        return await api.get(`/sites/${id}`);

    } catch (error) {
        try {
            const sites = await getOfflineSites(id);

            return sites;

        } catch (offlineError) {
            throw offlineError;
        }
    }
};