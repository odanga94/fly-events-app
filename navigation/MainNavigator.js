import React from 'react';
import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator,
  createSwitchNavigator,
  DrawerItems
} from 'react-navigation';
import { Platform, SafeAreaView, Button, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import EventsListScreen from '../screens/events/EventsListScreen';
import EventDetailsScreen from '../screens/events/EventDetailsScreen';
import CartScreen from '../screens/events/CartScreen';
import OrdersScreen from '../screens/events/OrdersScreen';
import UserEventsScreen from '../screens/user/UserEventsScreen';
import EditEventScreen from '../screens/user/EditEventScreen';
import AuthScreen from '../screens/user/AuthScreen';
import StartUpScreen from '../screens/StartUpScreen';
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
  headerTitleStyle: {
    fontFamily: 'open-sans-bold'
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans'
  }
}

const EventsStackNavigator = createStackNavigator(
  {
    EventsOverview: EventsListScreen,
    EventDetails: EventDetailsScreen,
    Cart: CartScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => <Ionicons name='ios-cart' size={23} color={drawerConfig.tintColor} />
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

const OrdersNavigator = createStackNavigator(
  {
    orders: OrdersScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => <Ionicons name='ios-list' size={23} color={drawerConfig.tintColor} />
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

const MyEventsNavigator = createStackNavigator(
  {
    UserEvents: UserEventsScreen,
    EditEvent: EditEventScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => <Ionicons name='ios-create' size={23} color={drawerConfig.tintColor} />
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

const EventsDrawerNavigator = createDrawerNavigator(
  {
    Events: EventsStackNavigator,
    Orders: OrdersNavigator,
    'My Events': MyEventsNavigator
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary
    },
    contentComponent: props => {
      const dispatch = useDispatch();
      return (
        <View style={{flex: 1}}>
          <SafeAreaView  forceInset={{top: 'always', horizontal: 'never'}}>
            <DrawerItems {...props} />
            <Button title="Log Out" color={Colors.primary} onPress={() => {
              dispatch(authActions.logOut());
              //props.navigation.navigate('Auth');
            }} />
          </SafeAreaView>
        </View>
      )
    }
  }
);

const AuthNavigator = createStackNavigator({
  Auth: AuthScreen
}, {
  defaultNavigationOptions: defaultNavOptions
});

const MainNavigator = createSwitchNavigator({
  StartUp: StartUpScreen,
  Auth: AuthNavigator,
  Events: EventsDrawerNavigator
});

export default createAppContainer(MainNavigator);
