import React, { Component } from "react";

import {
	View,
	Image,
	Text,
	TouchableOpacity,
	FlatList,
	ScrollView,
	RefreshControl,
	Alert,
	PermissionsAndroid,
	Platform,
	Dimensions
} from "react-native";

//Third party packages
import { verticalScale, moderateScale, scale } from "react-native-size-matters";
import Bubbles from "react-native-loader/src/Bubbles";
import FastImage from "react-native-fast-image";
import _ from "lodash";
import moment from "moment";

//Redux Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserDataAction from "../../actions/userDataActions";
import ScrollableTabView, { DefaultTabBar } from "react-native-scrollable-tab-view";

//Common components and helper methods
import styles from "./OnGoingBookingStyle";
import colors from "../../theme/colors";
import { Images } from "../../components/ImagesPath";
import { checkInternetAvailibility } from "../../helper/CheckInternet";
import strings from "../../constants/LocalizedStrings";
import { postApi, putApi, getApi } from "../../config/HitApis";
import { API_REGISTER, API_UPDATE_BOOKING_STATUS, API_BOOKING_LISTING } from "../../config/Urls";
import clearAsyncStorage from "../../helper/clearAsyncStorage";
import commonStyles from "../../components/commonStyles";
import { fontNames } from "../../theme/fontFamily";
import CommonBookingCard from "../../components/CommonBookingCard";
import RenderEmpty from "../../components/RenderEmpty";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import Geolocation from 'react-native-geolocation-service';
const limit = 8;
let permissionDeniedCount = 0;

const navigatorLoc = navigator
class OnGoingBooking extends Component {
	state = {
		newBookings: [
			"https://st3.depositphotos.com/1662991/15593/i/1600/depositphotos_155935400-stock-photo-makeup-artist-in-beauty-salon.jpg",
			"https://st3.depositphotos.com/1662991/15593/i/1600/depositphotos_155935400-stock-photo-makeup-artist-in-beauty-salon.jpg",
			"https://st3.depositphotos.com/1662991/15593/i/1600/depositphotos_155935400-stock-photo-makeup-artist-in-beauty-salon.jpg",
			"https://st3.depositphotos.com/1662991/15593/i/1600/depositphotos_155935400-stock-photo-makeup-artist-in-beauty-salon.jpg"
		],
		onGoingArray: [],
		refreshing: false,
		isLoading: true,
		refreshing: false,
		paginationLoader: false,
		loadingMore: false,
		hasMoreData: true,
		latLongMovementArray: [
			{ longitude: 76.78892835974693, latitude: 30.70941655295251 },
			{ longitude: 76.7906030640006, latitude: 30.710516834345906 },
			{ longitude: 76.79128166288137, latitude: 30.71095930708169 },
			{ longitude: 76.79065503180027, latitude: 30.71161076161733 },
			{ longitude: 76.79009947925806, latitude: 30.71218063660091 },
			{ longitude: 76.78910840302706, latitude: 30.711541869066984 },
			{ longitude: 76.78708333522081, latitude: 30.710639919799323 },
			{ longitude: 76.78577408194542, latitude: 30.709517443830855 },
			{ longitude: 76.78487990051508, latitude: 30.708689847251375 },
			{ longitude: 76.782997995615, latitude: 30.708309052431066 },
			{ longitude: 76.78192712366581, latitude: 30.707406208137098 },
			{ longitude: 76.78013507276773, latitude: 30.706115921740043 },
			{ longitude: 76.77774555981159, latitude: 30.70466245513464 },
			{ longitude: 76.7743733525276, latitude: 30.702172600391208 },
			{ longitude: 76.77345436066388, latitude: 30.700782208948233 },
			{ longitude: 76.77207235246897, latitude: 30.70201491031009 },
			{ longitude: 76.77022162824869, latitude: 30.704107526071205 },
			{ longitude: 76.76876485347748, latitude: 30.705460106020496 }
		],
		curIndex: 0,
		latitude: 1,
		longitude: 1
	};

	// async checkLocationService (){
	// await	Geolocation.getCurrentPosition(
	// 		position => {
	  
	// 		  console.log('did',position)
			 
