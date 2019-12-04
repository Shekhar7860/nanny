import React, { Component } from "react";

import {
	View,
	Image,
	Text,
	TextInput,
	TouchableOpacity,
	FlatList,
	Platform,
	ScrollView,
	Alert,
	StatusBar,
	RefreshControl,
	Dimensions,
	SafeAreaView
} from "react-native";

//Third party packages
import { verticalScale, moderateScale, scale } from "react-native-size-matters";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Bubbles from "react-native-loader/src/Bubbles";
import { StackActions } from "react-navigation";
import AsyncStorage from '@react-native-community/async-storage';
import Modal from "react-native-modal";
import { Dropdown } from "react-native-material-dropdown";
import FastImage from "react-native-fast-image";
import _ from "lodash";
import moment from "moment";

//Redux Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserDataAction from "../../actions/userDataActions";

//Common components and helper methods
import styles from "./NewBookingsStyle";
import colors from "../../theme/colors";
import Header from "../../components/HomeHeader";
import { Images } from "../../components/ImagesPath";
import { checkInternetAvailibility } from "../../helper/CheckInternet";
import strings from "../../constants/LocalizedStrings";
import { postApi, putApi, getApi } from "../../config/HitApis";
import { API_UPDATE_BOOKING_STATUS, API_BOOKING_LISTING } from "../../config/Urls";
import { clearAsyncStorage } from "../../helper/clearAsyncStorage";
import commonStyles from "../../components/commonStyles";
import { fontNames } from "../../theme/fontFamily";
import RenderEmpty from "../../components/RenderEmpty";
const limit = 8;
var accessToken;
class NewBooking extends Component {
	constructor(props) {
        super(props);
        this.state = {
		isVisible: false,
		time: [
			{
				label: "Busy",
				value: "Busy"
			},
			{
				label: "Long Distance",
				value: "Long Distance"
			},
			{
				label: "Personal Reasons",
				value: "Personal Reasons"
			},
			{
				label: "Others",
				value: "Others"
			}
		],
		rejectId: "",
		rejectReason: "",
		rejectIndex: -1,
		upComingArray: [],
		isLoading: true,
		refreshing: false,
		skip: 0,
		limit: 3,
		paginationLoader: false,
		loadingMore: false,
		hasMoreData: true
		
	};
	AsyncStorage.getItem('userData').then((keyValue) => {
		var value = JSON.parse(keyValue)
		accessToken = value.accessToken
		this.props.actions.setUserData(value)
	}, (error) => {
		console.log(error)
	});
}

	componentDidMount() {
		console.log(this.props.navigation);
		console.log(
			this.props.navigation.getScreenProps().getSocket(),
			"the socket value is as follow"
		);
		checkInternetAvailibility();
		setTimeout(() => {
			if (checkInternetAvailibility()) {
				const url = `${API_BOOKING_LISTING}?listingType=Upcoming&skip=0&limit=${limit}`;
				this.getBookingsApiHit(url);
			} else {
				this.toggleIsLoading();
				alert("No Internet");
			}
		}, 300);
	}

	getBookingsApiHit = url => {
		//const accessToken = this.props.userDataReducer.userData.accessToken;
		debugger
		getApi(url, accessToken, this.getUpcomingBookingsResponse);
	};

	getUpcomingBookingsResponse = response => {
		console.log(response, this.state.refreshing);
		if (response) {
			debugger
			const statusCode = response.data.statusCode;
			if (statusCode == 200) {
				const { refreshing } = this.state;
				let data;
				const apiData = response.data.info.records;
				if (refreshing) {
					data = apiData;
				} else {
					data = [...this.state.upComingArray, ...apiData];
				}
				this.setState({
					upComingArray: data,
					refreshing: false,
					isLoading: false,
					loadingMore: false,
					hasMoreData: apiData.length >= limit ? true : false
				});
				console.log(data, "hte data value");
			} else if (statusCode == 401) {
				this.setState({ isLoading: false, loadingMore: false, upComingArray: [] });

				clearAsyncStorage();
				this.props.navigation.navigate("signOut");
				setTimeout(() => {
					alert("Session Expired, please log in again to continue");
					this.props.actions.clearReduxValues();
				}, 400);
			} else {
				this.setState({ isLoading: false, loadingMore: false });
				alert(response.data.message);
			}
		} else {
			alert("Netowrk Error");
			this.setState({isLoading:false});
		}
	};

