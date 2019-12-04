import React, { Component } from "react";
import {
	View,
	Text,
	SafeAreaView,
	TouchableOpacity,
	Switch,
	Image,
	Alert,
	AsyncStorage
} from "react-native";

//Third party imports
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import Bubbles from "react-native-loader/src/Bubbles";

//Redux Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserDataAction from "../../actions/userDataActions";

//Reusable Components
import strings from "../../constants/LocalizedStrings";
import { Images } from "../../components/ImagesPath";
import styles from "./SettingsStyle";
import Header from "../../components/Header";
import { putApi } from "../../config/HitApis";
import { API_LOGOUT, API_SETTINGS } from "../../config/Urls";
import { checkInternetAvailibility } from "../../helper/CheckInternet";
import colors from "../../theme/colors";
import clearAsyncStorage from "../../helper/clearAsyncStorage";

class Settings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			isServiceProvider: false
		};
	}

	static navigationOptions = ({ navigation }) => {
		return {
			header: null
		};
	};

	componentDidMount() {
		console.log(this.props.userDataReducer.userData, "hte user data i get ");
		console.log(this.props.userDataReducer.userData.isServiceProvider, "the teset is test");
		this.setState({ isServiceProvider: this.props.userDataReducer.userData.isServiceProvider });
		checkInternetAvailibility();
	}

	_hitLogoutApi = () => {
		if (checkInternetAvailibility()) {
			this.setState({ isLoading: true });
			putApi(null, API_LOGOUT, null, this.props.userDataReducer.userData.accessToken, response =>
				this.logoutApiResponse(response)
			);
		} else alert("No Internet");
	};
	logoutModalToggle = () => {
		Alert.alert(strings.logout, strings.logoutConfirmationText, [
			{ text: strings.yes, onPress: this._hitLogoutApi },
			{ text: strings.no, style: "cancel" }
		]);
	};

	logoutApiResponse = response => {
		this.setState({ isLoading: false });
		if (response != null) {
			const statusCode = response.data.statusCode;
			if (statusCode == 200) {
				console.log(response, "hte respose i get");
				this.props.navigation.navigate("signOut");
				AsyncStorage.removeItem("userData");
				this.props.actions.clearReduxValues();
				return;
			} else if (statusCode == 401) {
				clearAsyncStorage();
				this.props.navigation.navigate("signOut");
				setTimeout(() => {
					this.props.actions.clearReduxValues();
					alert("Session Expired, please log in again to continue");
				}, 500);
				this.setState({ isLoading: false });
				return;
			} else {
				alert(response.data.message);
				return;
			}
			
		} else alert("Network Error");
	};

	headerBackPress = () => {
		this.props.navigation.goBack(null);
	};

	moveToNewScreen = id => () => {
		switch(id){
			case strings.contactUs:
				this.props.navigation.navigate("contactUs");
				return;
			case strings.expertise:{
				this.props.navigation.navigate("expertise");
				return;	
			}
			case strings.changePassword:{
				this.props.navigation.navigate("changePassword");
				return;	
			}
			case strings.serviceLocations:{
				this.props.navigation.navigate("serviceLocation");
				return;	
			}
		}
	};

	onToggleSwitch = value => {
		if (checkInternetAvailibility()) {
			this.setState({ isLoading: true });
			putApi(
				{ isServiceProvider: value },
				API_SETTINGS,
				null,
				this.props.userDataReducer.userData.accessToken,
				this.toggleWorkAsServiceProviderResponse
			);
		} else {
			alert("No Internet");
		}

		this.setState({ isServiceProvider: value });
	};

	toggleWorkAsServiceProviderResponse = response => {
		console.log(response, "the response i get from server is as follow");
		if (response) {
			const statusCode = response.data.statusCode;
			if (statusCode == 200 || statusCode == 201) {
				this.setState({ isLoading: false });

				Alert.alert("Success", "Changes updated successfully");
				// console.log(response.data.info._doc, "api data repsonse value");
				const isServiceProvider = response.data.info.isServiceProvider;
				AsyncStorage.getItem("userData").then(res => {
					const userData = JSON.parse(res);
					userData.isServiceProvider = isServiceProvider;
					AsyncStorage.setItem("userData", JSON.stringify(userData));
				});
				this.props.actions.updateWorkAsServiceProvider(isServiceProvider);
				// this.setState({ isLoading: false });
				return;
				// console.log(response, "the repsone from the server which i get is ");
			} else if (statusCode == 401) {
				this.setState({ isLoading: false });
				clearAsyncStorage();
				this.props.navigation.navigate("signOut");
				setTimeout(() => {
					this.props.actions.clearReduxValues();
					alert("Session Expired, please log in again to continue");
				}, 500);

				return;
			} else {
				this.setState({ isServiceProvider: !this.state.isServiceProvider });
				this.setState({ isLoading: false });
				alert(response.data.message);
				return;
			}
		} else {
			alert("Network Error");
		}
	};

	render() {
		const { isServiceProvider } = this.state;
		const { flexDirection, textAlign, userData } = this.props.userDataReducer;
		const Item = val => (
			<TouchableOpacity
				onPress={this.moveToNewScreen(val)}
				style={{ ...styles.itemContainer, flexDirection }}
			>
				<Text style={styles.itemText}>{val}</Text>
				<View style={styles.itemArrowContainer}>
					<Image style={{ tintColor: "rgba(0,0,0,0.60)" }} source={Images.arrowRight} />
				</View>
			</TouchableOpacity>
		);

		return (
			<SafeAreaView style={{ flex: 1 }}>
				<Header
					flexDirection={flexDirection}
					iconLeft={Images.back}
					onPressLeft={this.headerBackPress}
					title={strings.settings}
					iconRight={Images.small_logo}
				/>
				<View style={{ flex: 1, paddingHorizontal: scale(24), paddingTop: verticalScale(24) }}>
					{userData && userData.userType === "AGENCY" && (
						<View style={{ ...styles.itemContainer, flexDirection }}>
							<Text style={styles.itemText}>{strings.workAsServiceProvider}</Text>
							<View style={{ justifyContent: "center" }}>
								<Switch
									trackColor={{ true: colors.trackTrueColor, false: colors.trackFalseColor }}
									ios_backgroundColor={colors.trackFalseColor}
									thumbColor={isServiceProvider ? colors.tabsActiveColor :colors.white}
									value={isServiceProvider}
									onValueChange={this.onToggleSwitch}
								/>
							</View>
						</View>
					)}
					{Item(strings.expertise)}
					{Item(strings.changePassword)}
					{Item(strings.payments)}
					{isServiceProvider&&Item(strings.serviceLocations)}
					{Item(strings.faq)}
					{Item(strings.contactUs)}
					
					<TouchableOpacity
						activeOpacity={0.5}
						style={{ ...styles.itemContainer, flexDirection, borderBottomWidth: 0 }}
						onPress={this.logoutModalToggle}
					>
						<Text style={styles.itemText}>{strings.logout}</Text>
					</TouchableOpacity>
					{this.state.isLoading == true ? (
						<View style={styles.loader}>
							<Bubbles size={14} color={colors.tabsActiveColor} />
						</View>
					) : null}
				</View>
			</SafeAreaView>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		userDataReducer: state.userDataReducer
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(UserDataAction, dispatch)
	};
}
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Settings);
