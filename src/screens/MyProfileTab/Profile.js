import React, { Component } from "react";

import {
	View,
	StatusBar,
	SafeAreaView,
	Image,
	Text,
	TouchableOpacity,
	AsyncStorage,
	TextInput,
	KeyboardAvoidingView,
	ScrollView,
	RefreshControl,
} from "react-native";

//Third party packages
import { verticalScale, moderateScale, scale } from "react-native-size-matters";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Bubbles from "react-native-loader/src/Bubbles";
import { StackActions } from "react-navigation";
import FastImage from "react-native-fast-image";
import moment from "moment";

//Redux Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserDataAction from "../../actions/userDataActions";


//Common components and helper methods
import styles from "./ProfileStyle";
import colors from "../../theme/colors";
import { Images } from "../../components/ImagesPath";
import { checkInternetAvailibility } from "../../helper/CheckInternet";
import strings from "../../constants/LocalizedStrings";
import { getApi } from '../../config/HitApis';
import clearAsyncStorage from "../../helper/clearAsyncStorage";
import { API_CREATE_POST, API_USER_PROFILE, API_LIKED_POSTS_LISTING, API_FAVORITED_POSTS_LISTING } from '../../config/Urls'
import commonStyles from "../../components/commonStyles";

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			refreshing: false,
			disable: false
		};
	}

	static navigationOptions = {
		header: null
	};

	componentDidMount() {
		checkInternetAvailibility();
		this.props.actions.setUserLang('en')
	}

	_onRefresh = () => {
		this.setState({ refreshing: true })
		if (checkInternetAvailibility()) {
			getApi(API_USER_PROFILE, this.props.userDataReducer.userData.accessToken, response => this.getUserProfileApiResponse(response));
		}
		else {
			this.setState({ refreshing: false })
			alert("No internet")
		}
	}

	getUserProfileApiResponse = (response) => {
		console.log(response, 'the response is required');
		this.setState({ refreshing: false })
		if (response) {
			const statusCode = response.data.statusCode;
			if (statusCode == 200 || statusCode == 201) {
				this.setState({ isLoading: false }, () => {
					const newUserData = {
						...this.props.userDataReducer.userData, ...response.data.info
					}
					this.props.actions.setUserData(newUserData);
					console.log('new data---->>>>>>  ' + JSON.stringify(response.data.info))
					AsyncStorage.setItem("userData", JSON.stringify(newUserData));
				});
			} else if (statusCode == 401) {
				clearAsyncStorage();
				this.props.navigation.navigate("signOut");
				setTimeout(() => {
					this.props.actions.clearReduxValues();
					alert("Session Expired, please log in again to continue");
				}, 500);
				this.setState({ isLoading: false, refreshing: false });
			} else {
				alert(response.data.message);
				this.setState({ isLoading: false });
			}
		} else {
			alert("Network Error");
		}
	}

	renderProfilePic() {
		if (
			this.props.userDataReducer.userData.profileImg.thumbnail === "" ||
			this.props.userDataReducer.userData.profileImg.thumbnail === "string"
		) {
			return <Image style={styles.profilePicStyle} source={Images.avatar} />;
		} else {
			return (
				<FastImage
					style={styles.profilePicStyle}
					source={{
						uri: this.props.userDataReducer.userData.profileImg.thumbnail,
						priority: FastImage.priority.high,
						cache: FastImage.priority.cacheOnly
					}}
					resizeMode={FastImage.resizeMode.cover}
				/>
			);
		}
	}

	moveToNewScreen = route => () => {
		this.props.navigation.navigate(route);
	}

	//***************Header contents**************** */
	renderContents() {
		let { flexDirection, appLang, textAlign, userData } = this.props.userDataReducer;
		let { currentTab } = this.state;
		const positionRightToggle = flexDirection == "row" ? "Right" : "Left";
		const positionLeftToggle = flexDirection == "row" ? "Left" : "Right";
		const user = this.props.userDataReducer.userData;
		console.log(user, "the user has a value");
		const dob = user.dob;
		return (
			<ScrollView style={styles.container}
				refreshControl={
					<RefreshControl
						refreshing={this.state.refreshing}
						onRefresh={this._onRefresh.bind(this)}
						colors={[colors.tabsActiveColor]}
					/>
				}
			>
				<View style={styles.container}>
					<TouchableOpacity
						activeOpacity={0.5}
						hitSlop={{ left: 10, right: 10, bottom: 10, top: 10 }}
						style={{
							alignSelf: appLang === "en" ? "flex-end" : "flex-start",
							marginHorizontal: moderateScale(18),
							marginTop: moderateScale(18)
						}}
						onPress={() => this.props.navigation.navigate("settings")}
					>
						<Image source={Images.settingsIcon} />
					</TouchableOpacity>
					<View style={{ height: verticalScale(26) }} />
					<View style={[styles.profilePicNameMainView, { flexDirection: flexDirection }]}>
						{userData.profileImg != undefined && this.renderProfilePic()}
						<View style={styles.nameEditProfileMainView}>
							<Text style={[styles.fullNameText, { textAlign: textAlign }]}>
								{this.props.userDataReducer.userData.fullName}
							</Text>
							<View style={{ height: verticalScale(11) }} />
							<TouchableOpacity onPress={() => this.props.navigation.navigate("editProfile")} activeOpacity={0.5}>
								<Text style={[styles.editProfileText, { textAlign: textAlign }]}>Edit Profile</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View style={{ height: verticalScale(15) }} />
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={this.moveToNewScreen("availability")}
						style={[
							styles.availableSlotContainer,
							{
								flexDirection: flexDirection,
								paddingLeft: appLang == "en" ? moderateScale(24) : moderateScale(20),
								paddingRight: appLang == "en" ? moderateScale(20) : moderateScale(24),
								borderTopColor: colors.semiCircle,
								borderTopWidth: moderateScale(1),
								paddingTop: moderateScale(16)
							}

						]}
					>
						<Text style={[styles.availableSlotText, { textAlign: textAlign }]}>Available Slot</Text>
						<Image
							style={{
								tintColor: colors.tabsActiveColor,
								transform: [{ scaleX: appLang == "en" ? 1 : -1 }]
							}}
							source={Images.arrowRight}
						/>
					</TouchableOpacity>
					<View style={{ height: verticalScale(16) }} />
					<View style={{ paddingHorizontal:moderateScale(24) }}>
						<View style={{ ...commonStyles.formContainer, borderBottomColor: "transparent" }}>
							<View style={{ flexDirection }}>
								<View
									style={{
										flex: 1,
										[`margin${positionRightToggle}`]: moderateScale(5),
										borderBottomColor: colors.textInputBottomBorder,
										borderBottomWidth: moderateScale(1)
									}}
								>
									<Text style={{ ...commonStyles.formText, textAlign }}>{strings.firstName}</Text>
									<TextInput
										selectionColor={colors.tabsActiveColor}
										value={user.firstName}
										editable={false}
										contextMenuHidden={true}
										//onChangeText={this._onChangeText("firstName")}
										style={{ ...commonStyles.formTextInput, textAlign }}
									/>
								</View>
								<View
									style={{
										flex: 1,
										[`margin${positionLeftToggle}`]: moderateScale(5),
										borderBottomColor: colors.textInputBottomBorder,
										borderBottomWidth: moderateScale(1)
									}}
								>
									<Text style={{ ...commonStyles.formText, textAlign }}>{strings.lastName}</Text>
									<TextInput
										selectionColor={colors.tabsActiveColor}
										value={user.lastName}
										editable={false}
										contextMenuHidden={true}
										//onChangeText={this._onChangeText("lastName")}
										style={{ ...commonStyles.formTextInput, textAlign }}
									/>
								</View>
							</View>
						</View>
						{userData.userType == "SALOON" && (
							<View style={commonStyles.formContainer}>
								<Text style={{ ...commonStyles.formText }}>{strings.salonName}</Text>
								<Text style={commonStyles.formTextInput}>{user.saloonName}</Text>
							</View>
						)}
						<View style={commonStyles.formContainer}>
							<Text style={{ ...commonStyles.formText }}>{strings.dateOfBirth}</Text>
							<Text style={commonStyles.formTextInput}>{moment(dob.fullDate).format('DD/MM/YYYY')}</Text>
						</View>
						<View style={commonStyles.formContainer}>
							<Text style={{ ...commonStyles.formText, textAlign }}>{strings.phoneNumber}</Text>
							<View style={{ flexDirection, alignItems: "center" }}>
								<View style={{ width: scale(85) }}>
									{/* <CountryPicker
										style={commonStyles.formCountryPicker}
										onChange={this.onCountryCodeChange}
										cca2={this.state.cca2}
										filterable
										autoFocusFilter={false}
										closeable={true}
									/> */}
									<View pointerEvents="none" style={{ width: scale(75), flexDirection }}>
										<Text
											pointerEvents="none"
											numberOfLines={1}
											ellipsizeMode="tail"
											style={commonStyles.formCountryCode}
										>
											({user.contactDetails.countryCode})
										</Text>
										<Image
											style={commonStyles.formCountryCodeArrow}
											source={Images.downFilledArrow}
										/>
									</View>
								</View>
								<View style={{ flex: 1 }}>
									<TextInput
										selectionColor={colors.tabsActiveColor}
										underlineColorAndroid="transparent"
										placeholder=""
										textContentType="telephoneNumber"
										contextMenuHidden={true}
										dataDetectorTypes="phoneNumber"
										keyboardType="number-pad"
										returnKeyType={"next"}
										value={user.contactDetails.phoneNo}
										editable={false}
										// onChangeText={this._onChangeText("phoneNumber")}
										style={{ ...commonStyles.formTextInput, textAlign }}
									/>
								</View>
							</View>
						</View>
						<View style={commonStyles.formContainer}>
							<Text style={{ ...commonStyles.formText }}>{strings.address}</Text>
							<Text style={commonStyles.formTextInput}>{user.addressDetails.address}</Text>
						</View>

						<View style={commonStyles.formContainer}>
							<Text style={{ ...commonStyles.formText }}>{strings.postalZipCode}</Text>
							<Text style={commonStyles.formTextInput}>{user.addressDetails.postalCode}</Text>
						</View>
						<View style={commonStyles.formContainer}>
							<Text style={{ ...commonStyles.formText }}>{strings.country}</Text>
							<Text style={commonStyles.formTextInput}>{user.addressDetails.country}</Text>
						</View>
						{this.state.isLoading == true ? (
							<View style={styles.loader}>
								<Bubbles size={14} color={colors.tabsActiveColor} />
							</View>
						) : null}
					</View>
				</View>
			</ScrollView>
		);
	}

	render() {
		let { appLang, userData } = this.props.userDataReducer;
		console.log(userData, 'the user DAta reducxer');

		return (
			<SafeAreaView style={{ flex: 1 }}>
				<StatusBar backgroundColor={colors.black} barStyle="default" />
				{this.renderContents()}
				{appLang === "en" ? (
					<TouchableOpacity
						style={{
							zIndex: 1,
							position: "absolute",
							bottom: moderateScale(16),
							right: moderateScale(16)
						}}
						activeOpacity={0.5}
						onPress={() => this.props.navigation.navigate("profileChooseYourCategoryScreen")}
					>
						<Image source={Images.greenRoundPlusIcon} />
					</TouchableOpacity>
				) : (
						<TouchableOpacity
							style={{ position: "absolute", bottom: moderateScale(16), left: moderateScale(16) }}
							activeOpacity={0.5}
							onPress={() => this.props.navigation.navigate("profileChooseYourCategoryScreen")}
						>
							<Image source={Images.greenRoundPlusIcon} />
						</TouchableOpacity>
					)}
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
)(Profile);
