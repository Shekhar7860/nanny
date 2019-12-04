import React, { Component } from "react";
import {
	View,
	Text,
	SafeAreaView,
	TextInput,
	Image,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Platform
} from "react-native";

//Third party packages
import CountryPicker from "react-native-country-picker-modal";
import { moderateScale, verticalScale, scale, ScaledSheet } from "react-native-size-matters";
import Bubbles from "react-native-loader/src/Bubbles";
import _ from "lodash";
import { withNavigationFocus } from "react-navigation";
import DatePicker from "react-native-datepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

//Redux Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserDataAction from "../../actions/userDataActions";

//Common components and helper methods

import { fontNames } from "../../theme/fontFamily";
import colors from "../../theme/colors";
import { checkInternetAvailibility } from "../../helper/CheckInternet";
import strings from "../../constants/LocalizedStrings";
import { postApi, getApi } from "../../config/HitApis";
import { API_REGISTER, API_MEMBERS } from "../../config/Urls";
import Header from "../../components/Header";
import { Images } from "../../components/ImagesPath";
import { validateEmailId, isNumber } from "../../helper/Validations";
import commonStyles from "../../components/commonStyles";
import styles from "./AddMemberStyle";
import clearAsyncStorage from "../../helper/clearAsyncStorage";


var today = new Date();
var date =`${(today.getFullYear() - 18)}-${parseInt(today.getMonth() + 1) < 10 ? "0" + parseInt(today.getMonth() + 1) : parseInt(today.getMonth() + 1)}-${today.getDate() < 10 ? "0" + today.getDate() : today.getDate()}`;

class AddMember extends Component {
	state = {
		selectedCountryCode: "+961",
		selectedCountry: "",
		cca2: "LB",
		firstName: "",
		lastName: "",
		phoneNumber: "",
		date: date,
		postalZipCode: "",
		latitude: "",
		longitude: "",
		address: "",
		email: "",
		isLoading: false
	};

	_onChangeText = id => val => {
		if (id == "postalZipCode") {
			val = val.replace(/[^0-9A-Za-z]/g, "")
		}
		if (id == "phoneNumber") {
			if(val.charAt(0)=="0"){
				val=""
			}else{
				val = val.replace(/[^0-9]/g, '')
			}
		}
		this.setState({ [id]: val });
	};

	onCountryCodeChange = value => {
		console.log(value, "the value selected");
		this.setState({
			cca2: value.cca2,
			selectedCountryCode: "+" + value.callingCode
		});
	};

	onCountryChange = value => {
		this.setState({
			selectedCountry: value.name
		});
	};

	expertiseTextValue = () => {
		let expertiseText = "";
		const expertiseList = this.props.userDataReducer.expertiseList;
		let i = 0;
		expertiseList.forEach((element, index) => {
			if (element.isSelected) {
				i = i + 1;
				expertiseText = expertiseText + `${element.serviceCategoryId.name}, `;
			}
		});

		return expertiseText.substr(0, expertiseText.length - 2);
	};

