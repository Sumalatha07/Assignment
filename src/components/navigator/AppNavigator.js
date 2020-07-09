import React,{ Component } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from "../screens/HomePage";
import LoginPage from "../screens/LoginPage";
import UserLocation from "../screens/UserLocation";
import Notification from "../screens/Notification";
import Header from "../utility/Header";
import ProfilePage from "../screens/ProfilePage";
import FacebookLogin from "../screens/FacebookLogin";


const Stack = createStackNavigator();

export default class AppNavigator extends Component{
    constructor(props){
        super(props);
    }

    render(){

        return(
        <NavigationContainer>
            <Stack.Navigator initialRouteName='FacebookLogin' > 
            {/* screenOptions={{headerShown: false}} */}
                <Stack.Screen name='LoginPage' component={LoginPage}></Stack.Screen>
                <Stack.Screen name='HomePage' component={HomePage}></Stack.Screen>
                <Stack.Screen name='FacebookLogin' component={FacebookLogin}
                options={{headerShown: false}}
                options={() => ({
                    headerShown: false,
              })}></Stack.Screen>
                <Stack.Screen name='UserLocation' component={UserLocation}
                    options={({ navigation }) => ({
                        headerLeft: null,
                    headerTitle: props => <Header {...props} navigation={navigation} />,
                  })}></Stack.Screen>
                <Stack.Screen name='Notification' component={Notification}></Stack.Screen>
                <Stack.Screen name='Profile' component={ProfilePage}></Stack.Screen>
            </Stack.Navigator>

        </NavigationContainer>
        )  
    }
}