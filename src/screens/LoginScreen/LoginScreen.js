import React, { Component } from "react";

import {
	View,
	StatusBar,
	SafeAreaView,
	Image,
	Text,
	TouchableOpacity,
	TextInput,
	KeyboardAvoidingView,
	ScrollView,
	ImageBackground
} from "react-native";

//Third party packages
import { Bubbles } from "react-native-loader";
import AsyncStorage from '@react-native-community/async-storage';
import { verticalScale, moderateScale, scale } from "react-native-size-matters";
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const countryCodes = require("awesome-phonenumber");

//Redux Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserDataAction from "../../actions/userDataActions";

//Common components and helper methods
import styles from "./LoginScreenStyle";
import { Images } from "../../components/ImagesPath";
import strings from "../../constants/LocalizedStrings";
import colors from "../../theme/colors";
import { checkInternetAvailibility } from "../../helper/CheckInternet";
import { validateEmailId, isNumber } from "../../helper/Validations";
import { postApi } from "../../config/HitApis";
import { API_LOGIN } from "../../config/Urls";

class WelcomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			emailPhoneNumber: "",
			password: "",
			isLoginSelected: true,
			showPassword: true,
			crossIcon: false
		};
	}

	static navigationOptions = {
		header: null
	};

	componentDidMount() {
		checkInternetAvailibility();
	}

	_checkValidations = () => {
		if (!isNumber(this.state.emailPhoneNumber) && !this.state.emailPhoneNumber.includes("+")) {
			if (this.state.emailPhoneNumber == null || this.state.emailPhoneNumber.trim().length == 0) {
				alert("Please enter email id or phone number");
			} else if (!validateEmailId(this.state.emailPhoneNumber)) {
				alert("Please enter valid email id");
			} else if (this.state.password.trim().length == 0) {
				alert("Please enter password");
			} else {
				if (checkInternetAvailibility()) {
					this.setState({ isLoading: true });

					// AsyncStorage.getItem('deviceToken').then((keyValue) => {
					//     console.warn('tok '+JSON.parse(keyValue))
					//     var value = JSON.parse(keyValue)
					//     this._hitLoginApi(value)
					// }, (error) => {
					//     console.log(error)
					// });
					const registerData = {
						email: this.state.emailPhoneNumber,
						password: this.state.password,
						deviceToken: "dfd54dffddfr45",
						offset: 0
					};
					postApi(registerData, API_LOGIN, null, response => this.loginApiResponse(response));
				} else alert("No Internet");
			}
		} else {
			if (this.state.emailPhoneNumber == null || this.state.emailPhoneNumber.trim().length == 0) {
				alert("Please enter email id or phone number");
			} else if (
				this.state.emailPhoneNumber.trim().length < 5 ||
				this.state.emailPhoneNumber.trim().length > 15
			) {
				alert("Please enter valid phone number");
			} else if (this.state.password.trim().length == 0) {
				alert("Please enter password");
			} else {
				if (checkInternetAvailibility()) {
					this.setState({ isLoading: true });
					let parsedNo = phoneUtil.parse(this.state.emailPhoneNumber, countryCodes.getRegionCodeForCountryCode('91'));
					let countryCode = parsedNo.values_["1"]
					let phoneNo = parsedNo.values_["2"]
					// AsyncStorage.getItem('deviceToken').then((keyValue) => {
					//     console.warn('tok '+JSON.parse(keyValue))
					//     var value = JSON.parse(keyValue)
					//     this._hitLoginApi(value)
					// }, (error) => {
					//     console.log(error)
					// });
					const registerData = {
						password: this.state.password,
						contactDetails: {
							phoneNo: "" + phoneNo,
							countryCode: "+" + countryCode,
							countryCodeISO: "" + countryCodes.getRegionCodeForCountryCode(countryCode)
						},
						deviceToken: "lfjslflfjljfls7868f6",
						offset: 0
					};
					console.warn(registerData)
					postApi(registerData, API_LOGIN, "", response => this.loginApiResponse(response));
				} else alert("No Internet");
			}
		}
	};

	loginApiResponse = response => {
		//console.log(response, "the response");
		debugger
		this.setState({ isLoading: false });
		if (response != null) {
			if (response.data.statusCode == 200 || response.data.statusCode == 201) {
				const info = response.data.info;
				// console.log(info,'the infor value');
				// console.warn(info.isEmailVerified, info.isPhoneNoVerified)
				if (!info.isPhoneNoVerified && info.isEmailVerified) {
					this.props.navigation.navigate("phoneNumberVerification", {
						accessToken: info.accessToken,
						contactDetails: info.contactDetails,
						//userType:info.userType
					});
				} else if (!info.isEmailVerified && !info.isPhoneNoVerified) {
					alert("Please Verify your Email-Id and Phone Number");
				} else if (info.isEmailVerified && info.isPhoneNoVerified) {

					//this.props.navigation.getScreenProps().socketConnection(info.accessToken);
					AsyncStorage.setItem("userData", JSON.stringify(info));
					//this.props.actions.setUserData(info)
					if (info.userType === "AGENCY") {
						this.props.navigation.navigate("tabbarNavigation");
					} else {
						this.props.navigation.navigate("tabbarNavigationWithoutMember");
					}
					
					// this.props.navigation.navigate("tabBar");

					// setTimeout(() => {
					//     alert(response.data.message)
					// }, 600);
				}
			} else {
				setTimeout(() => {
					alert(response.data.message);
				}, 600);
			}
		} else alert("Network Error");
	};

	_showHidePassword = () => {
		this.setState({ showPassword: !this.state.showPassword });
		this.setState({ crossIcon: !this.state.crossIcon });
	};

	renderContents() {
		return (
			<ScrollView style={{ flex: 1, backgroundColor: colors.white }}>
				<KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.white }} enabled={true}>
					{/* <Image style={styles.topCornerImage} source={Images.topCornerRegister} /> */}
					<View>
						{/* <View style={{ height: verticalScale(40) }} /> */}
						{/* <Image style={{ marginLeft: 12 }} source={Images.novoIconLogo} /> */}
						<ImageBackground source={{ uri: "https://apopka-1x1yusplq.stackpathdns.com/wp-content/uploads/2019/07/bg_new-1024x572.jpg" }} style={styles.imageBackground}>
							<Text style={styles.loginTextBold}>{strings.login}</Text>
						</ImageBackground>
						{/* <View style={{ height: verticalScale(16) }} /> */}
						{/* <View style={{ marginLeft: moderateScale(23) }}>
							<Text style={styles.loginTextBold}>{strings.login}</Text>
							<View style={{ height: verticalScale(9) }} />
							<View style={styles.selectedLine} />
						</View> */}
						<View style={{ height: verticalScale(44) }} />
						<View style={styles.inputMainView}>
							<Text style={styles.inputLabel}>{strings.emailPhoneNumber}</Text>
							<TextInput
								selectionColor={colors.tabsActiveColor}
								style={styles.textInputStyle}
								underlineColorAndroid="transparent"
								placeholder=""
								autoCapitalize="none"
								keyboardType="email-address"
								returnKeyType={"next"}
								onChangeText={emailPhoneNumber => this.setState({ emailPhoneNumber })}
								onSubmitEditing={() => this.password.focus()}
								value={this.state.emailPhoneNumber}
							/>
							<View style={styles.inputLine} />
						</View>
						<View style={{ height: verticalScale(28) }} />
						<View style={styles.inputMainView}>
							<Text style={styles.inputLabel}>{strings.password}</Text>
							<View>
								<TextInput
									selectionColor={colors.tabsActiveColor}
									style={styles.textInputStyle}
									ref={password => (this.password = password)}
									underlineColorAndroid="transparent"
									placeholder=""
									autoCapitalize="none"
									keyboardType="default"
									secureTextEntry={this.state.showPassword}
									returnKeyType={"done"}
									onChangeText={password => this.setState({ password })}
									value={this.state.password}
								/>
								{this.state.crossIcon == false ? (
									<TouchableOpacity
										activeOpacity={0.5}
										style={styles.visibilityIconStyle}
										hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}
										onPress={() => this._showHidePassword()}
									>
										<Image source={Images.visibilityIconLogin} />
									</TouchableOpacity>
								) : (
										<TouchableOpacity
											activeOpacity={0.5}
											style={styles.visibilityIconStyle}
											hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}
											onPress={() => this._showHidePassword()}
										>
											<Image source={Images.visibilityHideIconLogin} />
										</TouchableOpacity>
									)}
							</View>
							<View style={styles.inputLine} />
						</View>
						<View style={{ height: verticalScale(24) }} />
						<TouchableOpacity
							activeOpacity={0.5}
							hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}
							style={{ alignSelf: "flex-end" }}
							onPress={() => this.props.navigation.navigate("forgotPassword")}
						>
							<Text style={styles.forgotPassword}>{strings.forgotPassword}?</Text>
						</TouchableOpacity>
						<View style={{ height: verticalScale(40) }} />
						<TouchableOpacity style={styles.loginButton} onPress={() => this._checkValidations()}>
							<Text style={styles.loginButtonText}>{strings.login}</Text>
						</TouchableOpacity>
						<View style={{ height: verticalScale(72) }} />
						<Text style={styles.bottomText}>
							{strings.notAMember}{" "}
							<Text
								style={styles.bottomGreenText}
								onPress={() => this.props.navigation.navigate("chooseAccountType")}
							>
								{strings.joinNow}
							</Text>
							<Text style={{ color: colors.black }}>.</Text>
						</Text>
						{this.state.isLoading == true ? (
							<View style={styles.loader}>
								<Bubbles size={14} color={colors.tabsActiveColor} />
							</View>
						) : null}
					</View>
				</KeyboardAvoidingView>
			</ScrollView>
		);
	}

	render() {
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<StatusBar barStyle="default" />
				{this.renderContents()}
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
)(WelcomeScreen);
