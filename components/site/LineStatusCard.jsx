import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

// Component for card with line description, system type and status
export default function LineStatusCard({ line, onPress }) {
    //set status to lowercase
    const status = line.statusdesc?.toLowerCase();

    //custom styles for the border cards based of the state
    const statusStyles = {
        running: {
            border: 'border-green-600',
            background: 'bg-white',
            text: 'text-green-700',
        },
        warning: {
            border: 'border-yellow-500',
            background: 'bg-white',
            text: 'text-yellow-700',
        },
        fault: {
            border: 'border-red-500',
            background: 'bg-red-50',
            text: 'text-red-700',
        },
        stopped: {
            border: 'border-slate-500',
            background: 'bg-slate-50',
            text: 'text-slate-700',
        },
        maintenance: {
            border: 'border-blue-500',
            background: 'bg-blue-50',
            text: 'text-blue-700',
        },
        disabled: {
            border: 'border-slate-400',
            background: 'bg-slate-50',
            text: 'text-slate-600',
        },
    };

    //if theres a case there is no status eg: loading offline then another custom style
    const styles = statusStyles[status] ?? {
        border: 'border-slate-300',
        background: 'bg-slate-50',
        text: 'text-slate-600',
    };

    return (
        <Pressable
            className={`rounded-xl p-4 mb-3 border border-slate-200 border-l-4 ${styles.border} ${styles.background} active:opacity-90`}
            style={{ elevation: 3 }}
            onPress={onPress}
        >
            <View className="flex-row items-center">
                <View className="flex-1 mr-4">
                    <Text
                        className="text-lg font-semibold text-slate-900"
                        numberOfLines={1}
                    >
                        {line.linedesc ?? line.description}
                    </Text>

                    <Text
                        className="text-sm text-slate-500 mt-1"
                        numberOfLines={1}
                    >
                        {line.system_type}
                    </Text>
                </View>

                <View className="items-end">
                    <View className={`rounded-full px-3 py-1 ${styles.background}`}>
                        <Text className={`text-sm font-semibold ${styles.text}`}>
                            {line.statusdesc || 'Unavailable'}
                        </Text>
                    </View>

                    <ChevronRight
                        size={22}
                        color="#64748b"
                        strokeWidth={2.5}
                        style={{ marginTop: 10 }}
                    />
                </View>
            </View>
        </Pressable>
    );
}