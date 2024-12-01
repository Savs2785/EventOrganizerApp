import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from './screens/SignupScreen';
import SignInScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CreateEventScreen from './screens/CreateEventScreen';
// import FavoriteEvents from './screens/FavouriteEvent';
import EditEventScreen from './screens/EditEventScreen';
import FavouritesScreen from './screens/Favorite';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
        {/* <Stack.Screen name="FavoriteEvents" component={FavoriteEvents} /> */}
        <Stack.Screen name="EditEventScreen" component={EditEventScreen} />
        <Stack.Screen name="FavouritesScreen" component={FavouritesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
