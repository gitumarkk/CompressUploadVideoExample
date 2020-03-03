import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import {
  TransitionPresets,
  createStackNavigator,
} from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

// Video
import ListScreen from '../screens/List';
import UploadScreen from '../screens/Upload';
import ViewScreen from '../screens/View';


// import theme from 'appSrc/theme';

const styles = StyleSheet.create({
  headerStyle: {
    height: Platform.OS === 'ios' ? 70 : 50,
  },
});

const defaultNavigationOptions = {
  ...TransitionPresets.SlideFromRightIOS,
  headerStyle: styles.headerStyle,
  // headerTitleStyle: theme.HEADER_CENTER_STYLE,
  headerBackTitle: 'Back',
  gestureEnabled: false,
};

const stackOptions = {
  mode: 'card',
  defaultNavigationOptions,
  headerMode: 'screen',
};

const ListStack = createStackNavigator({
  ListTab: {
    screen: ListScreen,
    navigationOptions: {
      title: 'List',
    },
  },
}, stackOptions);

const UploadStack = createStackNavigator({
  UploadVideoTab: {
    screen: UploadScreen,
    navigationOptions: {
      title: 'Upload',
    },
  },
}, stackOptions);

const BottomStack = createBottomTabNavigator({
  ListStack: {
    screen: ListStack,
    navigationOptions: {
      title: 'List',
    },
  },

  UploadStack: {
    screen: UploadStack,
    navigationOptions: {
      title: 'Upload',
    },
  },
}, {
  tabBarOptions: {
    // activeTintColor: theme.COLORS.ICON,
    // inactiveTintColor: theme.COLORS.BLUE_GREY,
    showLabel: true,
  },
  backBehavior: 'history',
});

const options = {
  mode: 'card',
  index: 5,
  defaultNavigationOptions,
};

const screens = {
  BottomStack: {
    screen: BottomStack,
    navigationOptions: ({ navigation }) => {
      const navOptions = {}
      if (navigation.state.routeName === 'BottomStack') {
        navOptions.headerShown = false;
      }
      return navOptions;
    },
  },

  VideoDetailScreen: {
    screen: ViewScreen,
    navigationOptions: {
      title: 'Select or Create Folder',
    },
  },
};

export default createStackNavigator(screens, options);
