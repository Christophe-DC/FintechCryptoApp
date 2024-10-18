import React from 'react';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import NewsScreen from '../../tabs/news/NewsScreen';
import NewsDetailsScreen from '../../stacks/NewsDetailsScreen';
import ProfileScreen from '../../tabs/profile/ProfileScreen';
import EditProfileScreen from '../../stacks/EditProfileScreen';
import ChangePasswordScreen from '../../stacks/ChangePasswordScreen';

const Stack = createStackNavigator();

const ProfileNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
        animationEnabled: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="ProfileS" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNavigation;
