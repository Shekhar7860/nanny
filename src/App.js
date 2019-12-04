import React, { Component } from "react";
import { View, Platform } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
//Third party packages
import SplashScreen from "react-native-splash-screen";
//import { Sentry } from 'react-native-sentry';
//import firebase from 'react-native-firebase';

//import io from "socket.io-client";
import { API_SOCKET_CONNECTION, API_BOOKING_LISTING } from "./config/Urls";
//Redux imports
import { Provider } from "react-redux";
import store from "./store/store";

//App container contains all the screens setup through react navigation
import { AppContainer } from "./router";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      signIn: false,
      userType: "AGENCY",
      token: ""
    };
    this.socket;
  }

  componentDidMount() {
    this.authCheck()
    AsyncStorage.clear()
  }
  getSocket = () => {
		return this.socket;
	};
	socketConnection = accessToken => {
		// alert(accessToken);
		// this.socket=io(`${API_BOOKING_LISTING}?accessToken=${accessToken}`);
		this.socket = io(`${API_SOCKET_CONNECTION}?accessToken=${accessToken}`);
		return this.socket;
		
	};

  authCheck = () => {
    AsyncStorage.getItem("userData").then(
      keyValue => {
        const userData = JSON.parse(keyValue);
        if (userData != null) {
          console.log(userData, "the userData value");
          this.setState({ signIn: true, userType: userData.userType, token: userData.accessToken });
          this.socketConnection(userData.accessToken);
        } else {
          this.setState({ signIn: false });
        }
      },
      error => {
        console.log(error);
      }
    );
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  };
  render() {
    const { signIn,userType } = this.state;
    const AppRouter = AppContainer(signIn,userType);
    return (
      <Provider store={store}>
      {this.state.signIn === null ? (
        <View />
      ) : (
        <AppRouter
          screenProps={{
            socketConnection: token => this.socketConnection(token),
            getSocket: this.getSocket
          }}
        />
      )}
    </Provider>
    );
  }
}
