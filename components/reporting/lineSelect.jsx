import { View, Text, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { getLines } from '../../services/lines';
import { getOfflineLines } from '../../services/localDB';

//line select lets user select a line during incident creation
export default function LineSelect({ siteId, onSelect }) {

    //set the lines data in state and set laoding/error state
    const [lines, setLines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadLines = async () => {
            try {
                //try to load from the online endpoint first
                const data = await getLines(siteId);
                setLines(data);
            } catch (error) {
                try {
                    //fall back to offline if online failed
                    const offlineLines = await getOfflineLines(siteId);
                    setLines(offlineLines);
                } catch (offlineError) {
                    console.error(
                        'Failed to load offline lines:', offlineError);
                    setError('Failed to load lines');
                }
            } finally {
                setLoading(false);
            }
        }
        loadLines();
    }, [siteId]);

    if (loading) {
        return <Text>Loading lines...</Text>;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View className='mt-6'>
            {lines.map((line) => (
                <Pressable
                    key={line.lineid ?? line.line_id}
                    className='mb-3 rounded-xl bg-slate-100 p-5 border border-slate-200'
                    onPress={() => onSelect(line)}
                >
                    <Text className='text-lg font-semibold text-slate-900'>
                        {line.linedesc ?? line.description}
                    </Text>

                    <Text className='mt-1 text-slate-500'>
                        {line.system_type}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}