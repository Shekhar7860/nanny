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
	FlatList,
	Platform
} from "react-native";

//Third party packages
import { verticalScale, moderateScale, scale } from "react-native-size-matters";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Bubbles from "react-native-loader/src/Bubbles";
import { StackActions } from "react-navigation";
import { Dropdown } from "react-native-material-dropdown";
import _ from "lodash";

//Redux Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserDataAction from "../../actions/userDataActions";
import ScrollableTabView, { DefaultTabBar } from "react-native-scrollable-tab-view";

//Common components and helper methods
import styles from "./MyBookingsStyle";
import colors from "../../theme/colors";
import { Images } from "../../components/ImagesPath";
import { checkInternetAvailibility } from "../../helper/CheckInternet";
import strings from "../../constants/LocalizedStrings";
import { postApi, getApi } from "../../config/HitApis";
import { API_REGISTER, API_BOOKING_LISTING } from "../../config/Urls";
import Header from "../../components/Header";
import clearAsyncStorage from "../../helper/clearAsyncStorage";
import commonStyles from "../../components/commonStyles";
import CustomRightNotification from "../../components/CustomRightNotification";
import Tab from "./Tab";
import { fontNames } from "../../theme/fontFamily";

import OnGoingBooking from "../OnGoingBooking/OnGoingBooking";
import PastBookings from "../PastBookings/PastBookings";
import NewBookings from "../NewBookings/NewBooking";

class MyBookings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			newBookings: [
				"https://st3.depositphotos.com/1662991/15593/i/1600/depositphotos_155935400-stock-photo-makeup-artist-in-beauty-salon.jpg",
				"https://st3.depositphotos.com/1662991/15593/i/1600/depositphotos_155935400-stock-photo-makeup-artist-in-beauty-salon.jpg",
				"https://st3.depositphotos.com/1662991/15593/i/1600/depositphotos_155935400-stock-photo-makeup-artist-in-beauty-salon.jpg",
				"https://st3.depositphotos.com/1662991/15593/i/1600/depositphotos_155935400-stock-photo-makeup-artist-in-beauty-salon.jpg"
			],
			isVisible: false,
			time: [
				{
					label: "Long Distance",
					value: "Long Distance"
				},
				{
					label: "Busy",
					value: "Busy"
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
			tab: 0,
			upComingArray: [],
			onGoingArray: [],
			pastArray: [],
			refreshingUpcoming: false,
			refreshingPast: false,
			refreshingOngoing: false
		};
	}

	static navigationOptions = {
		header: null
	};

	_onChangeTab = ({ i }) => {
		this.setState({ tab: i });

		// this.navbarToggle("shown");
	};

	toggleModal = () => {
		this.setState(prevState => {
			return {
				isVisible: !prevState.isVisible
			};
		});
	};

	//***************Header contents**************** */
	renderContents() {
		return (
			<View style={styles.container}>
				<Text>My Bookings</Text>
				{this.state.isLoading == true ? (
					<View style={styles.loader}>
						<Bubbles size={14} color={colors.tabsActiveColor} />
					</View>
				) : null}
			</View>
		);
	}

	_onChange = () => {};

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

	toggleIsLoading = () => {
		this.setState(prevState => ({ isLoading: !prevState.isLoading }));
	};

	customTabChange = ()=>{
		this.tabView.goToPage(1);
	}

	render() {
		const flexDirection = "row";
		const positionRightToggle = flexDirection == "row" ? "Right" : "Left";
		const positionLeftToggle = flexDirection == "row" ? "Left" : "Right";
		const { isVisible, } = this.state;

		return (
			<SafeAreaView style={{ flex: 1 }}>
				<StatusBar backgroundColor={colors.black} barStyle="default" />
				<Header
					title={strings.myBookings}
					headerStyle={styles.headerStyle}
					flexDirection={flexDirection}
					iconLeft={Images.small_logo}
					customRight={() => (
						<CustomRightNotification
							onPress={() => {
								this.props.navigation.navigate("bookingsNotificationsListing",{isFromHome:false,isFromBookings:true})
							}}
							// value="10"
						/>
					)}
				/>
				<ScrollableTabView
					tabBarUnderlineStyle={{ backgroundColor: colors.tabsActiveColor }}
					keyboardShouldPersistTaps="always"
					onChangeTab={this._onChangeTab}
					page={this.state.tab}
					tabBarTextStyle={{
						width:"100%",
						textAlign:"center"
					}}
					ref={(tabView) => { this.tabView = tabView}}
					renderTabBar={() => (
						<Tab
							// newNotifications="10"
							style={{ ...styles.tabBarContainer, borderWidth: Platform.OS == "ios" ? 0 : 2 }}
						/>
					)}
				>
					{/* <View style={{ flex: 1 }} tabLabel="New">
						<NewBookings onPressTabChange={this.customTabChange} navigation={this.props.navigation} tab={this.state.tab} />
					</View> */}

					<View style={{ flex: 1 }} tabLabel="On going">
						<OnGoingBooking navigation={this.props.navigation} tab={this.state.tab} />
					</View>
					<View style={{ flex: 1 }} tabLabel="Past">
						<PastBookings navigation={this.props.navigation} tab={this.state.tab} />
					</View>
				</ScrollableTabView>
				{this.state.isLoading == true ? (
					<View style={commonStyles.loader}>
						<Bubbles size={14} color={colors.tabsActiveColor} />
					</View>
				) : null}
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
)(MyBookings);
