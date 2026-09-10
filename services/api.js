// export const API_URL = 'http://192.168.1.132:3000/api'; local api url used whilst hosting backend locally
export const API_URL = 'https://l-ine-assist-server.vercel.app/api'; //hosted backend url

//start is online as true, as more than likely to be true than false
let isOnline = true;

//ser is online to status of network
export const setApiOnlineStatus = (status) => {
    isOnline = status;
};

//checks if online and throws an error during api call
const checkOnline = (endpoint) => {
        if (!isOnline) {
            console.log('blocked request:', endpoint);
            throw new Error('app offline');
        }    
};

//as a fall back in case the check network is too slow, there is a timeout set for API requests so it can progress to an offline request quicker so user isn't wiating too long
const fetchWithTimeout = async (url, options = {}, timeout = 3000) => {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });

        return response;
    } catch (error) {
        if (
            error.name === 'AbortError' ||
            error.message?.toLowerCase().includes('cancelled') ||
            error.message?.toLowerCase().includes('network')
        ) {
            throw new Error('app offline');
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
};

// set up consistent API responses with error handling for each type of request
const api = {

    // GET requests
    get: async (endpoint) => {
        //check if endpoint can be ran online
        checkOnline(endpoint);

        try {
            //tries online first
            const response = await fetchWithTimeout(`${API_URL}${endpoint}`);

            //if it fails throw an error
            if (!response.ok) {
                throw new Error(
                    `GET ${endpoint} failed with ${response.status}`
                );
            }
            return response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error(`GET ${endpoint} timed out`);
            }
            throw error;
        }
    },

    // POST requests
    post: async (endpoint, data) => {
        //checks if api can be ran online
        checkOnline(endpoint);

        try {
            //attempts online api
            const response = await fetchWithTimeout(
                `${API_URL}${endpoint}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            );

            //if it fails throws an error
            if (!response.ok) {
                throw new Error(
                    `POST ${endpoint} failed with ${response.status}`
                );
            }

            return response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error(`POST ${endpoint} timed out`);
            }
            throw error;
        }
    },

    // PATCH
    patch: async (endpoint, data) => {
        checkOnline(endpoint);

        try {
            const response = await fetchWithTimeout(
                `${API_URL}${endpoint}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            );

            if (!response.ok) {
                throw new Error(
                    `PATCH ${endpoint} failed with ${response.status}`
                );
            }
            return response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error(`PATCH ${endpoint} timed out`);
            }
            throw error;
        }
    },

    // DELETE
    delete: async (endpoint) => {
        checkOnline(endpoint);

        try {
            const response = await fetchWithTimeout(
                `${API_URL}${endpoint}`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) {
                throw new Error(
                    `DELETE ${endpoint} failed with ${response.status}`
                );
            }

            return response.json();

        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error(`DELETE ${endpoint} timed out`);
            }

            throw error;
        }
    },

    upload: async (endpoint, formData) => {
        checkOnline();
        try {
            const response = await fetchWithTimeout(
                `${API_URL}${endpoint}`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error(
                    `POST ${endpoint} failed with ${response.status}`
                );
            }

            return response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error(`POST ${endpoint} timed out`);
            }
            throw error;
        }
    }
};

export default api;