	toggleIsLoading = () => {
		this.setState(prevState => ({ isLoading: !prevState.isLoading }));
	};

	_onChange = rejectReason => {
		this.setState({ rejectReason });
	};

	toggleModal = (rejectId, index) => {
		this.setState(prevState => {
			return {
				isVisible: !prevState.isVisible,
				rejectId,
				rejectIndex: index
			};
		});
	};

	renderDropDownBase = data => {
		console.log(data, "the avalue");
		return (
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					paddingHorizontal: moderateScale(16),
					alignItems: "center"
				}}
			>
				<Text>{data.value}</Text>
				<Image
					style={{ height: moderateScale(16), width: moderateScale(16) }}
					source={Images.downArrow}
				/>
			</View>
		);
	};

	getNextBookingStautus = (currentBookingStatus, serviceType) => {
		if (serviceType == "LOCAL") {
			switch (currentBookingStatus) {
				case "Accepted":
					return "Started";
				case "Started":
					return "Completed";
			}
		} else {
			switch (currentBookingStatus) {
				case "Accepted":
					return "On the way";
				case "On the way":
					return "Reached";
				case "Reached":
					return "Started";
				case "Started":
					return "Completed";
			}
		}
	};
	renderNewItem = data => {
		const { item, index } = data;
		const { width } = Dimensions.get("window");
		const { flexDirection, userData } = this.props.userDataReducer;
		const positionRightToggle = flexDirection == "row" ? "Right" : "Left";
		const positionLeftToggle = flexDirection == "row" ? "Left" : "Right";
		let services;
		console.log(item.services.length, "the length of sevice");
		if (item.services.length > 1) {
			services = item.services.map(e => e.name).join(",");
		} else {
			services = item.services[0].name;
		}
		const nextServiceStatus = this.getNextBookingStautus(item.bookingStatus, item.serviceType);
		let loc =
			item.serviceType == "LOCAL" ? userData.addressDetails.address : item.userAddress.address;
		console.log(userData.addressDetails.address, "the userdata has a value");
		if (item.bookingStatus !== "Pending") {
			console.log(item, "the value of item is as follow");
		}

		return (
			<View style={{ ...commonStyles.bookingCardContainer, marginHorizontal: moderateScale(16) }}>
				<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
					<View>
						<Text style={commonStyles.bookingCardDateText}>
							{moment(item.bookingStartTimeMilli)
								.format("DD MMM . h:mm a")
								.toUpperCase()}
						</Text>
						<Text style={commonStyles.bookingCardNameText}>{item.userFullName}</Text>
						<View style={{ flexDirection, alignItems: "center" }}>
							<View style={{ paddingHorizontal: moderateScale(5) }}>
								<Image source={Images.mapsPinGrey} />
							</View>

							<Text
								ellipsizeMode="tail"
								style={{ color: colors.black, opacity: moderateScale(0.5), width: width * 0.4 }}
							>
								{loc}
							</Text>
						</View>
					</View>
					<View>
						<FastImage
							style={commonStyles.listElementImage}
							source={{
								uri: item.userId && item.userId.profileImg && item.userId.profileImg.original,
								priority: FastImage.priority.high
							}}
							resizeMode={FastImage.resizeMode.cover}
						/>
					</View>
				</View>
				<View style={commonStyles.bookingCardPriceServiceContainer}>
					<Text
						numberOfLines={2}
						ellipsizeMode="tail"
						style={{ ...commonStyles.bookingCardServiceText, width: width * 0.55 }}
					>
						{services}
					</Text>
					<Text style={commonStyles.bookingCardPriceText}>$ {item.total}</Text>
				</View>
				{item.bookingStatus == "Pending" ? (
					<View style={{ flexDirection }}>
						<TouchableOpacity
							style={{
								...commonStyles.cardButtonOutlineContainer,
								[`margin${positionRightToggle}`]: moderateScale(8)
							}}
							onPress={() => this.toggleModal(item._id, index)}
						>
							<Text style={{ ...commonStyles.cardButtonText }}>REJECT</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								...commonStyles.cardButtonContainer,
								[`margin${positionLeftToggle}`]: moderateScale(8)
							}}
							onPress={() => this.acceptApiHit(item._id, "Accepted", index)}
						>
							<Text style={{ ...commonStyles.cardButtonText, color: colors.white }}>Accept</Text>
						</TouchableOpacity>
					</View>
				) : (
					<View style={{ flexDirection }}>
						<View
							style={{
								flex: 1,
								[`margin${positionRightToggle}`]: moderateScale(8),
								justifyContent: "center"
							}}
						>
							<Text
								style={{
									...commonStyles.cardButtonText,
									color: colors.tabsActiveColor,
									textAlignVertical: "center",
									textAlign: "auto"
								}}
							>
								{item.bookingStatus}
							</Text>
						</View>
						<TouchableOpacity
							style={{
								flex: 1,
								...commonStyles.cardButtonContainer,
								[`margin${positionLeftToggle}`]: moderateScale(8)
							}}
							onPress={() => this.updateBookingStatusHit(item, nextServiceStatus, index)}
						>
							<Text style={{ ...commonStyles.cardButtonText, color: colors.white }}>
								{nextServiceStatus === "Started" ? "Start" : nextServiceStatus}
							</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
		);
	};

	acceptApiHit = (bookingId, nextServiceStatus, index) => {
		if (checkInternetAvailibility()) {
			Alert.alert(
				"Alert",
				`Are you sure you want to accept this booking?`,
				[
					{ text: "Yes", onPress: () => this.bookingApiHit(bookingId, nextServiceStatus, index) },
					{ text: "Cancel", onPress: () => console.log("cancelled") }
				],
				{ cancelable: false }
			);
		} else {
			alert("No Internet");
		}
	};

	updateBookingStatusHit = (item, nextServiceStatus, index) => {
		if (checkInternetAvailibility()) {
			console.log(item, "hte item value");
			let compareTime = new Date(item.bookingStartTimeMilli - 10 * 60000).getTime();
			console.log(new Date(item.bookingStartTimeMilli), "the new date time");
			if (nextServiceStatus == "On the way") {
				compareTime = new Date(item.bookingBufferStartTimeMilli - 10 * 60000).getTime();
			}
			const currentTime = new Date().getTime();

			console.log(new Date(currentTime), "the current itme");
			console.log(new Date(compareTime), "=====tooreo tie");

			if (currentTime >= compareTime) {
				console.log(new Date(compareTime));
				Alert.alert(
					"Alert",
					`Are you sure you want to update the booking status to ${nextServiceStatus}?`,
					[
						{ text: "Yes", onPress: () => this.bookingApiHit(item._id, nextServiceStatus, index) },
						{ text: "Cancel", onPress: () => console.log("cancelled") }
					],
					{ cancelable: false }
				);
			} else {
				let totalSeconds = Math.abs(compareTime - currentTime) / 1000;
				let days = Math.floor(totalSeconds / 86400);
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

	bookingApiHit = (bookingId, bookingStatus, index) => {
		console.log(bookingId, bookingStatus, index, "the data value");
		this.toggleIsLoading();
		const formData = new FormData();
		formData.append("bookingId", bookingId);
		formData.append("status", bookingStatus);
		//console.log(this.props.userDataReducer.userData.accessToken, "the apccj rojke reject apio");
		putApi(
			formData,
			API_UPDATE_BOOKING_STATUS,
			null,
			accessToken,
			response => this.bookingUpdateApiResponse(response, index)
		);
	};

	rejectBooking = () => {
		if (checkInternetAvailibility()) {
			this.setState({ isVisible: false, isLoading: false });
			const { rejectId, rejectReason, rejectIndex } = this.state;
			const formData = new FormData();
			formData.append("bookingId", rejectId);
			formData.append("status", "Rejected");
			putApi(
				formData,
				API_UPDATE_BOOKING_STATUS,
				null,
				accessToken,
				response => this.bookingUpdateApiResponse(response, rejectIndex)
			);
		} else {
			alert("No Internet");
		}
	};
	rejectApiResponse = response => {
		// this.setState({ isVisible: false });
		console.log(response, "the respnse of reject apppi");
	};
	bookingUpdateApiResponse = (response, itemIndex) => {
		console.log(response, "the booking response");
		// this.setState({ isVisible: false });
		if (response) {
			const statusCode = response.data.statusCode;
			if (statusCode == 200 || statusCode == 201) {
				const tabIndex = 0;
				this.updateBookingArray(response.data.info, itemIndex);
			} else if (statusCode == 401) {
				this.setState({ isLoading: false, loadingMore: false, upComingArray: [] });
				clearAsyncStorage();
				this.props.navigation.navigate("signOut");
				setTimeout(() => {
					alert("Session Expired, please log in again to continue");
					this.props.actions.clearReduxValues();
				}, 600);
			} else {
				this.toggleIsLoading();
				alert(response.data.message);
			}
		} else {
			this.toggleIsLoading();
			alert("Network Error");
		}
		console.log(response, "the respnse of reject apppi");
	};

	updateBookingArray = (item, itemIndex) => {
		console.log(item,'the item value is as follow let see');
		const upComingArray = _.cloneDeep(this.state.upComingArray);
		if (item.bookingStatus == "Accepted") {
			upComingArray[itemIndex].bookingStatus = "Accepted";
		} else {
			// if (item.bookingStatus == "On the way") {
			// 	setTimeout(()=>{
			// 		this.props.onPressTabChange();
			// 	},2000)
				
			// }
			_.remove(upComingArray, { _id: item._id });
		}
		this.setState({ upComingArray, isLoading: false });
		return;
	};

	_onRefreshing = () => {
		if (checkInternetAvailibility) {
			this.setState({ refreshing: true });
			const url = `${API_BOOKING_LISTING}?listingType=Upcoming&skip=0&limit=${limit}`;
			this.getBookingsApiHit(url, this.getUpcomingBookingsResponse);
			return;
		} else {
			this.setState({ isLoading: false, refreshing: false });
		}
	};

	bookingList = refreshing => {};

	renderFooterComponent = () => {
		const { width, height } = Dimensions.get("window");
		const { upComingArray, paginationLoader, loadingMore } = this.state;
		console.log(upComingArray, "the upcomming array");
		console.log(paginationLoader, "the pagination loader");
		console.log(loadingMore, "the loading moere");
		if (upComingArray.length > 0 && paginationLoader === true) {
			return (
				<TouchableOpacity
					style={commonStyles.loadMoreButton}
					hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
					onPress={this._loadMore}
				>
					<Text style={{ ...commonStyles.bottomButtonText, color: colors.black }}>Load More</Text>
				</TouchableOpacity>
			);
		} else if (loadingMore === true && upComingArray.length > 0) {
			return (
				<View style={commonStyles.loadMoreButton}>
					<Bubbles size={10} color={colors.tabsActiveColor} />
				</View>
			);
		} else {
			return <View />;
		}
	};
	_loadMore = () => {
		let { data, skip, upComingArray } = this.state;

		if (checkInternetAvailibility()) {
			this.setState({ paginationLoader: false, loadingMore: true });
			const url = `${API_BOOKING_LISTING}?listingType=Upcoming&skip=${
				upComingArray.length
			}&limit=4`;
			this.getBookingsApiHit(url);
		}
	};

	_onEndReached = () => {
		const { loadingMore } = this.state;
		if (this.state.upComingArray.length >= 3 && !loadingMore) {
			console.warn("called true");
			this.setState({ paginationLoader: true });
		}
	};

	rejectTextChange = rejectText => {
		this.setState({ rejectText });
	};

	render() {
		const flexDirection = "row";
		const positionRightToggle = flexDirection == "row" ? "Right" : "Left";
		const positionLeftToggle = flexDirection == "row" ? "Left" : "Right";
		const { isVisible, hasMoreData } = this.state;
		console.log("render child the chid");
		return (
			<SafeAreaView style={{ flex: 1 }}>
			<StatusBar backgroundColor={colors.black} barStyle="default" />
			<Header
					title={"NANNY LINE"}
					//headerStyle={styles.headerStyle}
					flexDirection={flexDirection}
					// customRight={() => (
					// 	<CustomRightNotification
					// 		onPress={() => {
					// 			this.props.navigation.navigate("bookingsNotificationsListing",{isFromHome:false,isFromBookings:true})
					// 		}}
					// 		// value="10"
					// 	/>
					// )}
				/>
				<FlatList
					style={{ paddingTop: moderateScale(8) }}
					data={this.state.upComingArray}
					renderItem={this.renderNewItem}
					// bounces={false}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this._onRefreshing}
							colors={[colors.tabsActiveColor]}
						/>
					}
					showsVerticalScrollIndicator={false}
					keyExtractor={(item, index) => index.toString()}
					ListEmptyComponent={this.state.isLoading || this.state.refreshing ? null : RenderEmpty}
					ListFooterComponent={hasMoreData && this.renderFooterComponent}
					onEndReachedThreshold={0.01}
					onEndReached={this._onEndReached}
				/>

				{this.state.isLoading == true ? (
					<View style={{ ...commonStyles.loader, flex: 1 }}>
						<Bubbles size={14} color={colors.tabsActiveColor} />
					</View>
				) : null}
				<Modal isVisible={this.state.isVisible}>
					<View
						style={{
							padding: moderateScale(16),
							paddingTop: moderateScale(25),
							shadowOffset: { height: 0, width: 0 },
							shadowRadius: moderateScale(30),
							shadowOpacity: moderateScale(1),
							shadowColor: "rgba(0,0,0,0.1)",
							backgroundColor: "white",
							minHeight: moderateScale(296),
							borderRadius: moderateScale(8)
						}}
					>
						<Text
							style={{
								fontFamily: fontNames.regularFont,
								fontSize: moderateScale(18),
								color: "#212121",
								marginBottom: moderateScale(23)
							}}
						>
							Enter reason for rejection
						</Text>

						<Dropdown
							containerStyle={{
								height: moderateScale(50),
								justifyContent: "center",
								borderRadius: moderateScale(10),
								borderWidth: moderateScale(1),
								borderColor: "rgba(0,0,0,0.06)",
								marginBottom: moderateScale(16)
							}}
							renderBase={this.renderDropDownBase}
							value={"Busy"}
							dropdownPosition={2}
							onChangeText={this._onChange}
							dropdownOffset={{ top: 0, left: 0 }}
							dropdownMargins={{ min: 0, max: 0 }}
							data={this.state.time}
						/>
						<TextInput
						  selectionColor={colors.tabsActiveColor}
							style={{
								textAlign: "left",
								textAlignVertical: "top",
								height: moderateScale(96),
								borderWidth: moderateScale(1),
								borderColor: "rgba(0,0,0,0.06)",
								paddingHorizontal: moderateScale(16),
								marginBottom: moderateScale(16)
							}}
							onChangeText={this.rejectTextChange}
							multiline
							placeholder="Additional description"
						/>
						<View style={{ flexDirection }}>
							<TouchableOpacity
								style={{
									...commonStyles.cardButtonOutlineContainer,
									[`margin${positionRightToggle}`]: moderateScale(8)
								}}
								onPress={this.toggleModal}
							>
								<Text style={{ ...commonStyles.cardButtonText }}>CANCEL</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={{
									...commonStyles.cardButtonContainer,
									[`margin${positionLeftToggle}`]: moderateScale(8)
								}}
								onPress={this.rejectBooking}
							>
								<Text style={{ ...commonStyles.cardButtonText, color: colors.white }}>SUBMIT</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
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
)(NewBooking);
