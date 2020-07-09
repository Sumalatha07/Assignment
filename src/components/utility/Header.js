import React, { Component } from "react";
import { Image, TouchableOpacity, View, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Constants } from "./Constants";

export default class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
        };

        this.getUserDetails();
    }

    openProfile = () => {
       this.props.navigation.navigate('Profile');
    }

    getUserDetails = async () => {
        let userData = await AsyncStorage.getItem(Constants.USER_DETAILS);
        if (userData) {         
            userData = JSON.parse(userData);
            this.setState({ userName: userData.name })
        }
    }


   
    render() {
        return (

            <View style={styles.container}>

                <Text>Hello {this.state.userName}</Text>


                <View style={[styles.container, styles.endItem]}>
                    <TouchableOpacity onPress={() => this.openProfile()}>
                        <Image
                            style={{ width: 30, height: 30 }}
                            source={require('../../resource/images/user_placeholder.png')}

                        />
                    </TouchableOpacity>
                </View>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
    endItem: {
        position: 'absolute',
        right: 0
    }
})