	// 		},
	// 		error => {
	// 			console.log(error,"error=>loc")
	// 		 },
	// 		{
	// 		  enableHighAccuracy: Platform.OS === 'ios',
	// 		  timeout: 20000,
	// 		  maximumAge: 1000,
	// 		},
	// 	  );
	// 	  this.watchID = Geolocation.watchPosition(position => {
	// 		console.log('did',position)
	// 	  });
	// }

	componentDidMount() {
		
		
		// navigator.geolocation.getCurrentPosition((fun)=>{
		// 	console.log(fun,'the fun value');
		// 	alert("fun")
		// },(err)=>{
		// 	alert('error')
		// 	console.log(err,'23y1293h')
		// },{enableHighAccuracy: false, timeout: 5000})

		checkInternetAvailibility();
		// console.log(this.props.navigation);
		// console.log(
		// 	this.props.navigation.getScreenProps().getSocket(),
		// 	"the socket value is as follow"
		// );
		this.socket = this.props.navigation.getScreenProps().getSocket();
		setTimeout(() => {
			if (checkInternetAvailibility) {
				const url = `${API_BOOKING_LISTING}?listingType=On going&skip=0&limit=${limit}`;
				this.getBookingsApiHit(url);
			} else {
				this.toggleIsLoading();
				alert("No Internet");
			}
		}, 300);
		// RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
		// 	interval: 10000,
		// 	fastInterval: 5000
		// })
		// 	.then(data => {
		// 		if (data == "already-enabled" || data === "enabled") {
		// 			navigator.geolocation.getCurrentPosition(
		// 				() => {
		// 					navigator.geolocation.watchPosition(
		// 						position => {
		// 							// alert("postions watch");
		// 							alert(
		// 								`yes ${position.coords.speed} the speed of me and latitude ${
		// 									position.coords.latitude
		// 								}`
		// 							);
		// 							console.log(position, "the position of navigator geolocation");
		// 						},
		// 						error => {
		// 							alert("error");
		// 						},
		// 						{ enableHighAccuracy: false, timeout: 50000 }
		// 					);
		// 				},
		// 				error => {},
		// 				{ enableHighAccuracy: false, timeout: 50000 }
		// 			);
		// 		}
		// 	})
		// 	.catch(error => {
		// 		console.log("the error");
		// 	});
	}

	toggleIsLoading = () => {
		this.setState(prevState => ({ isLoading: !prevState.isLoading }));
	};

	getBookingsApiHit = url => {
		const accessToken = this.props.userDataReducer.userData.accessToken;
		getApi(url, accessToken, this.getOngoingBookingsResponse);
	};

	getOngoingBookingsResponse = response => {
		console.log(response, "the ongoing repsone");
		if (response) {
			if (this.trackingTimeout) {
				// console.log("the clear Timeoute");
				clearTimeout(this.trackingTimeout);
			}
			// console.log("======================-----------------------------===========================");
			const statusCode = response.data.statusCode;
			if (statusCode == 200) {
				let data;
				const apiData = response.data.info.records;

				if (this.state.refreshing) {
					data = apiData;
				} else {
					data = [...this.state.onGoingArray, ...apiData];
				}
				// console.log(data, "the data value");
				const onTheWayBooking = _.find(data, val => {
					return val.bookingStatus == "On the way";
				});

				this.setState(
					{
						onGoingArray: data,
						refreshing: false,
						isLoading: false,
						loadingMore: false,
						hasMoreData: apiData.length >= limit ? true : false
					},
					() => {
						if (onTheWayBooking) {
							// console.log("there is on the way booking");
							this.startTracking(onTheWayBooking._id);
						}
					}
				);
				// console.log(data, "hte ongoing data value");
			} else if (statusCode == 401) {
				this.setState({ isLoading: false, loadingMore: false });
				clearAsyncStorage();
				this.props.navigation.navigate("signOut");
				setTimeout(() => {
					this.props.actions.clearReduxValues();
					alert("Session Expired, please log in again to continue");
				}, 500);
			} else {
				alert(response.data.message);
				this.setState({ isLoading: false });
			}
		} else {
			alert("Network Error");
			this.setState({ isLoading: false });
		}
	};

