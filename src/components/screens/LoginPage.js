import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert
} from 'react-native';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

export default class LoginPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email   : '',
      password: '',
      user_name: '',
      token: '',
      profile_pic: '',
    }
  }

  onClickListener = (viewId) => {
    if(viewId == 'login'){
        this.login();
    }else if(viewId == 'register'){
      this.props.navigation.navigate('Register')
    }else if(viewId=='test_component'){
      this.props.navigation.navigate('TestComponent')
    }
  }

  login = () =>{
    Alert.alert("Alert", "Login pressed "+  this.state.email + " - "+ this.state.password);
  }


  gulfLogin = () =>{
    this.props.navigation.navigate('GulfLogin')
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
    }
  };

  handleFacebookLogin = () =>{
    LoginManager.logInWithPermissions(['email']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Login cancelled')
        } else {
          console.log('Login success with permissions: ' + result.grantedPermissions.toString());

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
      },
      function (error) {
        console.log('Login fail with error: ' + error)
      }
    )
  }



  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          {/* <Image style={styles.inputIcon} source={require('../images/email.png')}/> */}
          <TextInput style={styles.inputs}
              placeholder="Email"
              keyboardType="email-address"
              underlineColorAndroid='transparent'
              onChangeText={(email) => this.setState({email})}/>
        </View>
        
        <View style={styles.inputContainer}>
          {/* <Image style={styles.inputIcon} source={require('../images/password.png')}/> */}
          <TextInput style={styles.inputs}
              placeholder="Password"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              onChangeText={(password) => this.setState({password})}/>
        </View>

        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onClickListener('login')}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableHighlight>


        <Button
        onPress={this.handleFacebookLogin}
        title="Continue with fb"
        color="#4267B2"
      />
       
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      width:250,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    color: 'white',
  }
});
 