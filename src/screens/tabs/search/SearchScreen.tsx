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

const SearchScreen = () => {
  const [isLoading, setLoading] = useState(false);
  const [result, setResult] = useState<any>([]);

  console.log({ result });

  const { navigate }: NavigationProp<ScreenNavigationType> = useNavigation();

  const { navigate: navigateHome }: NavigationProp<HomeNavigationType> = useNavigation();

  const renderItem = ({ item, index }: { item: Coin; index: number }) => (
    <Pressable
      className="flex-row w-full py-4 items-center px-4"
      onPress={() => navigate('CoinDetails', { coinUuid: item.uuid })}
      key={item.uuid}
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
          </View>
        </View>

        <View className="w-[29%] justify-center items-end">
          <Text className="font-bold text-base">{item.symbol}</Text>
          <View className="flex-row justify-center items-center space-x-2">
            <Text className="font-medium text-sm text-neutral-500">
              {item?.marketCap?.length > 9 ? item.marketCap.slice(0, 9) : item.marketCap}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );

  const handleSearch = async (search: string) => {
    if (search && search.length > 3) {
      setLoading(true);

      try {
        const results = await SearchCoin(search);

        if (results) {
          setResult(results);
        }
      } catch (error) {
        console.log(error);
        setResult([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="w-full flex-row justify-between items-center px-4 pb-4">
        <View className="w-3/4 flex-row space-y-2">
          <Text className="text-3xl font-bold">Search</Text>
        </View>
      </View>

      {/* Search Field */}
      <View className="mx-4 mb-3 flex-row border-2 justify-between items-center bg-white rounded-lg shadow-sm">
        <TextInput
          onChangeText={handleTextDebounce}
          placeholder="Search for your coins"
          placeholderTextColor={'gray'}
          className="pl-2 flex-1 font-medium text-blackck tracking-wider"
        />
        <Pressable onPress={() => navigateHome('HomeS')}>
          <XMarkIcon size="25" color="black" />
        </Pressable>
      </View>

      <View className="mt-4">
        {isLoading ? (
          <View>
            <ActivityIndicator size="large" color="#164bd8" />
          </View>
        ) : (
          <FlatList
            data={result?.data?.coins}
            keyExtractor={item => item.uuid}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;