	getNextBookingStautus = (currentBookingStatus, serviceType) => {
		if (serviceType == "LOCAL") {
			switch (currentBookingStatus) {
				case "Accepted":
					return { nextServiceStatus: "Started", statusText: "Start" };
				case "Started":
					return { nextServiceStatus: "Completed", statusText: "Complete" };
			}
		} else {
			switch (currentBookingStatus) {
				case "Accepted":
					return { nextServiceStatus: "On the way", statusText: "On the way" };
				case "On the way":
					return { nextServiceStatus: "Reached", statusText: "Reach" };
				case "Reached":
					return { nextServiceStatus: "Started", statusText: "Start" };
				case "Started":
					return { nextServiceStatus: "Completed", statusText: "Complete" };
			}
		}
	};
	_onRefreshing = () => {
		if (checkInternetAvailibility) {
			this.setState({ refreshing: true });
			const url = `${API_BOOKING_LISTING}?listingType=On going&skip=0&limit=${limit}`;
			this.getBookingsApiHit(url);
			return;
		} else {
			this.setState({ isLoading: false, refreshing: false });
		}
	};

	updateDataOnNavigation = () => {
		this.setState({ isLoading: true,onGoingArray:[] },()=>{
			const url = `${API_BOOKING_LISTING}?listingType=On going&skip=0&limit=${limit}`;
			this.getBookingsApiHit(url);
		});
	
	};

	// bookingList = refreshing => {
	// 	if (checkInternetAvailibility) {
	// 		if (this.state.onGoingArray.length < 1 || refreshing) {
	// 			if (refreshing) {
	// 				this.setState({ refreshing: true });
	// 			}
	// 			const url = `${API_BOOKING_LISTING}?listingType=On going&skip=0&limit=0`;
	// 			this.getBookingsApiHit(url);
	// 		} else {
	// 			this.setState({ isLoading: false });
	// 		}
	// 		return;
	// 	} else {
	// 		this.setState({ isLoading: false, refreshing: false });
	// 	}
	// };

