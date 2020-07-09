import React,{ Component } from "react";
import { Alert, View, Text, Button } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import firebase from "react-native-firebase";
import axios from 'axios';
import { Constants } from "../utility/Constants";

export default class Notification extends Component{
  
    async componentDidMount() {
        //we check if user has granted permission to receive push notifications.
        this.checkPermission();
        // Register all listener for notification 
        this.createNotificationListeners();
      }
    
      async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        // If Premission granted proceed towards token fetch
        if (enabled) {
          this.getToken();
        } else {
          // If permission hasn’t been granted to our app, request user in requestPermission method. 
          this.requestPermission();
        }
      }
    
      async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        console.log('FCM', fcmToken)
        if (!fcmToken) {
          fcmToken = await firebase.messaging().getToken();
          console.log("firebase", fcmToken)
          if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
          }
        }
      }
    
      async requestPermission() {
        try {
          await firebase.messaging().requestPermission();
          // User has authorised
          this.getToken();
        } catch (error) {
          // User has rejected permissions
          console.log('permission rejected');
        }
      }
    
      async createNotificationListeners() {
    
        // This listener triggered when notification has been received in foreground
        this.notificationListener = firebase.notifications().onNotification((notification) => {
          console.log('onNotification ', notification);
          const { title, body } = notification;
          this.displayNotification(title, body);
        });
    
        // This listener triggered when app is in backgound and we click, tapped and opened notifiaction
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
          console.log('onNotificationOpened ', notificationOpen);
          const { title, body } = notificationOpen; //notificationOpen.notification;
          this.displayNotification(title, body);
        });
    
        // This listener triggered when app is closed and we click,tapped and opened notification 
        const notificationOpen = await firebase.notifications().getInitialNotification();
        console.log('getInitialNotification ', notificationOpen);
        if (notificationOpen) {
          const { title, body } = notificationOpen.notification;
          this.displayNotification(title, body);
        }
      }
    
    
      displayNotification(title, body) {
        // we display notification in alert box with title and body
        console.log("displayNotification", title, body)
        Alert.alert(
          title, body,
          [
            { text: 'Ok', onPress: () => console.log('ok pressed') },
          ],
          { cancelable: false },
        );
      }

      getData = async () => {
        try {
          const value = await AsyncStorage.getItem('@storage_Key')
          if(value !== null) {
            // value previously stored
          }
        } catch(e) {
          // error reading value
        }
      }

    
      hello(){

      }

      hello = async () => {
        //get the messeging token
        const token = await notifications.getToken()
        //you can also call messages.getToken() (does the same thing)
        return token
      }

      triggerNotification(token){
        console.log("data token", token);
        var data = {
          "to" : token, //"chFixQ7nQFKJ_UwMVZXpY9:APA91bEQ18ZmzurnWGA7n4Eo2UFPxgXQaHCKw6ZdFMXbKPvf41TqUiTN7hwrS2lFBkBe-OuJR6WugaYYSL_nslYx9t2aHOn_ZKJ9XqYBJ0JhGTkcKUkcP6RrLWmmFfT6p8Gl2wXost4y",
          "collapse_key" : "type_a",
          "notification" : {
              "body" : "Assignment",
              "title": "You have moved more than 10meter from your position"
          },
          "data" : {
            "body" : "Assignment",
            "title": "You have moved more than 10meter from your position"
          }
         }

       console.log("data", data);

      //  fetch(Constants.FCM_SEND_API, {
      //   method: 'POST',
      //   headers: {
      //   'Content-Type': 'application/json',
      //   'Authorization': 'key='+Constants.FCM_SERVER_KEY
      //   },
      //   body: JSON.stringify(data)})
      //   .then((response) => response.json())
      // .then((responseJson) => {
      //    console.log(responseJson);
        
      // })
      // .catch((error) => {
      //    console.error(error);
      // });

        axios({
            method: 'post',
            url: Constants.FCM_SEND_API,
            data: data, //'userName='+username+'&password='+password,
            headers: {
              'Content-Type': 'application/json',
                'Authorization': 'key='+Constants.FCM_SERVER_KEY
            },
            validateStatus: (status) => {
               console.log('validateStatus', status);
              return true; // I'm always returning true, you may want to do it depending on the status received
            },
          }).catch(error => {
            console.log('error', error);
          //  this.setState({isLoading:false})
          }).then(response => {
            console.log('response', response);
          //  this.setState({isLoading:false})
            if(response.data && response.data.success=="true"){
                alert("successfully loggedin");
          
            }
          });
    }

     sendNotification = async() => {
      var that = this;
      try {
        const value = await AsyncStorage.getItem('fcmToken')
        console.log("value", value)
        if(value !== null) {
         this.triggerNotification(value);
        }
      } catch(e) {
       console.log("error", e)
      }
    }
    
      render() {
        return (
          <View style={{ flex: 1 }}>
            <Text>React Native Push Notification</Text>

            <Button
        onPress={this.sendNotification}
        title="Send Notification"
        color="#4267B2"
      />
          </View>
        );
      }
}