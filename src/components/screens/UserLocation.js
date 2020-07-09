import React,{ Component } from "react";
import { View, StyleSheet, BackHandler, Alert, Button } from "react-native";
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker } from "react-native-maps";
import axios from 'axios';
import Axios from "axios";
import firebase from "react-native-firebase";
import AsyncStorage from "@react-native-community/async-storage";
import { Constants } from "../utility/Constants";

export default class UserLocation extends Component{

    constructor(props) {
        super(props);

        var lastParams = this.props.route.params;

        this.state =({
            location : '',
            position : '',
            latitude : 12.9716,
            longitude : 77.5946,
            watchID : '',
            lastLocationLatitude : 12.9716,
            lastLocationLongitude : 77.5946,
        })
    }

    componentDidMount() {

        let geoOptions = {
            enableHighAccuracy: false,
            timeOut: 20000, //20 second  
            //  maximumAge: 1000 //1 second  
        };

        this.getCurrentLocation();

        this.checkPermission();
        // Register all listener for notification 
        this.createNotificationListeners();

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    }

    getCurrentLocation = () => {
        Geolocation.getCurrentPosition(info => 
          {
            console.log("info",info);
            this.setState({position : info.coords, latitude:info.coords.latitude, longitude: info.coords.longitude });   

            this.getUpdatedLocation();

           
          });
      
      }

      getUpdatedLocation = () => {
        this.watchID = Geolocation.watchPosition((position) => {
 
            const lastPosition = JSON.stringify(position);
            console.log("position",position);
            this.setState({lastLocationLatitude:position.coords.latitude, lastLocationLongitude: position.coords.longitude });

            this.distance(this.state.latitude,this.state.longitude, this.state.lastLocationLatitude,  this.state.lastLocationLongitude, 'M')
         });
      }
  

      distance = (lat1, lon1, lat2, lon2, unit) => {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        // if (unit=="K") { dist = dist * 1.609344 }
        // if (unit=="M") { dist = dist * 0.8684 }
        console.log('dist', dist)
        return dist
    }


    

    render() {
        return (

            <View style={styles.container}>

                <MapView
                    style={{ flex: 1, height: 500 }}
                    initialRegion={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05
                    }}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    zoomEnabled={true}>

                    <Marker
                        coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
                        pinColor="green"
                    />


                </MapView>

                <Button
        onPress={this.sendNotification}
        title="Send Notification"
        color="#4267B2"
      />

            </View>
        )
    }

  

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        //ToastAndroid.show('Back button is pressed', ToastAndroid.SHORT);
        Alert.alert(
            'Exit App',
            'Are you sure you want to exit?', [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => BackHandler.exitApp()
            }, ], {
                cancelable: false
            }
         )
         return true;
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
        console.log('FCM Token', fcmToken)
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

      sendNotification = async() => {

        let fcmToken = await AsyncStorage.getItem('fcmToken');
        console.log('FCM', fcmToken)
        if (!fcmToken) {
          fcmToken = await firebase.messaging().getToken();
          console.log("firebase", fcmToken)
          if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
            this.triggerNotification(fcmToken);
          }
        }else{
            this.triggerNotification(fcmToken);
        }

      }

    triggerNotification(token){
        console.log("data token", token);
        var data = {
          "to" : token,
          "collapse_key" : "type_a",
          "notification" : {
              "body" : "You are moved away from your place",
              "title": "Assignment"
          },
          "data" : {
            "body" : "You are moved away from your place",
            "title": "Assignment"
          }
         }

       console.log("data", data);

       fetch(Constants.FCM_SEND_API, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key='+Constants.FCM_SERVER_KEY
        },
        body: JSON.stringify(data)})
        .then((response) => response.json())
      .then((responseJson) => {
         console.log(responseJson);
        
      })
      .catch((error) => {
         console.error(error);
      });

        // Axios({
        //     method: 'post',
        //     url: Constants.FCM_SEND_API,
        //     data: data, //'userName='+username+'&password='+password,
        //     headers: {
        //       'Content-Type': 'application/json',
        //         'Authorization': 'key='+Constants.FCM_SERVER_KEY
        //     },
        //     validateStatus: (status) => {
        //        console.log('validateStatus', status);
        //       return true; // I'm always returning true, you may want to do it depending on the status received
        //     },
        //   }).catch(error => {
        //     console.log('error', error);
        //   //  this.setState({isLoading:false})
        //   }).then(response => {
        //     console.log('response', response);
        //   //  this.setState({isLoading:false})
        //     if(response.data && response.data.success=="true"){
        //         alert("successfully loggedin");
          
        //     }
        //   });
    }


}


const styles = StyleSheet.create({
    container :{
        flex:1
    }
})