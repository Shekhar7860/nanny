import React, { Component } from "react";

import {
	View,
	Image,
	Text,
	TouchableOpacity,
	FlatList,
	Dimensions,
	RefreshControl,
	SafeAreaView
} from "react-native";

//Third party packages
import { verticalScale, moderateScale, scale } from "react-native-size-matters";
import Bubbles from "react-native-loader/src/Bubbles";
import FastImage from "react-native-fast-image";

//Redux Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserDataAction from "../../actions/userDataActions";

//Common components and helper methods
import colors from "../../theme/colors";
import { Images } from "../../components/ImagesPath";
import styles from "./NotificationsListingStyle";
import { checkInternetAvailibility } from "../../helper/CheckInternet";
import strings from "../../constants/LocalizedStrings";
import { getApi } from "../../config/HitApis";
import { API_NOTIFICATIONS } from "../../config/Urls";
import Header from "../../components/Header";
import commonStyles from "../../components/commonStyles";
import { fontNames } from "../../theme/fontFamily";
import { timeAgo } from "../../helper/TimeAgo";

var notificationsListing = [];
var currentListlength = 0;
var notificationIdToSkip = null;
var limit = 5;
const { width, height } = Dimensions.get("window");

class NotificationsListing extends Component {
	constructor(props) {
		super(props);
		this.state = {
			notificationsListing: [],
			isLoading: true,
			paginationLoader: false,
			loadingMore: false,
			time: null,
			refreshing: false,
			isFromHome: this.props.navigation.getParam("isFromHome"),
			isFromBookings: this.props.navigation.getParam("isFromBookings")
		};
	}

