import React, { Component } from "react";

import {
	View,
	Image,
	Text,
	TouchableOpacity,
	FlatList,
	Platform,
	RefreshControl,
	ScrollView,
	Dimensions
} from "react-native";

//Third party packages
import { verticalScale, moderateScale, scale } from "react-native-size-matters";
import Bubbles from "react-native-loader/src/Bubbles";
import _ from "lodash";
import moment from "moment";

//Redux Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserDataAction from "../../actions/userDataActions";
import ScrollableTabView, { DefaultTabBar } from "react-native-scrollable-tab-view";

//Common components and helper methods
import styles from "./PastBookingsStyle";
import colors from "../../theme/colors";
import { Images } from "../../components/ImagesPath";
import { checkInternetAvailibility } from "../../helper/CheckInternet";
import strings from "../../constants/LocalizedStrings";
import { postApi, getApi } from "../../config/HitApis";
import { API_REGISTER, API_BOOKING_LISTING } from "../../config/Urls";
import clearAsyncStorage from "../../helper/clearAsyncStorage";
import commonStyles from "../../components/commonStyles";
import { fontNames } from "../../theme/fontFamily";
import CommonBookingCard from "../../components/CommonBookingCard";
import RenderEmpty from "../../components/RenderEmpty";

const limit = 8;

class PastBookings extends Component {
	state = {
		newBookings: [
			"https://st3.depositphotos.com/1662991/15593/i/1600/depositphotos_155935400-stock-photo-makeup-artist-in-beauty-salon.jpg",
			"https://st3.depositphotos.com/1662991/15593/i/1600/depositphotos_155935400-stock-photo-makeup-artist-in-beauty-salon.jpg",
			"https://st3.depositphotos.com/1662991/15593/i/1600/depositphotos_155935400-stock-photo-makeup-artist-in-beauty-salon.jpg",
			"https://st3.depositphotos.com/1662991/15593/i/1600/depositphotos_155935400-stock-photo-makeup-artist-in-beauty-salon.jpg"
		],
		pastArray: [],
		isLoading: true,
		refreshing: false,
		paginationLoader: false,
		loadingMore: false,
		hasMoreData: true
	};

	componentDidMount() {
		checkInternetAvailibility();
		setTimeout(() => {
			if (checkInternetAvailibility) {
				const url = `${API_BOOKING_LISTING}?listingType=Past&skip=0&limit=${limit}`;
				this.getBookingsApiHit(url);
			} else {
				this.toggleIsLoading();
				alert("No Internet");
			}
		}, 300);
	}

	toggleIsLoading = () => {
		this.setState(prevState => ({ isLoading: !prevState.isLoading }));
	};

	getBookingsApiHit = url => {
		const accessToken = this.props.userDataReducer.userData.accessToken;
		getApi(url, accessToken, this.getPastBookingsResponse);
	};

	getPastBookingsResponse = response => {
		console.log(response);
		if (response) {
			const statusCode = response.data.statusCode;
			if (statusCode == 200) {
				const { refreshing } = this.state;
				let data;
				const apiData = response.data.info.records;
				if (refreshing) {
					data = apiData;
				} else {
					data = [...this.state.pastArray, ...apiData];
				}
				this.setState({
					pastArray: data,
					refreshing: false,
					isLoading: false,
					loadingMore: false,
					hasMoreData: apiData.length > limit ? true : false
				});
			}else if (statusCode == 401) {
				this.setState({ isLoading: false, loadingMore: false });
				clearAsyncStorage();
				this.props.navigation.navigate('signOut');
				setTimeout(() => {
					this.props.actions.clearReduxValues();
					alert("Session Expired, please log in again to continue");
				}, 600);
			} else {
				this.setState({ isLoading: false });
				alert(response.data.message);
			}
		} else {
		}
	};

	_onRefreshing = () => {
		if (checkInternetAvailibility) {
			this.setState({ refreshing: true });
			const url = `${API_BOOKING_LISTING}?listingType=Past&skip=0&limit=${limit}`;
			this.getBookingsApiHit(url, this.getPastBookingsResponse);
			return;
		} else {
			this.setState({ isLoading: false, refreshing: false });
		}
	};

	renderFooterComponent = () => {
		const { width, height } = Dimensions.get("window");
		const { pastArray, paginationLoader, loadingMore } = this.state;
		console.log(pastArray, "the upcomming array");
		console.log(paginationLoader, "the pagination loader");
		console.log(loadingMore, "the loading moere");
		if (pastArray.length > 0 && paginationLoader === true) {
			return (
				<TouchableOpacity
					style={commonStyles.loadMoreButton}
					hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
					onPress={this._loadMore}
				>
					<Text style={{ ...commonStyles.bottomButtonText, color: colors.black }}>Load More</Text>
				</TouchableOpacity>
			);
		} else if (loadingMore === true && pastArray.length > 0) {
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
		let { data, skip, pastArray } = this.state;

		if (checkInternetAvailibility()) {
			this.setState({ paginationLoader: false, loadingMore: true });
			const url = `${API_BOOKING_LISTING}?listingType=Past&skip=${pastArray.length}&limit=4`;
			this.getBookingsApiHit(url);
		}
	};

	_onEndReached = () => {
		const { loadingMore, pastArray } = this.state;
		if (pastArray.length >= 3 && !loadingMore) {
			console.warn("called true");
			this.setState({ paginationLoader: true });
		}
	};

	renderPastItem = data => {
		const { item, index } = data;
		const {flexDirection,userData}=this.props.userDataReducer;
		const positionRightToggle = flexDirection == "row" ? "Right" : "Left";
		const positionLeftToggle = flexDirection == "row" ? "Left" : "Right";
		let loc=item.serviceType=="LOCAL"?userData.addressDetails.address:item.userAddress.address;

		return (
			<CommonBookingCard data={item} loc={loc} success statusText="Cancelled" flexDirection={flexDirection} />
		);
	};

	render() {
		const { refreshing, isLoading,hasMoreData } = this.state;
		console.log(isLoading, "hte isloading avalue");
		return (
			<>
				<FlatList
					style={{ paddingTop: moderateScale(8) }}
					data={this.state.pastArray}
					renderItem={this.renderPastItem}
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
					ListEmptyComponent={isLoading || refreshing ? null : RenderEmpty}
					onEndReachedThreshold={0.01}
					onEndReached={this._onEndReached}
					ListFooterComponent={hasMoreData && this.renderFooterComponent}
				/>

				{isLoading == true ? (
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
)(PastBookings);
