import '../global.css'
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router'
import Logo from '../components/Logo';

//homepage to toute to login screen, just thought it'd look nice for the user when opening the app
export default function Index() {
  return (
    <View className='flex-1 items-center justify-center bg-white'>

      <Logo width='w-36' height='h-36'/>

      <Text className='mb-6 text-6xl font-bold text-blue-950'>
        LineAssist
      </Text>

      <Text className='mb-4 text-lg font-semibold text-slate-500'>
        Production line support made easy
      </Text>

      <Pressable
        className='rounded-xl bg-blue-950 px-6 py-4 active:bg-blue-100'
        onPress={() => router.push('/login')}
      >
        <Text className='font-semibold text-white'>
          Enter App
        </Text>
      </Pressable>
    </View>
  );
}