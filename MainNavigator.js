import  * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginPage from './screens/LoginPage/';
import MainPage from './screens/MainPage/';
import RegisterPage from './screens/RegisterPage';
import ConnectPage from './screens/ConnectPage';
import SignalPage from './screens/SignalPage';
import CodePage from './screens/CodePage';

const Stack = createStackNavigator()

function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Login' component={LoginPage} options={{headerShown: false}}/>
        <Stack.Screen name='Register' component={RegisterPage} options={{headerShown: false}}/>
        <Stack.Screen name='Main' component={MainPage} options={{headerShown: false}}/>
        <Stack.Screen name='Connect' component={ConnectPage} options={{headerShown: false}}/>
        <Stack.Screen name='Code' component={CodePage} options={{headerShown: false}}/>
        <Stack.Screen name='Signal' component={SignalPage} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigator