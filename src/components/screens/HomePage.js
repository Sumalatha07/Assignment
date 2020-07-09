import React,{ Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LoginButton, AccessToken, GraphRequestManager, GraphRequest } from "react-native-fbsdk";
import AsyncStorage from '@react-native-community/async-storage';
import { Constants } from "../utility/Constants";

export default class HomePage extends Component{

    constructor(props){
        super(props);
        this.state = {
            user_name: '',
            token: '',
            profile_pic: '',
          };
    }

    get_Response_Info = (error, result) => {
        console.log("get_Response_Info, ", error)
        console.log("get_Response_Info,12 ", result)
        if (error) {
          //Alert for the Error
          Alert.alert('Error fetching data: ' + error.toString());
        } else {
          //response alert
          alert(JSON.stringify(result));
          this.setState({ user_name: 'Welcome' + ' ' + result.name });
          this.setState({ token: 'User Token: ' + ' ' + result.id });
          this.setState({ profile_pic: result.picture.data.url });

          AsyncStorage.setItem(Constants.USER_DETAILS, JSON.stringify(result));

          this.props.navigation.navigate('UserLocation', {user_name :result.name, profile_pic: result.picture.data.url  })

        }
      };


      onLogout = () => {
        //Clear the state after logout
        this.setState({ user_name: null, token: null, profile_pic: null });
      };


    render(){
        return(
            <View style={styles.container}>
        {this.state.profile_pic ? (
          <Image
            source={{ uri: this.state.profile_pic }}
            style={styles.imageStyle}
          />
        ) : null}
        <Text style={styles.text}> {this.state.user_name} </Text>
        <Text> {this.state.token} </Text>
        <LoginButton
          permissions={["email", "public_profile"]}
          publishPermissions={["email", "public_profile"]}
          readPermissions={["email", "public_profile"]}
          onLoginFinished={(error, result) => {
            if (error) {
              alert(error);
              alert('login has error: ' + result.error);
            } else if (result.isCancelled) {
              alert('login is cancelled.');
            } else {
              AccessToken.getCurrentAccessToken().then(data => {
                  console.log("datadaaa",data );
                alert(data.accessToken.toString());

                const processRequest = new GraphRequest(
                  '/me?fields=name,picture.type(large)',
                  null,
                  this.get_Response_Info
                );
                // Start the graph request.
                new GraphRequestManager().addRequest(processRequest).start();
              });
            }
          }}
          onLogoutFinished={this.onLogout}
        />
      </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
    text: {
      fontSize: 20,
      color: '#000',
      textAlign: 'center',
      padding: 20,
    },
    imageStyle: {
      width: 200,
      height: 300,
      resizeMode: 'contain',
    },
  });