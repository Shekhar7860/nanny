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
	Platform,
	Alert,
	Dimensions,
	PermissionsAndroid
} from "react-native";

//Third party packages
import { verticalScale, moderateScale, scale } from "react-native-size-matters";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Bubbles from "react-native-loader/src/Bubbles";
import { StackActions } from "react-navigation";
import FastImage from "react-native-fast-image";
import DatePicker from "react-native-datepicker";
import CountryPicker from "react-native-country-picker-modal";
import CropPicker from "react-native-image-crop-picker";
import _ from "lodash";

//Redux Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserDataAction from "../../actions/userDataActions";

//Common components and helper methods
import styles from "./EditProfileStyle";
import colors from "../../theme/colors";
import { Images } from "../../components/ImagesPath";
import { checkInternetAvailibility } from "../../helper/CheckInternet";
import strings from "../../constants/LocalizedStrings";
import { postApi, getApi, putApi } from "../../config/HitApis";
import { API_STYLIST_PROFILE, API_UPLOAD_FILE } from "../../config/Urls";

import Header from "../../components/Header";
import commonStyles from "../../components/commonStyles";
import { fontNames } from "../../theme/fontFamily";

import { validateEmailId, isNumber } from "../../helper/Validations";
import clearAsyncStorage from "../../helper/clearAsyncStorage";

class EditProfile extends Component {
	state = {
		firstName: "",
		lastName: "",
		cca2: "",
		phoneNumber: "",
		selectedCountryCode: "+1",
		country: "",
		postalZipCode: "",
		address: "",
		date: "",
		latitude: "",
		longitude: "",
		countryCodeISO: "",
		isLoading: false,
		newImg: {},
		profileImg: {},
		showImg: "",
		agencyName: ""
	};

	componentDidMount() {
		checkInternetAvailibility();
		const user = this.props.userDataReducer.userData;
		console.log(user, "the user has a value");
		const dob = user.dob;

		this.setState({
			firstName: user.firstName,
			lastName: user.lastName,
			phoneNumber: user.contactDetails.phoneNo,
			date: dob.fullDate,
			address: user.addressDetails.address,
			postalZipCode: user.addressDetails.postalCode,
			latitude: user.addressDetails.coordinates[0],
			longitude: user.addressDetails.coordinates[1],
			country: user.addressDetails.country,
			selectedCountryCode: user.contactDetails.countryCode,
			countryCodeISO: user.contactDetails.countryCodeISO,
			showImg: user.profileImg.original,
			agencyName: user.saloonName || ""
		});
	}