	updateBookingStatusHit = (item, nextServiceStatus, index) => {
		const compareTime = new Date(item.bookingStartTimeMilli - 10 * 60000).getTime();
		const currentTime = new Date().getTime();

		if (checkInternetAvailibility()) {
			if (nextServiceStatus !== "Started" || currentTime >= compareTime) {
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

	bookingApiHit = (bookingId, bookingStatus, index) => {
		console.log(bookingId, bookingStatus, index, "the data value");
		const formData = new FormData();
		formData.append("bookingId", bookingId);
		formData.append("status", bookingStatus);
		this.toggleIsLoading();
		console.log(this.props.userDataReducer.userData.accessToken, "the apccj rojke reject apio");
		putApi(
			formData,
			API_UPDATE_BOOKING_STATUS,
			null,
			this.props.userDataReducer.userData.accessToken,
			response => this.bookingUpdateApiResponse(response, index)
		);
	};

	bookingUpdateApiResponse = (response, itemIndex) => {
		this.setState({ isVisible: false });
		if (response) {
			const statusCode = response.data.statusCode;
			if (statusCode == 200 || statusCode == 201) {
				const tabIndex = 1;
				const bookingStatus=response.data.info.bookingStatus
				if (bookingStatus == "Completed") {
					this.props.navigation.navigate("bookingsRating",{item:this.state.onGoingArray[itemIndex]});
				}
				this.updateBookingArray(response.data.info, itemIndex, tabIndex);
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

	updateBookingArray = (item, itemIndex) => {
		const onGoingArray = _.cloneDeep(this.state.onGoingArray);
		const stateItem=_.cloneDeep(this.state.onGoingArray[itemIndex]);
		console.log(item, "the iteme");
		if (item.bookingStatus == "Completed") {
			console.log(onGoingArray.length, "teh array before");
			_.remove(onGoingArray, { _id: item._id });
			console.log(onGoingArray.length, "the length after");
		} else {
			if (item.bookingStatus == "On the way") {
				this.startTracking(item._id);
			}
			onGoingArray[itemIndex] = {...item,userId:stateItem.userId};
		}

		this.setState({ onGoingArray, isLoading: false });
		return;
	};

	getDistanceFromLatLngInKm = (lat1, lon1, lat2, lon2) => {
		var p = 0.017453292519943295; // Math.PI / 180
		var c = Math.cos;
		var a =
			0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

		return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
	};
	startTracking = async bookingId => {
		if (Platform.OS == "android" && Platform.Version > 22) {
		const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
		// console.log(granted,'the granted value');
		if(granted!=="granted"){
			console.log(granted,'the grandted value')
			alert("Permission Denied")
			return
		}
		}
		
		if (this.socket) {
			RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
				interval: 10000,
				fastInterval: 5000
			})
				.then(data => {
					console.log('the latest code to be followed is as follow');
					if (data == "already-enabled" || data === "enabled") {
						this.locationWatchID = Geolocation.getCurrentPosition(
							() => {
								Geolocation.watchPosition(
									position => {
										const bookingIndex = _.findIndex(this.state.onGoingArray, data => {
											return data._id == bookingId;
										});
										console.log(position,'the postion of my is as follow');
										const bookingItem = this.state.onGoingArray[bookingIndex];
										if (bookingItem) {
											if (bookingItem.bookingStatus == "On the way") {
												const { curIndex, latLongMovementArray } = this.state;

												// alert("postions watch");

												latitude = position.coords.latitude;
												longitude = position.coords.longitude;
												if (!bookingItem.bookingStatus == "On the way") {
													navigator.geolocation.clearWatch(this.locationWatchID);
													console.log("the else part");
												}
												let distanceBetweenTwoLatLong = this.getDistanceFromLatLngInKm(
													this.state.latitude,
													this.state.longitude,
													latitude,
													longitude
												);

												// alert(
												// 	`yes ${
												// 		position.coords.speed
												// 	} the speed of me andd distance between is ${distanceBetweenTwoLatLong} ${bookingId}  yes`
												// );
												if (distanceBetweenTwoLatLong > 0.1) {
													if (this.socketTimeout) {
														clearInterval(this.socketTimeout);
													}
													this.socketTimeout = setTimeout(() => {
														this.socket.emit("updateStylistLocation", {
															bookingId,
															trackingCoordinates: [longitude, latitude]
														});
													}, 1000);
												}
												this.setState({ latitude, longitude });
												// console.log(position, "the position of navigator geolocation");
											}
										} else {
											navigator.geolocation.clearWatch(this.locationWatchID);
										}
									},
									error => {
										alert("error");
									},
									{ enableHighAccuracy: true, timeout: 50000 }
								);
							},
							error => {
								console.log(error,'the error is as follow have a look')
							},
							{ enableHighAccuracy: true, timeout: 50000 }
						);
					}
				})
				.catch(error => {
					console.log("the error");
				});
		} else {
			this.props.navigation
				.getScreenProps()
				.socketConnection(this.props.userDataReducer.userData.accessToken);
			setTimeout(() => {
				this.socket = this.props.navigation.getScreenProps().getSocket();
				this.startTracking(bookingId);
			}, 10000);
		}
	};
	startTrackingOld = async bookingId => {
	

		if (this.socket) {
			const bookingIndex = _.findIndex(this.state.onGoingArray, data => {
				return data._id == bookingId;
			});
			const bookingItem = this.state.onGoingArray[bookingIndex];
			if (bookingItem) {
				if (bookingItem.bookingStatus == "On the way") {
					const { curIndex, latLongMovementArray } = this.state;
					RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
						interval: 10000,
						fastInterval: 5000
					})
						.then(data => {
							if (data == "already-enabled" || data === "enabled") {
								let latitude, longitude;
								// console.log('the permmsion granted test');
								navigator.geolocation.getCurrentPosition(
									position => {
										latitude = position.coords.latitude;
										longitude = position.coords.longitude;

										if (this.state.latitude != latitude) {
											this.socket.emit("updateStylistLocation", {
												bookingId,
												trackingCoordinates: [longitude, latitude]
											});
										}
										this.setState({ curIndex: curIndex + 1, latitude, longitude }, () => {
											const bookingIndex = _.findIndex(this.state.onGoingArray, data => {
												return data._id == bookingId;
											});
											const bookingItem = this.state.onGoingArray[bookingIndex];
											// console.log(bookingItem, "the booking item value");
											if (bookingItem) {
												if (bookingItem.bookingStatus == "On the way") {
													// console.log("settimeout");
													if (this.trackingTimeout) {
														clearTimeout(this.trackingTimeout);
													}
													this.trackingTimeout = setTimeout(() => {
														this.startTracking(bookingId);
													}, 10000);
												} else {
													alert("booking Status", bookingItem.bookingStatus);
												}
											}
										});
									},
									error => {
										alert("error");
										console.log(error, "the error");
										setTimeout(() => {
											this.startTracking(bookingId);
										}, 3000);
										this.setState({ error: error.message });
									},
									{ enableHighAccuracy: false, timeout: 50000 }
								);
							}
						})
						.catch(err => {
							// The user has not accepted to enable the location services or something went wrong during the process
							// "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
							// codes :
							//  - ERR00 : The user has clicked on Cancel button in the popup
							//  - ERR01 : If the Settings change are unavailable
							//  - ERR02 : If the popup has failed to open
						});
				}
			}
		} else {
			console.log("the else part");
			this.props.navigation
				.getScreenProps()
				.socketConnection(this.props.userDataReducer.userData.accessToken);
			setTimeout(() => {
				this.socket = this.props.navigation.getScreenProps().getSocket();
			}, 10000);
		}
	};

	renderOnGoingtem = data => {
		const { item, index } = data;
		const { width } = Dimensions.get("window");
		const { flexDirection, userData } = this.props.userDataReducer;
		const positionRightToggle = flexDirection == "row" ? "Right" : "Left";
		const positionLeftToggle = flexDirection == "row" ? "Left" : "Right";
		if (item.services.length > 1) {
			services = item.services && item.services.map(e => e.name).join(",");
		} else {
			services = item.services[0].name;
		}

		const { nextServiceStatus, statusText } = this.getNextBookingStautus(
			item.bookingStatus,
			item.serviceType
		);
		let loc =
			item.serviceType == "LOCAL" ? userData.addressDetails.address : item.userAddress.address;
		return (
			<TouchableOpacity
				onPress={
					item.serviceType !== "LOCAL"
						? () =>
								this.props.navigation.navigate("bookingDetails", {
									details: item,
									updateDataOnNavigation: this.updateDataOnNavigation
								})
						: () => {}
				}
				style={{ ...commonStyles.bookingCardContainer, marginHorizontal: moderateScale(16) }}
			>
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
								numberOfLines={1}
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
							{statusText}
						</Text>
					</TouchableOpacity>
				</View>
			</TouchableOpacity>
		);
	};

	renderFooterComponent = () => {
		const { width, height } = Dimensions.get("window");
		const { onGoingArray, paginationLoader, loadingMore } = this.state;
		// console.log(onGoingArray, "the upcomming array");
		// console.log(paginationLoader, "the pagination loader");
		// console.log(loadingMore, "the loading moere");
		if (onGoingArray.length > 0 && paginationLoader === true) {
			return (
				<TouchableOpacity
					style={commonStyles.loadMoreButton}
					hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
					onPress={this._loadMore}
				>
					<Text style={{ ...commonStyles.bottomButtonText, color: colors.black }}>Load More</Text>
				</TouchableOpacity>
			);
		} else if (loadingMore === true && onGoingArray.length > 0) {
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
		let { data, skip, onGoingArray } = this.state;

		if (checkInternetAvailibility()) {
			this.setState({ paginationLoader: false, loadingMore: true });
			const url = `${API_BOOKING_LISTING}?listingType=On going&skip=${
				onGoingArray.length
			}&limit=${limit}`;
			this.getBookingsApiHit(url);
		}
	};

	_onEndReached = () => {
		const { loadingMore } = this.state;
		if (this.state.onGoingArray.length >= 3 && !loadingMore) {
			console.warn("called true");
			this.setState({ paginationLoader: true });
		}
	};

	render() {
		// console.log(this.props.data, "hte prps dadat auvaue of let shcejk");
		const { hasMoreData } = this.state;
		return (
			<>
				<FlatList
					style={{ paddingTop: moderateScale(8) }}
					data={this.state.onGoingArray}
					renderItem={this.renderOnGoingtem}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this._onRefreshing}
							colors={[colors.tabsActiveColor]}
						/>
					}
					// bounces={false}
					showsVerticalScrollIndicator={false}
					keyExtractor={(item, index) => index.toString()}
					ListEmptyComponent={this.state.isLoading || this.state.refreshing ? null : RenderEmpty}
					onEndReachedThreshold={0.01}
					onEndReached={this._onEndReached}
					ListFooterComponent={hasMoreData && this.renderFooterComponent}
				/>

				{this.state.isLoading == true ? (
					<View style={{ ...commonStyles.loader }}>
						<Bubbles size={14} color={colors.tabsActiveColor} />
					</View>
				) : null}
			</>
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
)(OnGoingBooking);
