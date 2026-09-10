import { View, Text } from 'react-native';
import { useNetwork } from '../context/NetworkContext';

//network status pill thats always present
export default function NetworkStatusBanner() {
    //pulls state from networkcontext
    const {
        isOnline,
        isCheckingNetwork,
        pendingCount
    } = useNetwork();

    let text;
    let background;

    //sets the stylre based on the state
    if (isCheckingNetwork) {
        text = 'Checking connection...';
        background = 'bg-slate-500';
    } else if (!isOnline) {
        text = pendingCount > 0
            ? `● Offline · ${pendingCount} pending`
            : '● Offline';
        background = 'bg-red-600';
    } else if (pendingCount > 0) {
        text = `↻ Syncing ${pendingCount} change${pendingCount === 1 ? '' : 's'}...`;
        background = 'bg-yellow-500';
    } else {
        text = '● Online';
        background = 'bg-green-600';
    }

    return(
        <View
            className={`absolute right-3 z-50 rounded-full px-4 py-2 shadow-lg ${background}`}
            style={{
                top: 40,
                elevation: 6
            }}
        >
            <Text className="text-xs font-semibold text-white">
                {text}
            </Text>
        </View>
    );
}