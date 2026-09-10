import { createContext, useContext, useEffect, useState } from 'react';
import * as Network from 'expo-network';
import { setApiOnlineStatus } from '../services/api';
import { getPendingSyncCount } from '../services/localDB';
import { syncPendingData } from '../services/sync';

//create global context for network
const NetworkContext = createContext();

//global holds the network state 
export function NetworkProvider({ children }) {
    //set pending count state to store how many changes awaiting syncing
    const [pendingCount, setPendingCount] = useState(0);

    //set network state 
    const [networkState, setNetworkState] = useState({
        isConnected: undefined,
        isInternetReachable: undefined,
        type: undefined
    });

    //use expo network to check whether online and store in state
    const checkNetwork = async () => {
        try {
            const state = await Network.getNetworkStateAsync();
            setNetworkState(state);

            //check pending counts and set in state
            const count = await getPendingSyncCount();
            setPendingCount(count);
        } catch (error) {
            console.log('Failed to check network state:', error);
        }
    };

    useEffect(() => {
        //check straight away
        checkNetwork();

        //poll every two seconds for network and new changes to be synced
        const interval = setInterval(() => {
            checkNetwork();
        }, 2000);
        return () => {
            clearInterval(interval);
        };
    }, []);


    //is online if connected
    const isOnline =
        networkState.isConnected === true &&
        networkState.isInternetReachable === true;


    //set the api status sow e know whether to call on the online or offline endpoints
    setApiOnlineStatus(isOnline);

    //if we're online and ethere are any changes to be synced then sync them rather than waiting for a rerender
    useEffect(() => {
        if (isOnline && pendingCount > 0) {
            syncPendingData();
        }
    }, [isOnline, pendingCount]);

    return (
        <NetworkContext.Provider
            value={{
                isOnline,
                isConnected:
                    networkState.isConnected === true,
                isCheckingNetwork:
                    networkState.isInternetReachable === undefined ||
                    networkState.isInternetReachable === null,
                pendingCount
            }}
        >
            {children}
        </NetworkContext.Provider>
    );
}


export function useNetwork() {
    return useContext(NetworkContext);
}