	onAddMember = () => {
		const expertiseList = this.props.userDataReducer.expertiseList;
		const selectedExpertiseIdArray = [];
		expertiseList.forEach(element => {
			if (element.isSelected) {
				selectedExpertiseIdArray.push(element.serviceCategoryId._id);
			}
			return element.isSelected === true;
		});
		console.log(selectedExpertiseIdArray, "the id arra");

		if (this.state.firstName == null || this.state.firstName.trim().length == 0) {
			alert("Please enter first name");
		} else if (this.state.lastName == null || this.state.lastName.trim().length == 0) {
			alert("Please enter last name");
		} else if (this.state.selectedCountryCode == "Select") {
			alert("Please select country code");
		} else if (this.state.phoneNumber == null || this.state.phoneNumber.trim().length == 0) {
			alert("Please enter phone number");
		} else if (this.state.phoneNumber.length < 5 || this.state.phoneNumber.length > 15) {
			alert("The phone number must be 5-15 digits");
		} else if (this.state.email == null || this.state.email.trim().length == 0) {
			alert("Please enter email id");
		} else if (!validateEmailId(this.state.email)) {
			alert("Please enter valid email id");
		} else if (this.state.address == null || this.state.address.trim().length == 0) {
			alert("Please enter an address");
		} else if (this.state.postalZipCode == null || this.state.postalZipCode.trim().length == 0) {
			alert("Please enter postal or zip code");
		} else if (this.state.postalZipCode.trim().length < 3) {
			alert("Please enter valid postal or zip code");
		} else if (this.state.date === new Date().toISOString().split("T")[0]) {
			alert("Please enter valid DOB");
		} else if (selectedExpertiseIdArray.length < 1) {
			alert("Please select expertise");
		} else {
			const addMemberData = {
				firstName: this.state.firstName,
				lastName: this.state.lastName,
				email: this.state.email,
				dob: this.state.date,
				contactDetails: {
					phoneNo: this.state.phoneNumber,
					countryCode: this.state.selectedCountryCode,
					countryCodeISO: this.state.cca2
				},
				addressDetails: {
					address: this.state.address,
					postalCode: this.state.postalZipCode,
					country: this.state.selectedCountry,
					coordinates: [this.state.longitude, this.state.latitude]
				},
				services: selectedExpertiseIdArray,
				registerFrom: Platform.OS.toUpperCase()
			};
			console.log(this.props.userDataReducer.userData.accessToken, "the accessToken");
			this.setState({ isLoading: true });
			postApi(
				addMemberData,
				API_MEMBERS,
				this.props.userDataReducer.userData.accessToken,
				this.addMemberResponse
			);
			console.log(addMemberData, "hte addMeberdata");
		}
	};
	addMemberResponse = response => {
		if (response) {
			const statusCode = response.data.statusCode;
			if (statusCode == 200 || statusCode == 201) {
				this.getMembersApiHit(API_MEMBERS);
				this.props.actions.updateExpertiseList([]);
				return;
			} else if (statusCode == 401) {
				clearAsyncStorage();
				this.props.navigation.navigate("signOut");
				setTimeout(() => {
					this.props.actions.clearReduxValues();
					alert("Session Expired, please log in again to continue");
				}, 500);
			} else {
				alert(response.data.message);
			}
			this.setState({ isLoading: false });
			return;
		}
		alert("Network Error");
		this.setState({ isLoading: false });
		this.setState({ isLoading: false });
		console.log(response, "the reposene i get from server");
	};

	getMembersResponse = response => {
		if (response) {
			const statusCode = response.data.statusCode;
			if (statusCode == 200 || statusCode == 201) {
				this.props.actions.updateMembersList(response.data.info.records);
				this.setState({ isLoading: false }, () => {
					this.props.navigation.goBack(null);
				});
				return;
			} else if (statusCode == 401) {
				clearAsyncStorage();
				this.props.navigation.navigate("signOut");
				setTimeout(() => {
					this.props.actions.clearReduxValues();
					alert("Session Expired, please log in again to continue");
				}, 500);
			} else {
				alert(response.data.message);
			}
			this.setState({ isLoading: false });
			return;
		}
		alert("Network Error");
		this.setState({ isLoading: false });
	};

	getMembersApiHit = url => {
		console.log(url, "hte urlv value");
		if (checkInternetAvailibility()) {
			this.setState({ isLoading: true });
			getApi(url, this.props.userDataReducer.userData.accessToken, this.getMembersResponse);
			return;
		}
		return;
	};

