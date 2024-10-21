import { View, Text, Pressable, ActivityIndicator, ScrollView, FlatList, Alert } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '@/src/components/Avatar';
import useSupabaseAuth from '@/hooks/useSupabaseAuth';
import { useUserStore } from '@/store/useUserStore';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { FetchAllCoins } from '../../../../utils/cryptoapi';
import Animated, { FadeInDown } from 'react-native-reanimated';
import numeral from 'numeral';

interface Coin {
  uuid: string;
  name: string;
  symbol: string;
  iconUrl: string;
  price: string;
  change: number;
  marketCap: string;
}

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const HomeScreen = () => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setLoading] = useState(false);
  const { getUserProfile } = useSupabaseAuth();
  const { session } = useUserStore();

  const { navigate }: NavigationProp<ScreenNavigationType> = useNavigation();

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

  const { data: CoinsData, isLoading: IsAllCoinsLoading } = useQuery({
    queryKey: ['allCoins'],
    queryFn: FetchAllCoins,
  });

  const renderItem = ({ item, index }: { item: Coin; index: number }) => (
    <Pressable
      className="flex-row w-full py-4 items-center"
      onPress={() => navigate('CoinDetails', { coinUuid: item.uuid })}
    >
      <Animated.View
        entering={FadeInDown.duration(100)
          .delay(index * 200)
          .springify()}
        className="w-full flex-row items-center"
      >
        <View className="w-[16%]">
          <View>
            <View className="w-10 h-10">
              <Image
                source={{ uri: item.iconUrl }}
                placeholder={blurhash}
                contentFit="cover"
                transition={1000}
                className="w-full h-full flex-1"
              />
            </View>
          </View>
        </View>

        <View className="w-[55%] justify-start items-start">
          <Text className="font-bold text-lg">{item.name}</Text>

          <View className="flex-row justify-center items-center space-x-2">
            <Text className="{`font-medium text-sm text-neutral-500">
              {numeral(parseFloat(item?.price)).format('$0,0.00')}
            </Text>

            <Text
              className={`font-medium text-sm ${
                item.change < 0 ? 'text-red-600' : item.change > 0 ? 'text-green-600' : 'text-gray-600'
              }`}
            >
              {item.change}%
            </Text>
          </View>
        </View>

        <View className="w-[29%] justify-center items-end">
          <Text className="font-bold text-base">{item.symbol}</Text>
          <View className="flex-row justify-center items-center space-x-2">
            <Text className="font-medium text-sm text-neutral-500">
              {item.marketCap.length > 9 ? item.marketCap.slice(0, 9) : item.marketCap}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );

  console.log({ CoinsData });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="relative">
        {/* Header */}
        <View className="w-full flex-row justify-between items-center px-4">
          <View className="w-3/4 flex-row space-x-2">
            <View className="justify-center items-center">
              <View className="h-12 w-12 rounded-2xl overflow-hidden">
                <Avatar url={avatarUrl} size={50} onUpload={path => {}} />
              </View>
            </View>

            <View>
              <Text className="text-lg font-bold">Hi, {username ? username : 'User'}</Text>
              <Text className="text-sm text-neutral-500">Have a good day</Text>
            </View>
          </View>

          <View className="py-6">
            <Pressable
              className="bg-neutral-700 rounded-lg p-1"
              onPress={() => Alert.alert('this feature is not yet implemented')}
            >
              <Ionicons name="menu" size={24} color="white" />
            </Pressable>
          </View>
        </View>

        {/* Balance  */}
        <View className="mx-4 bg-neutral-800 rounded-[34px] overflow-hidden mt-2 mb-2">
          <View className="bg-[#0DF69E] justify-center items-center py-6 rounded-[34px]">
            <Text className="text-sm font-medium text-neutral-700">Total Balance</Text>
            <Text className="text-3xl font-extrabold">$0.00</Text>
          </View>

          <View className="justify-between items-center flex-row py-4">
            {/* Send to */}
            <View className="w-1/4 justify-center items-center space-y-2">
              <Pressable
                className="w-10 h-10 overflow-hidden bg-[#3B363F] rounded-full p-2"
                onPress={() => Alert.alert('this feature is not yet implemented')}
              >
                <Image
                  source={require('../../../../assets/images/money-send.png')}
                  placeholder={blurhash}
                  contentFit="cover"
                  transition={1000}
                  className="w-full h-full flex-1"
                />
              </Pressable>
              <Text className="text-white">Send to</Text>
            </View>

            {/* Request */}
            <View className="w-1/4 justify-center items-center space-y-2">
              <Pressable
                className="w-10 h-10 overflow-hidden bg-[#3B363F] rounded-full p-2"
                onPress={() => Alert.alert('this feature is not yet implemented')}
              >
                <Image
                  source={require('../../../../assets/images/money-receive.png')}
                  placeholder={blurhash}
                  contentFit="cover"
                  transition={1000}
                  className="w-full h-full flex-1"
                />
              </Pressable>
              <Text className="text-white">Request</Text>
            </View>

            {/* Top up */}
            <View className="w-1/4 justify-center items-center space-y-2">
              <Pressable
                className="w-10 h-10 overflow-hidden bg-[#3B363F] rounded-full p-2"
                onPress={() => Alert.alert('this feature is not yet implemented')}
              >
                <Image
                  source={require('../../../../assets/images/card-add.png')}
                  placeholder={blurhash}
                  contentFit="cover"
                  transition={1000}
                  className="w-full h-full flex-1"
                />
              </Pressable>
              <Text className="text-white">Top up</Text>
            </View>

            {/* More  */}
            <View className="w-1/4 justify-center items-center space-y-2">
              <Pressable
                className="w-10 h-10 overflow-hidden bg-[#3B363F] rounded-full p-2"
                onPress={() => Alert.alert('this feature is not yet implemented')}
              >
                <Image
                  source={require('../../../../assets/images/more.png')}
                  placeholder={blurhash}
                  contentFit="cover"
                  transition={1000}
                  className="w-full h-full flex-1"
                />
              </Pressable>
              <Text className="text-white">More</Text>
            </View>
          </View>
        </View>

        {/* Coins  */}
        <ScrollView contentContainerStyle={{ paddingBottom: 300 }} showsVerticalScrollIndicator={false}>
          <View className="px-4 items-center">
            {IsAllCoinsLoading ? (
              <ActivityIndicator size="large" color="black" />
            ) : (
              <FlatList
                nestedScrollEnabled={true}
                scrollEnabled={false}
                data={CoinsData.data.coins}
                keyExtractor={item => item.uuid}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
