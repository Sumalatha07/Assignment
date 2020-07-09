import React, { Component } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import { Constants } from "../utility/Constants";
import AsyncStorage from "@react-native-community/async-storage";
import { LoginButton } from "react-native-fbsdk";

export default class ProfilePage extends Component{

    constructor(props){
        super(props);
        this.state = {
            userName: '',
            id: '',
            profilePic: '',
          };

        this.getUserDetails();
    }


     getUserDetails = async() => {
        let userData =  await AsyncStorage.getItem(Constants.USER_DETAILS);
        if (userData) {
            userData = JSON.parse(userData);
            this.setState({userName:userData.name, id: userData.id, profilePic:userData.picture.data.url })
        }
      }

      onLogout = () => {
        AsyncStorage.removeItem(Constants.USER_DETAILS);
        this.props.navigation.navigate('FacebookLogin')
      };

    render(){
        return (
            <View style={styles.container}>
                {this.state.profilePic ? (
                    <Image
                        source={{ uri: this.state.profilePic }}
                        style={styles.imageStyle}
                    />
                ) : null}
                <Text style={styles.text}> {this.state.userName} </Text>
                <Text> {this.state.id} </Text>


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
              // AccessToken.getCurrentAccessToken().then(data => {
              //     console.log("datadaaa",data );
              //   alert(data.accessToken.toString());

              //   const processRequest = new GraphRequest(
              //     '/me?fields=name,picture.type(large)',
              //     null,
              //     this.get_Response_Info
              //   );
              //   // Start the graph request.
              //   new GraphRequestManager().addRequest(processRequest).start();
              // });
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