	componentDidMount() {
		checkInternetAvailibility();
		this.interval = setInterval(() => {
			this.setState({ time: Date.now() });
		}, 1000);
		setTimeout(() => {
			if (checkInternetAvailibility()) {
				// this.setState({ isLoading: true })
				getApi(
					API_NOTIFICATIONS + "?limit=" + limit,
					this.props.userDataReducer.userData.accessToken,
					response => this.notificationsListingApiResponse(response)
				);
			} else {
				this.setState({ isLoading: false });
				alert("No internet");
			}
		}, 500);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	_navigateToScreen = item => {
		switch (item.notificationType) {
			case "Booking Completed":
				//     if (item.bookingId.stylistRating === 0 && this.state.isFromHome === true)
				//     this.props.navigation.navigate("rating", { item: item })
				// else if (item.bookingId.stylistRating === 0 && this.state.isFromBookings === true)
				//     this.props.navigation.navigate("bookingsRating", { item: item })
				break;

			default:
				break;
		}
	};

	_onRefresh() {
		this.setState({ refreshing: true });
		this.setState({ paginationLoader: false });
		notificationsListing = [];
		currentListlength = 0;
		this.setState({ notificationsListing: [] });
		notificationIdToSkip = null;
		limit = 5;
		setTimeout(() => {
			if (checkInternetAvailibility()) {
				getApi(
					API_NOTIFICATIONS + "?limit=" + limit,
					this.props.userDataReducer.userData.accessToken,
					response => this.notificationsListingApiResponse(response)
				);
			} else {
				alert("No internet");
				this.setState({ isLoading: false });
			}
		}, 600);
	}

	notificationsListingApiResponse = response => {
		this.setState({
			refreshing: false,
			isLoading: false,
			paginationLoader: false,
			loadingMore: false
		});
		// this.setState({ isLoading: false })
		// this.setState({ paginationLoader: false })
		// this.setState({ loadingMore: false })
		//homeFeedsList = []
		console.warn("result " + JSON.stringify(response));
		if (response) {
			var data = response.data.info;
			var message = response.data.message;
			var statusCode = response.data.statusCode;
			if (statusCode === 200) {
				notificationsListing = [...data.records];
				console.warn("notificationsListing length " + notificationsListing.length);
				// this.setState({ categoriesArray, isLoading: false });
				if (notificationIdToSkip === null) {
					if (notificationsListing.length > 0) {
						currentListlength = notificationsListing.length;
						this.setState({ notificationsListing: notificationsListing });
						notificationIdToSkip = notificationsListing[notificationsListing.length - 1]._id;
						//limit = currentListlength + 10
						console.warn(
							"if notificationIdToSkip " +
								notificationIdToSkip +
								" " +
								"limit " +
								limit +
								"notificationsListing " +
								currentListlength
						);
					} else {
						currentListlength = 0;
					}
				} else {
					if (notificationsListing.length > 0) {
						currentListlength = notificationsListing.length;
						notificationIdToSkip = notificationsListing[notificationsListing.length - 1]._id;
						for (i = 0; i < notificationsListing.length; i++) {
							this.setState({
								notificationsListing: [...this.state.notificationsListing, notificationsListing[i]]
							});
						}
						console.warn(
							"else notificationIdToSkip " +
								notificationIdToSkip +
								" " +
								"limit " +
								limit +
								"commentsListLength " +
								currentListlength
						);
					} else {
						notificationIdToSkip = null;
						// limit = 0
						notificationsListing = [];
					}
				}
			} else if (statusCode === 401) {
				clearAsyncStorage();
				this.props.navigation.navigate("signOut");
				setTimeout(() => {
					this.props.actions.clearReduxValues();
					alert("Session Expired, please log in again to continue");
				}, 500);
			} else {
				setTimeout(() => {
					alert(message);
				}, 600);
			}
		} else {
			alert("Server Error");
		}
	};

	_onEndReached = () => {
		console.warn(
			"called " + notificationIdToSkip + " " + limit + " " + notificationsListing.length
		);
		if (notificationsListing.length >= 5) {
			console.warn("called true");
			this.setState({ paginationLoader: true });
		}
	};

	_loadMore = () => {
		let { data } = this.state;
		this.setState({ paginationLoader: false });
		if (checkInternetAvailibility()) {
			console.warn("called _loadMore");
			getApi(
				API_NOTIFICATIONS + "?notificationIdToSkip=" + notificationIdToSkip + "&limit=" + limit,
				this.props.userDataReducer.userData.accessToken,
				response => this.notificationsListingApiResponse(response)
			);
			this.setState({ loadingMore: true });
		} else {
			alert("No internet");
			this.setState({ paginationLoader: true });
		}
	};

	renderFooterComponent() {
		const { width, height } = Dimensions.get("window");
		if (notificationsListing.length > 0 && this.state.paginationLoader === true) {
			return (
				<TouchableOpacity
					style={styles.loadMoreButton}
					hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
					onPress={() => this._loadMore()}
				>
					<Text style={styles.titleText}>Load More</Text>
				</TouchableOpacity>
			);
		} else if (this.state.loadingMore === true && notificationsListing.length > 0) {
			return (
				<View style={styles.loadMoreButton}>
					<Bubbles size={10} color={colors.tabsActiveColor} />
				</View>
			);
		} else {
			return <View />;
		}
	}

	renderEmpty = () => {
		if (this.state.isLoading != true) {
			return (
				<View
					style={{ height: height / 2, alignItems: "center", justifyContent: "center", flex: 1 }}
				>
					<Image source={Images.noDataFound} />
				</View>
			);
		} else {
			return null;
		}
	};

	renderItem = data => {
		const { item, index } = data;
		console.log(item, "the item has a value lets see");
		let { flexDirection, textAlign } = this.props.userDataReducer;
		return (
			<TouchableOpacity
				activeOpacity={0.5}
				style={[styles.listItemMainView, { flexDirection: flexDirection }]}
				onPress={() => this._navigateToScreen(item)}
			>
				{item.by ? (
					<FastImage
						style={styles.profilePicStyle}
						source={{
							uri: item.by.profileImg.thumbnail,
							priority: FastImage.priority.high,
							cache: FastImage.priority.cacheOnly
						}}
						resizeMode={FastImage.resizeMode.cover}
					/>
				) : (
					<Image resizeMode="contain" style={styles.profilePicStyle} source={Images.avatar} />
				)}
				<View style={{ flexDirection: "column", justifyContent: "space-between" }}>
					<Text
						numberOfLines={3}
						ellipsizeMode={"tail"}
						style={[styles.notificationsText, { textAlign: textAlign }]}
					>
						{item.body}
					</Text>
					<View />
					<View>
						<Text style={[styles.timeText, { textAlign: textAlign }]}>
							{timeAgo(item.createdAt)}
						</Text>
						<View style={styles.inputLine} />
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	render() {
		let { flexDirection } = this.props.userDataReducer;
		console.log("render");
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<View style={{ flex: 1 }}>
					<Header
						title={"Notifications"}
						flexDirection={flexDirection}
						iconLeft={null}
						iconMiddle={null}
						iconRight={Images.crossB}
						onPressRight={() => this.props.navigation.goBack(null)}
					/>
					<View style={{ height: verticalScale(12) }} />
					<FlatList
						data={this.state.notificationsListing}
						renderItem={this.renderItem}
						showsVerticalScrollIndicator={false}
						keyExtractor={(item, index) => index.toString()}
						renderItem={this.renderItem}
						ListEmptyComponent={this.renderEmpty}
						ListFooterComponent={this.renderFooterComponent.bind(this)}
						onEndReachedThreshold={0.01}
						onEndReached={() => this._onEndReached()}
						refreshControl={
							<RefreshControl
								refreshing={this.state.refreshing}
								onRefresh={this._onRefresh.bind(this)}
								colors={[colors.tabsActiveColor]}
							/>
						}
					/>
				</View>
				{this.state.isLoading == true ? (
					<View style={[commonStyles.loader, { height: height / 2 }]}>
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
)(NotificationsListing);