	_onChangeText = id => val => {
		if (id == "postalZipCode") {
			val = val.replace(/[^0-9A-Za-z]/g, "");
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
	showImagePicker = async () => {
		console.warn("showImagePicker");
		if (Platform.OS == "android" && Platform.Version > 22) {
			console.warn("grantif");
			const granted = await PermissionsAndroid.requestMultiple([
				PermissionsAndroid.PERMISSIONS.CAMERA,
				PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
			]);

			if (
				granted["android.permission.CAMERA"] != "granted" ||
				granted["android.permission.WRITE_EXTERNAL_STORAGE"] != "granted"
			) {
				console.warn("notgranted");
				return alert("Don't have permissions to select image.");
			}
		}
		this.setState({ mediaType: "IMAGE" });
		Alert.alert(
			strings.noovvoo,
			"Choose Option",
			[
				{ text: "Camera", onPress: () => this.openCamera() },
				{ text: "Gallery", onPress: () => this.openGallery() },
				{ text: "Cancel", onPress: () => console.log("cancelled") }
			],
			{ cancelable: false }
		);
	};

	openCamera = () => {
		CropPicker.openCamera({
			width: Dimensions.get("window").width,
			height: 400,
			cropping: true,
			freeStyleCropEnabled: true,
			avoidEmptySpaceAroundImage: false
		}).then(image => {
			const newImg = {
				original: image.path,
				thumbnail: image.path,
				type: "IMAGE",
				height: "" + image.height,
				width: "" + image.width
			};
			console.log(newImg, "the new image i updated here is");
			this.setState({
				newImg,
				showImg: image.path
			});
		});
	};

	openGallery = () => {
		CropPicker.openPicker({
			width: Dimensions.get("window").width,
			height: 400,
			cropping: true,
			freeStyleCropEnabled: true,
			avoidEmptySpaceAroundImage: false
		}).then(image => {
			const newImg = {
				original: image.path,
				thumbnail: image.path,
				type: "IMAGE",
				height: "" + image.height,
				width: "" + image.width
			};
			console.log(newImg, "the new image i updated here is");
			this.setState({
				newImg,
				showImg: image.path
			});
		});
	};

	renderProfilePic(imagePath) {
		console.log(imagePath, "the imagte paht");
		const defaultUrl = "https://noovvoo-dev.s3-us-west-2.amazonaws.com/user-default.png";
		if (!imagePath) {
			return <Image style={commonStyles.profilePicStyle} source={Images.avatar} />;
		} else {
			return (
				<>
					<FastImage
						style={commonStyles.profilePicStyle}
						source={{
							uri: imagePath,
							priority: FastImage.priority.high,
							cache: FastImage.priority.cacheOnly
						}}
						resizeMode={FastImage.resizeMode.cover}
					/>
					{(imagePath !== defaultUrl && <View style={{
						position: 'absolute',
						top: 0, bottom: 0, justifyContent: 'center', width: "100%", alignItems: 'center'
					}}>
						<Image style={{ alignSelf: 'center' }} source={Images.camera_white} />
					</View>)}
				</>
			);
		}
	}

	updateData = (address, latitude, longitude, country) => {
		console.log(address, latitude, longitude, "the data i received");

		this.setState({ address: address, latitude, longitude, country });
	};

	editProfile = () => {
		const {
			firstName,
			lastName,
			phoneNumber,
			address,
			postalZipCode,
			latitude,
			longitude,
			date,
			selectedCountryCode,
			country,
			countryCodeISO,
			profileImg,
			newImg,
			agencyName = ""
		} = this.state;
		const { userData } = this.props.userDataReducer;

		if (firstName == null || firstName.trim().length == 0) {
			alert("Please enter first name");
		} else if (lastName == null || lastName.trim().length == 0) {
			alert("Please enter last name");
		} else if (
			userData.userType == "SALOON" &&
			(agencyName == "" || agencyName.trim().length == 0)
		) {
			alert("Please enter saloon name");
		} else if (selectedCountryCode == "Select") {
			alert("Please select country code");
		} else if (phoneNumber == null || phoneNumber.trim().length == 0) {
			alert("Please enter phone number");
		} else if (phoneNumber.length < 5 || phoneNumber.length > 15) {
			alert("The phone number must be 5-15 digits");
		} else if (postalZipCode == null || postalZipCode.trim().length == 0) {
			alert("Please enter postal or zip code");
		} else if (postalZipCode.trim().length < 3) {
			alert("Please enter valid postal or zip Code");
		} else if (address == null || address.trim().length == 0) {
			alert("Please enter an address");
		} else {
			const apiData = {
				firstName,
				lastName,
				dob: date,
				contactDetails: {
					phoneNo: phoneNumber,
					countryCode: selectedCountryCode,
					countryCodeISO
				},
				addressDetails: {
					address,
					postalCode: postalZipCode,
					country,
					coordinates: [longitude, latitude]
				}
				// profileImg:{
				// 	original:"https://st3.depositphotos.com/1662991/15593/i/1600/depositphotos_155935400-stock-photo-makeup-artist-in-beauty-salon.jpg",
				// 	thumbnail:"https://st3.depositphotos.com/1662991/15593/i/1600/depositphotos_155935400-stock-photo-makeup-artist-in-beauty-salon.jpg"
				// }
			};
			if (userData.userType == "AGENCY") {
				apiData.saloonName = agencyName;
			}
			console.log(apiData, "the apidata ");

			if (checkInternetAvailibility()) {
				this.setState({ isLoading: true });
				const token = this.props.userDataReducer.userData.accessToken;
				if (newImg.type == "IMAGE") {
					const formData = new FormData();
					formData.append("fileOf", "Stylist");
					formData.append("height", "" + newImg.height);
					formData.append("width", "" + newImg.width);
					formData.append("file", {
						uri: newImg.original,
						name: "profilepic.png",
						filename: "imageName.png",
						type: "image/png"
					});
					postApi(formData, API_UPLOAD_FILE, token, this.imageUploadResponse);
					return;
				}
				this.editProfileApiHit(apiData);
			}
		}
	};

	editProfileApiHit = apiData => {
		putApi(
			apiData,
			API_STYLIST_PROFILE,
			null,
			this.props.userDataReducer.userData.accessToken,
			this.editApiReponse
		);
	};
	imageUploadResponse = response => {
		console.log(response);
		const { userData } = this.props.userDataReducer;
		if (response) {
			const statusCode = response.data.statusCode;
			if (statusCode == 200 || statusCode == 201) {
				console.log(response, "the reponset i get");
				const image = response.data.info;
				const {
					firstName,
					lastName,
					phoneNumber,
					address,
					postalZipCode,
					latitude,
					longitude,
					date,
					selectedCountryCode,
					country,
					agencyName,
					countryCodeISO
				} = this.state;
				const apiData = {
					firstName,
					lastName,
					dob: date,
					contactDetails: {
						phoneNo: phoneNumber,
						countryCode: selectedCountryCode,
						countryCodeISO
					},
					addressDetails: {
						address,
						postalCode: postalZipCode,
						country,
						coordinates: [longitude, latitude]
					},
					profileImg: {
						original: image.fileData.original,
						thumbnail: image.fileData.thumbnail
					}
				};
				if (userData.userType == "SALOON") {
					apiData.saloonName = agencyName;
				}
				console.log(apiData, "the api data response i get is as follow");
				this.editProfileApiHit(apiData);
			} else {
				alert(response.data.message);
				this.setState({ isLoading: false });
			}
		} else {
			alert("Network Error");
		}
	};

	editApiReponse = response => {
		console.log(response, "the response is required");
		if (response) {
			const statusCode = response.data.statusCode;
			if (statusCode == 200 || statusCode == 201) {
				this.setState({ isLoading: false }, () => {
					const newUserData = {
						...this.props.userDataReducer.userData,
						...response.data.info
					};
					console.log(newUserData);
					this.props.actions.setUserData(newUserData);
					AsyncStorage.setItem("userData", JSON.stringify(newUserData));
					this.props.navigation.goBack(null);
					setTimeout(() => {
						alert("Profile updated successfully");
					}, 300);
				});
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
				this.setState({ isLoading: false });
			}
		} else {
			alert("Network Error");
		}
	};

	render() {
		const flexDirection = "row";
		const textAlign = "left";
		const positionRightToggle = flexDirection == "row" ? "Right" : "Left";
		const positionLeftToggle = flexDirection == "row" ? "Left" : "Right";
		const { userData } = this.props.userDataReducer;
		const {
			firstName,
			lastName,
			phoneNumber,
			country,
			postalZipCode,
			address,
			profileImg,
			agencyName,
			showImg
		} = this.state;
		console.log(showImg, "the image to be shown");
		console.log(this.state, "hte state");
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<Header
					title="Edit Profile"
					iconLeft={Images.back}
					iconRight={Images.small_logo}
					flexDirection={flexDirection}
					onPressLeft={() => this.props.navigation.goBack(null)}
				/>
				<ScrollView
					style={{
						marginBottom: verticalScale(10),
						paddingHorizontal: scale(24),
						flex: 1
					}}
					keyboardShouldPersistTaps="always"
				>
					<View
						style={{ flexDirection: "row", alignItems: "center", paddingTop: verticalScale(32) }}
					>
						<TouchableOpacity onPress={this.showImagePicker}>
							{this.renderProfilePic(showImg)}
						</TouchableOpacity>
						<Text
							onPress={this.showImagePicker}
							style={{
								...commonStyles.editProfileText,
								[`margin${positionLeftToggle}`]: moderateScale(16)
							}}
						>
							Change Profile Picture
						</Text>
					</View>
					<View style={{ paddingTop: moderateScale(22) }}>
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
										value={firstName}
										onChangeText={this._onChangeText("firstName")}
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
										value={lastName}
										onChangeText={this._onChangeText("lastName")}
										style={{ ...commonStyles.formTextInput, textAlign }}
									/>
								</View>
							</View>
						</View>
						{userData.userType == "AGENCY" && (
							<View style={commonStyles.formContainer}>
								<Text style={{ ...commonStyles.formText }}>{strings.agency}</Text>
								<TextInput
									selectionColor={colors.tabsActiveColor}
									value={agencyName}
									onChangeText={this._onChangeText("agencyName")}
									style={{ ...commonStyles.formTextInput, textAlign }}
								/>
							</View>
						)}
						<View style={{ ...commonStyles.formContainer }}>
							<Text style={{ ...commonStyles.formText, textAlign }}>{strings.dateOfBirth}</Text>
							<DatePicker
								style={commonStyles.formDateView}
								date={this.state.date}
								mode="date"
								maxDate={new Date()}
								placeholder={this.state.dateOfBirth}
								format="YYYY-MM-DD"
								confirmBtnText="Confirm"
								cancelBtnText="Cancel"
								iconSource={Images.downArrow}
								customStyles={{
									dateIcon: commonStyles.formDateIcon,
									dateInput: commonStyles.formDateInput,
									btnTextConfirm: {
										color: colors.tabsActiveColor,
									},
									btnTextCancel: {
										color: colors.tabsActiveColor,
									},
									dateText: {
										...commonStyles.formDateText,
										alignSelf: flexDirection === "row" ? "flex-start" : "flex-end"
									},
									dateTouchBody: { flexDirection }
								}}
								onDateChange={date => {
									this.setState({ date: date });
								}}
							/>
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
											({this.state.selectedCountryCode})
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
										value={phoneNumber}
										editable={false}
										// onChangeText={this._onChangeText("phoneNumber")}
										style={{ ...commonStyles.formTextInput, textAlign }}
									/>
								</View>
							</View>
						</View>
						<TouchableOpacity
							onPress={() =>
								this.props.navigation.navigate("editLocationPicker", {
									updateData: this.updateData
								})
							}
							style={commonStyles.formContainer}
						>
							<Text style={commonStyles.formText}> Address </Text>
							<View style={{ flexDirection, justifyContent: "space-between" }}>
								<Text
									numberOfLines={1}
									ellipsizeMode={"tail"}
									style={{ ...commonStyles.formTextInput }}
								>
									{address}
								</Text>
								<Image source={Images.arrowRight} />
							</View>
						</TouchableOpacity>

						<View style={commonStyles.formContainer}>
							<Text style={{ ...commonStyles.formText }}>{strings.postalZipCode}</Text>
							<TextInput
								selectionColor={colors.tabsActiveColor}
								value={postalZipCode}
								onChangeText={this._onChangeText("postalZipCode")}
								style={commonStyles.formTextInput}
							/>
						</View>
						<View style={commonStyles.formContainer}>
							<Text style={{ ...commonStyles.formText }}>{strings.country}</Text>
							<Text style={commonStyles.formTextInput}>{country}</Text>
						</View>

						<TouchableOpacity
							style={{ ...commonStyles.cardButtonContainer, height: moderateScale(48) }}
							onPress={this.editProfile}
						>
							<Text style={commonStyles.bottomButtonText}>SAVE</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
				{this.state.isLoading == true ? (
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
)(EditProfile);
