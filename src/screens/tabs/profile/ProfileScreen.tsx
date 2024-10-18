import { View, Text, Pressable, ActivityIndicator, ScrollView, FlatList } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { FetchAllCoins, SearchCoin } from '../../../../utils/cryptoapi';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { debounce } from 'lodash';
import { TextInput } from 'react-native-gesture-handler';
import { XMarkIcon } from 'react-native-heroicons/outline';
import numeral from 'numeral';
import { useUserStore } from '@/store/useUserStore';
import useSupabaseAuth from '@/hooks/useSupabaseAuth';
import Avatar from '@/src/components/Avatar';
import { MaterialIcons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setLoading] = useState(false);
  const { session } = useUserStore();
  const navigation = useNavigation();

  const { getUserProfile, signout, updateUserPassword } = useSupabaseAuth();

  async function handleGetProfile() {
    setLoading(true);

    try {
      const { data, error, status } = await getUserProfile();

      if (error && status !== 400) {
        setLoading(false);
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (session) {
        handleGetProfile();
      }
    }, [session])
  );

  async function handleSignOut() {
    await signout();
  }

  return (
    <View className="flex-1 bg-white">
      <View>
        {/* Avatar */}
        <View className="border justify-center items-center py-14 pb-20 bg-[#2ab07c]">
          <View className="overflow-hidden border-2 border-white rounded-3xl">
            <Avatar size={100} url={avatarUrl} />
          </View>

          <View className="w-full py-3 items-center">
            <Text className="text-lg font-bold text-white">{username}</Text>
          </View>
        </View>

        <View
          className="bg-white px-4 py-6 -mt-11"
          style={{
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        >
          <Text className="text-lg font-bold pb-2">Account Overview</Text>
        </View>

        {/* Edit Profile */}
        <View className="p-2 py-3 bg-gray-100 rounded-xl border-2 border-gray-300 my-3 mx-2">
          <Pressable
            className="flex-row justify-between items-center"
            onPress={() => navigation.navigate('EditProfile')}
          >
            <View className="flex-row justify-center items-center space-x-2">
              <View className="bg-[#2ab07c] p-1 rounded-lg">
                <MaterialIcons name="person-4" size={24} color="white" />
              </View>
              <Text className="text-lg text-gray-600 font-semibold">Edit My Profile</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color="black" />
          </Pressable>
        </View>

        {/* Change Password */}
        <View className="p-2 py-3 bg-gray-100 rounded-xl border-2 border-gray-300 my-3 mx-2">
          <Pressable
            className="flex-row justify-between items-center"
            onPress={() => navigation.navigate('ChangePassword')}
          >
            <View className="flex-row justify-center items-center space-x-2">
              <View className="bg-[#2ab07c] p-1 rounded-lg">
                <MaterialIcons name="password" size={24} color="white" />
              </View>
              <Text className="text-lg text-gray-600 font-semibold">Change Password</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color="black" />
          </Pressable>
        </View>

        {/* Loguut */}
        <View className="p-2 py-3 bg-gray-100 rounded-xl border-2 border-gray-300 my-3 mx-2">
          <Pressable className="flex-row justify-between items-center" onPress={() => handleSignOut()}>
            <View className="flex-row justify-center items-center space-x-2">
              <View className="bg-[#2ab07c] p-1 rounded-lg">
                <MaterialIcons name="logout" size={24} color="white" />
              </View>
              <Text className="text-lg text-gray-600 font-semibold">Log out</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color="black" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;