	onHeaderBackPress=()=>{
		this.props.actions.updateExpertiseList([]);
		this.props.navigation.goBack(null)
	}
	render() {
		const { phoneNumber, email, postalZipCode, firstName, lastName } = this.state;
		const { flexDirection, textAlign } = this.props.userDataReducer;
		const positionRightToggle = flexDirection == "row" ? "Right" : "Left";
		const positionLeftToggle = flexDirection == "row" ? "Left" : "Right";
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<Header
					onPressRight={this.onHeaderBackPress}
					title="Add Member"
					iconLeft={Images.small_logo}
					flexDirection={flexDirection}
					iconRight={Images.crossB}
				/>
				<KeyboardAwareScrollView keyboardShouldPersistTaps="always" style={{ flex: 1 }}>
					<ScrollView keyboardShouldPersistTaps="always" style={{ flex: 1 }}>
						<View style={{ padding: moderateScale(24), paddingTop: moderateScale(38) }}>
							<View style={{ ...styles.itemContainer, borderBottomColor: "transparent" }}>
								<View style={{ flexDirection }}>
									<View
										style={{
											flex: 1,
											[`margin${positionRightToggle}`]: moderateScale(5),
											borderBottomColor: colors.textInputBottomBorder,
											borderBottomWidth: moderateScale(1)
										}}
									>
										<Text style={{ ...styles.itemText, textAlign }}>{strings.firstName}</Text>
										<TextInput
										  selectionColor={colors.tabsActiveColor}
											value={firstName}
											onChangeText={this._onChangeText("firstName")}
											style={{ ...styles.itemTextInput, textAlign }}
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
										<Text style={{ ...styles.itemText, textAlign }}>{strings.lastName}</Text>
										<TextInput
										  selectionColor={colors.tabsActiveColor}
											value={lastName}
											onChangeText={this._onChangeText("lastName")}
											style={{ ...styles.itemTextInput, textAlign }}
										/>
									</View>
								</View>
							</View>
							<View style={styles.itemContainer}>
								<Text style={{ ...styles.itemText, textAlign }}>{strings.dateOfBirth}</Text>
								<DatePicker
									style={styles.dateView}
									date={this.state.date}
									mode="date"
									placeholder={this.state.dateOfBirth}
									format="YYYY-MM-DD"
									confirmBtnText="Confirm"
									cancelBtnText="Cancel"
									maxDate={new Date()}
									iconSource={Images.downArrow}
									accentColor={colors.tabsActiveColor}
									customStyles={{
										dateIcon: styles.dateIcon,
										dateInput: styles.dateInput,
										btnTextConfirm: {
											color: colors.tabsActiveColor,
										},
										btnTextCancel: {
											color: colors.tabsActiveColor,
										},
										dateText: {
											...styles.dateText,
											alignSelf: flexDirection === "row" ? "flex-start" : "flex-end"
										},
										dateTouchBody: { flexDirection }
									}}
									onDateChange={date => {
										this.setState({ date: date });
									}}
								/>
							</View>
							<View style={styles.itemContainer}>
								<Text style={{ ...styles.itemText, textAlign }}>{strings.phoneNumber}</Text>
								<View style={{ flexDirection, alignItems: "center" }}>
									<View style={{ width: scale(85) }}>
										<CountryPicker
											style={styles.countryPicker}
											onChange={this.onCountryCodeChange}
											cca2={this.state.cca2}
											filterable
											autoFocusFilter={false}
											closeable={true}
										/>
										<View
											pointerEvents="none"
											style={{ ...styles.countryCodeContiner, flexDirection }}
										>
											<Text
												pointerEvents="none"
												numberOfLines={1}
												ellipsizeMode="tail"
												style={styles.countryCode}
											>
												({this.state.selectedCountryCode})
											</Text>
											<Image style={styles.countryCodeArrow} source={Images.downFilledArrow} />
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
											value={phoneNumber}
											onChangeText={this._onChangeText("phoneNumber")}
											style={{ ...styles.itemTextInput, textAlign }}
										/>
									</View>
								</View>
							</View>
							<View style={styles.itemContainer}>
								<Text style={{ ...styles.itemText, textAlign }}>{strings.email}</Text>
								<TextInput
								  selectionColor={colors.tabsActiveColor}
									value={email}
									onChangeText={this._onChangeText("email")}
									style={{ ...styles.itemTextInput, textAlign }}
								/>
							</View>

							<View style={styles.itemContainer}>
								<Text style={{ ...styles.itemText, textAlign }}>{strings.address}</Text>
								<GooglePlacesAutocomplete
									placeholder=""
									minLength={2}
									autoFocus={false}
									returnKeyType={"default"}
									fetchDetails={true}
									listViewDisplayed={false}
									styles={{
										textInputContainer: {
											backgroundColor: "rgba(0,0,0,0)",
											borderTopWidth: 0,
											borderBottomWidth: 0
										},
										textInput: {
											paddingLeft: 0,
											marginLeft: 0,
											width: "100%",
											marginRight: 0,
											textAlign,
											fontFamily: fontNames.regularFont
										},
										predefinedPlacesDescription: {
											color: "#1faadb"
										}
									}}
									onPress={(data, details = null) => {
										const countryObj = _.find(details.address_components, val => {
											return _.includes(val.types, "country");
										});
										// 'details' is provided when fetchDetails = true
										this.setState({
											latitude: details.geometry.location.lat,
											longitude: details.geometry.location.lng,
											address: data.description,
											selectedCountry: countryObj.long_name
										});
										console.log(data);
									}}
									textInputProps={{
										onChangeText: val => {
											if (val === "") {
												this.setState({ address: "", selectCountry: "" });
											}
										}
									}}
									currentLocation={false}
									nearbyPlacesAPI="GooglePlacesSearch"
									query={{
										// available options: https://developers.google.com/places/web-service/autocomplete
										key: "AIzaSyD0nhmGVsfQ3JwVaJeSa-yRKovdzMrEvwM",
										language: "en" // language of the results
										//types: "(cities)" // default: 'geocode'
									}}
								/>
							</View>

							<View style={styles.itemContainer}>
								<Text style={{ ...styles.itemText, textAlign }}>{strings.postalZipCode}</Text>
								<TextInput
								  selectionColor={colors.tabsActiveColor}
									textContentType="telephoneNumber"
									contextMenuHidden={true}
									dataDetectorTypes="phoneNumber"
									value={postalZipCode}
									onChangeText={this._onChangeText("postalZipCode")}
									style={{ ...styles.itemTextInput, textAlign }}
									returnKeyType={"next"}
								/>
							</View>
							<View style={styles.itemContainer}>
								<Text style={{ ...styles.itemText, textAlign }}>{strings.selectCountry}</Text>
								<Text style={{ ...styles.itemTextInput, textAlign }}>
									{this.state.selectedCountry}
								</Text>
							</View>

							<View style={styles.itemContainer}>
								<Text style={{ ...styles.itemText, textAlign }}>{strings.addExpertise}</Text>
								<TouchableOpacity
									onPress={() => this.props.navigation.navigate("addExpertise")}
									style={{ ...styles.expertSelect, flexDirection }}
								>
									<Text>{this.expertiseTextValue()}</Text>
									<Image
										style={{
											transform: [{ scaleX: flexDirection === "row" ? 1 : -1 }],
											tintColor: colors.arrowColor
										}}
										source={Images.arrowRight}
									/>
								</TouchableOpacity>
							</View>

							<TouchableOpacity onPress={this.onAddMember} style={styles.bottomButton}>
								<Text style={styles.bottomButtonText}>{strings.add}</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</KeyboardAwareScrollView>
				{this.state.isLoading ? (
					<View style={commonStyles.loader}>
						<Bubbles size={14} color={colors.tabsActiveColor} />
					</View>
				) : null}
			</SafeAreaView>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(UserDataAction, dispatch)
	};
}
export default connect(
	state => state,
	mapDispatchToProps
)(withNavigationFocus(AddMember));
