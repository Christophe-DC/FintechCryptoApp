import { View, Text, Pressable, ActivityIndicator, ScrollView, FlatList } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { FetchAllCoins, FetchCryptoNews, SearchCoin } from '../../../../utils/cryptoapi';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { debounce } from 'lodash';
import { TextInput } from 'react-native-gesture-handler';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import numeral from 'numeral';
import { BookmarkSquareIcon } from 'react-native-heroicons/outline';

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

const NewsScreen = () => {
  const { data: NewsData, isLoading: IsNewsLoading } = useQuery({
    queryKey: ['cryptonews'],
    queryFn: FetchCryptoNews,
  });

  const navigation = useNavigation();

  const handleClick = item => {
    navigation.navigate('NewsDetails', item);
  };

  console.log({ NewsData });

  const renderItem = ({ item, index }) => {
    return (
      <Pressable className="mb-4 mx-4 space-y-1" key={index} onPress={() => handleClick(item)}>
        <View className="flex-row justify-start w-[100%] shadow-sm">
          {/* Image */}
          <View className="items-start justify-start w-[20%]">
            <Image
              source={{
                uri: item.thumbnail,
              }}
              style={{
                width: hp(9),
                height: hp(10),
              }}
              contentFit="cover"
              className="rounded-lg"
            />
          </View>

          {/* Content */}
          <View className="w-[70%] pl-4 justify-center space-y-1">
            {/* Title */}
            <Text className="text-xl font-bold text-gray-900">
              {item?.title?.length > 20 ? item?.title?.slice(0, 20) + '...' : item.title}
            </Text>

            {/* Description */}
            <Text className="text-neutral-800 capitalize max-w-[90%]">
              {item?.description?.length > 50 ? item?.description?.slice(0, 50) + '...' : item.description}
            </Text>
            <Text className="text-xs text-gray-700">{item?.createdAt}</Text>
          </View>

          {/* Bookmark */}

          <View className="w-[10%] justify-center">
            <BookmarkSquareIcon color="gray" />
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="space-y-2 flex-1 bg-white">
      {/* Header */}
      <View className="w-full flex-row justify-between items-center px-4 pb-4">
        <View className="w-3/4 flex-row space-x-2">
          <Text className="text-3xl font-bold">Crypto News</Text>
        </View>
      </View>

      {/* Main News */}
      <View>
        {NewsData && NewsData.data.length > 0 ? (
          <FlatList
            data={NewsData.data}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
        ) : (
          <View>
            <ActivityIndicator size="large" color="black" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default NewsScreen;
