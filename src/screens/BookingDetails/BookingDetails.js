import React, { Component } from "react";
import {
	View,
	Text,
	SafeAreaView,
	TouchableOpacity,
	Switch,
	Image,
	ImageBackground,
	Linking,
	Alert,
	Dimensions,
	Platform,
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
import styles from "./BookingDetailsStyle";
import Header from "../../components/Header";
import { putApi, getApi } from "../../config/HitApis";
import {
	API_LOGOUT,
	API_SETTINGS,
	API_UPDATE_BOOKING_STATUS,
	API_BOOKING_LISTING
} from "../../config/Urls";
import { checkInternetAvailibility } from "../../helper/CheckInternet";
import colors from "../../theme/colors";
import clearAsyncStorage from "../../helper/clearAsyncStorage";
import { ScrollView } from "react-native-gesture-handler";
import commonStyles from "../../components/commonStyles";
import moment from "moment";
import { fontNames } from "../../theme/fontFamily";

class BookingDetails extends Component {

	constructor(props){
		super(props);
		const details = this.props.navigation.getParam("details");
		this.state={
			bookingStatus:details.bookingStatus,
			isLoading:false
		}
	}
	componentDidMount() {
		checkInternetAvailibility();
	}

	getNextBookingStautus = currentBookingStatus => {
		switch (currentBookingStatus) {
			case "Accepted":
				return { nextServiceStatus: "On the way", statusText: "On the way to service" };
			case "On the way":
				return { nextServiceStatus: "Reached", statusText: "Reached at location" };
			case "Reached":
				return { nextServiceStatus: "Started", statusText: "Start Service" };
			case "Started":
				return { nextServiceStatus: "Completed", statusText: "End Service" };
			case "Completed":
				return { nextServiceStatus: "", statusText: "Already Completed" };
		}
	};

	updateBookingStatusHit = (item, nextServiceStatus) => {
		const compareTime = new Date(item.bookingStartTimeMilli - 10 * 60000).getTime();
		const currentTime = new Date().getTime();
		if (checkInternetAvailibility()) {
			if (nextServiceStatus !== "Started" || currentTime >= compareTime) {
				console.log(new Date(compareTime));
				Alert.alert(
					"Alert",
					`Are you sure you want to update the booking status to ${nextServiceStatus}?`,
					[
						{ text: "Yes", onPress: () => this.bookingApiHit(item._id, nextServiceStatus) },
						{ text: "Cancel", onPress: () => console.log("cancelled") }
					],
					{ cancelable: false }
				);
			} else {
				let totalSeconds = Math.abs(compareTime - currentTime) / 1000;
				let days = Math.ceil(totalSeconds / 86400);
				let minutes = Math.floor(totalSeconds / 60) % 60;
				let hours = Math.floor(totalSeconds / 3600) % 24;
				alert(
					`Time Left in service start is${
						days ? " " + days + " days" : ""
					} ${hours} hours ${minutes} minutes`
				);
			}
		} else {
			alert("No Internet");
		}
	};

	bookingApiHit = (bookingId, bookingStatus) => {
		this.setState({isLoading:true})
		// console.log(bookingId, bookingStatus, "the data value");
		const formData = new FormData();
		formData.append("bookingId", bookingId);
		formData.append("status", bookingStatus);
		// console.log(this.props.userDataReducer.userData.accessToken, "the apccj rojke reject apio");
		putApi(
			formData,
			API_UPDATE_BOOKING_STATUS,
			null,
			this.props.userDataReducer.userData.accessToken,
			this.bookingUpdateApiResponse
		);
	};

	bookingUpdateApiResponse = response => {
		if (response) {
			const statusCode = response.data.statusCode;
			if (statusCode == 200 || statusCode == 201) {
				const bookingStatus=response.data.info.bookingStatus
				this.setState({bookingStatus,isLoading:false})
				if (bookingStatus == "Completed") {
					this.props.navigation.navigate("bookingsRating",{item:this.props.navigation.getParam('details')});
				}
				const tabIndex = 1;
			} else if (statusCode == 401) {
				this.setState({ isLoading: false, loadingMore: false });
				clearAsyncStorage();
				this.props.navigation.navigate("signOut");
				setTimeout(() => {
					this.props.actions.clearReduxValues();
					alert("Session Expired, please log in again to continue");
				}, 500);
			} else {
				this.setState({ isLoading: false });
				alert(response.data.message);
			}
		} else {
			alert("Network Error");
		}
		console.log(response, "the respnse of reject apppi");
	};

	onHeaderBackPress=()=>{
		this.props.navigation.state.params.updateDataOnNavigation();
		this.props.navigation.goBack(null)
			
	}

	openMap = () => {
	
			const details = this.props.navigation.getParam("details");
			const coordinates=details.userAddress.coordinates;
			const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
			const latLng = `${coordinates[1]},${coordinates[0]}`
			const label = strings.noovvoo
			const url = Platform.select({
				ios: `${scheme}${label}@${latLng}`,
				android: `${scheme}${latLng}`
			});
			Linking.openURL(url);
			
      
    } 
	render() {
		const details = this.props.navigation.getParam("details");
		console.log(details, "the booking details");
		const { flexDirection } = this.props.userDataReducer;
		const { width } = Dimensions.get("window");
		const lat=details.userAddress.coordinates[1];
		const lng=details.userAddress.coordinates[0]
		const mapWidth=parseInt(width);
		const mapHeight=parseInt(moderateScale(220))
		const positionRightToggle = flexDirection == "row" ? "Right" : "Left";
		const positionLeftToggle = flexDirection == "row" ? "Left" : "Right";
		const imgUrl =
			"https://st3.depositphotos.com/1662991/15593/i/1600/depositphotos_155935400-stock-photo-makeup-artist-in-beauty-salon.jpg";

		const { nextServiceStatus, statusText } = this.getNextBookingStautus(this.state.bookingStatus);
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<Header
					title={"Booking Details"}
					flexDirection={flexDirection}
					iconLeft={Images.back}
					onPressLeft={this.onHeaderBackPress}
				/>
				<ScrollView style={{ flex: 1 }}>
					<View
						style={{
							marginTop: moderateScale(32),
							borderBottomColor: colors.textInputBottomBorder,
							borderBottomWidth: 1
						}}
					>
						<View style={{ justifyContent: "center", alignItems: "center" }}>
							<Image
								style={{
									height: moderateScale(88),
									width: moderateScale(88),
									borderRadius: moderateScale(44)
								}}
								source={{ uri: imgUrl }}
							/>
						</View>

						<Text
							style={{
								color: colors.interestItemTextColor,
								fontSize: moderateScale(16),
								fontFamily: fontNames.regularFont,
								textAlign: "center"
							}}
						>
							{details.userFullName}
						</Text>

						<View
							style={{
								flexDirection,
								justifyContent: "center",
								alignItems: "center",
								marginBottom: moderateScale(18)
							}}
						>
							<Image source={Images.starYellow} />
							<Text
								style={{
									marginHorizontal: moderateScale(4),
									fontSize: moderateScale(12),
									fontFamily: fontNames.regularFont,
									color: colors.black,
									alignSelf: "center",
									textAlign: "center",
									textAlignVertical: "center"
								}}
							>
								{details.userId.rating}
							</Text>
						</View>
					</View>
					<View>
						<View style={{ marginTop: moderateScale(15) }}>
							<Text
								style={{
									color: colors.black,
									paddingHorizontal: moderateScale(16),
									fontFamily: fontNames.boldFont,
									fontSize: moderateScale(14),
									marginBottom: moderateScale(8)
								}}
							>
								Service Address
							</Text>
							<ImageBackground
								style={{
									height: moderateScale(220),
									width: width,
								}}
								source={{
									uri:
										`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=${mapWidth}x${mapHeight}&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=AIzaSyDNjbIaiPB41uhvhD0mb9Xdi2tA7n0AFlo`
								}}
							>
								<View
									style={{ position: "absolute", bottom: moderateScale(24), left: 0, right: 0 }}
								>
									<View
										style={{
											width: 0,
											// backgroundColor: "transparent",
											borderStyle: "solid",
											borderLeftWidth: 10,
											borderRightWidth: 10,
											borderBottomWidth: 8,
											alignSelf: "center",
											borderLeftColor: "transparent",
											borderRightColor: "transparent",
											borderBottomColor: "white"
										}}
									/>
									<View
										style={{
											backgroundColor: "white",
											height: moderateScale(70),
											width: width * 0.9,
											alignSelf: "center",
											padding: 10,
											flexDirection,
											alignItems:'center',
										}}
									>
										<Text style={{fontFamily:fontNames.regularFont,[`margin${positionRightToggle}`]:14,flex:1}}>{details.userAddress.address}</Text>
										<TouchableOpacity onPress={this.openMap} hitSlop={{left:10,right:10,top:10,bottom:10}}>
										<Image source={Images.direction}/>
										</TouchableOpacity>
									</View>
								</View>
							</ImageBackground>
						</View>
						<View style={{ paddingHorizontal: moderateScale(16) }}>
							<View style={{ marginTop: moderateScale(24) }}>
								<Text
									style={{
										color: colors.black,
										fontFamily: fontNames.boldFont,
										fontSize: moderateScale(14),
										marginBottom: moderateScale(15)
									}}
								>
									Services
								</Text>
								<ScrollView horizontal={true}>
									{details.services.map(service => (
										<Text
											key={service._id}
											style={{
												borderRadius: 4,
												backgroundColor: "rgba(0,0,0,0.3)",
												color: colors.black,
												fontFamily: fontNames.regularFont,
												padding: moderateScale(8),
												marginHorizontal: moderateScale(5)
											}}
										>
											{service.name}
										</Text>
									))}
								</ScrollView>
								<View style={{ marginTop: moderateScale(24), marginBottom: moderateScale(11) }}>
									<Text
										style={{
											color: colors.black,
											fontFamily: fontNames.boldFont,
											fontSize: moderateScale(14)
										}}
									>
										Date & Time
									</Text>
									<Text style={{ fontFamily: fontNames.regularFont }}>
										{moment(details.bookingStartTimeMilli)
											.format("DD MMM . h:mm a")
											.toUpperCase()}
									</Text>
								</View>
							</View>
						</View>
					</View>
				</ScrollView>
				<TouchableOpacity
					onPress={
						this.state.bookingStatus !== "Completed"
							? () => this.updateBookingStatusHit(details, nextServiceStatus)
							: () => {}
					}
					style={{ ...commonStyles.bottomButton, position: "relative" }}
				>
					<Text style={{ ...commonStyles.bottomButtonText, textTransform: "uppercase" }}>
						{this.state.bookingStatus !== "Completed"?statusText:"Already Completed"}
					</Text>
				</TouchableOpacity>
				{this.state.isLoading == true ? (
					<View style={{ ...commonStyles.loader,zIndex:100 }}>
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
)(BookingDetails);
