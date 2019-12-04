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
	RefreshControl,
	Dimensions,
	AsyncStorage,
	SafeAreaView
} from "react-native";

//Third party packages
import { verticalScale, moderateScale, scale } from "react-native-size-matters";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Bubbles from "react-native-loader/src/Bubbles";
import Header from "../../components/Header";
import { Dropdown } from "react-native-material-dropdown";
import FastImage from "react-native-fast-image";
import _ from "lodash";
import moment from "moment";
import { RadioGroup, RadioButton } from "react-native-flexi-radio-button";

//Redux Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserDataAction from "../../actions/userDataActions";

//Common components and helper methods
import styles from "./ServiceLocationStyle";
import colors from "../../theme/colors";
import { Images } from "../../components/ImagesPath";
import { checkInternetAvailibility } from "../../helper/CheckInternet";
import strings from "../../constants/LocalizedStrings";
import { postApi, putApi, getApi } from "../../config/HitApis";
import { API_UPDATE_BOOKING_STATUS, API_SETTINGS } from "../../config/Urls";
import clearAsyncStorage from "../../helper/clearAsyncStorage";
import commonStyles from "../../components/commonStyles";
import { fontNames } from "../../theme/fontFamily";

class ServiceLocation extends Component {
	constructor(props) {
		super(props);
		const { userData } = this.props.userDataReducer;
		console.log(this.getServiceIndex(userData.serviceType));
		console.log(userData.serviceType, "hte service type");
		const selectedIndex = this.getServiceIndex(userData.serviceType);
		this.state = {
			selectedIndex: selectedIndex,
			serviceType: userData.serviceType
		};
	}
	componentDidMount() {
		checkInternetAvailibility();
	}
	onRadioSelect = (index, value) => {
		this.setState({
			selectedIndex: index,
			serviceType: value
		});
		console.log(index, value);
	};

	getServiceIndex = serviceType => {
		if (serviceType === "HOTEL") {
			return 0;
		} else if (serviceType === "HOME") {
			return 1;
		} else if (serviceType === "BOTH") {
			return 2;
		} else {
		}
	};

	onSubmit = () => {
		if (checkInternetAvailibility()) {
			this.setState({ isLoading: true });
			const { serviceType } = this.state;
			putApi(
				{ serviceType },
				API_SETTINGS,
				null,
				this.props.userDataReducer.userData.accessToken,
				this.updateServiceLocationResponse
			);
		} else {
			alert("No Internet");
		}
	};

	updateServiceLocationResponse = response => {
		console.log(response, "the response i get from server is as follow");
		if (response) {
			const statusCode = response.data.statusCode;
			if (statusCode == 200 || statusCode == 201) {
				this.setState({ isLoading: false });
				Alert.alert("Success", "Changes updated successfully");
				// console.log(response.data.info._doc, "api data repsonse value");
				const serviceType = response.data.info.serviceType;
				AsyncStorage.getItem("userData").then(res => {
					const userData = JSON.parse(res);
					userData.serviceType = serviceType;
					AsyncStorage.setItem("userData", JSON.stringify(userData));
				});
				this.props.actions.updateServiceType(serviceType);
				// this.setState({ isLoading: false });
				return;
				// console.log(response, "the repsone from the server which i get is ");
			} else if (statusCode == 401) {
				this.setState({ isLoading: false });
				clearAsyncStorage();
				this.props.navigation.navigate("signOut");
				setTimeout(() => {
					this.props.actions.clearReduxValues();
					alert("Session Expired, please log in again to continue");
				}, 500);

				return;
			} else {
				this.setState({ isLoading: false });
				alert(response.data.message);
				return;
			}
		} else {
			alert("Network Error");
		}
	};
	render() {
		const { flexDirection, textAlign, userData } = this.props.userDataReducer;
		console.log(this.state.serviceType, "the service type has a value");
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<Header
					flexDirection={flexDirection}
					title="Service Location"
					iconLeft={Images.back}
					iconRight={Images.small_logo}
					onPressLeft={() => this.props.navigation.goBack(null)}
				/>
				<View style={{ marginHorizontal: 16, marginTop: moderateScale(32) }}>
					<Text
						style={{
							...commonStyles.formText,
							fontSize: moderateScale(16),
							lineHeight: moderateScale(25),
							textAlignVertical: "center"
						}}
					>
						Select an option where you want to provide the service.
					</Text>
				</View>

				<RadioGroup
					size={24}
					thickness={2}
					color={colors.tabsActiveColor}
					selectedIndex={this.state.selectedIndex}
					style={{
						marginVertical: moderateScale(16),
						marginHorizontal: 16
					}}
					onSelect={this.onRadioSelect}
				>
					<RadioButton value={"HOTEL"}>
						<Text style={{ ...commonStyles.formText, color: colors.black }}>Hotel</Text>
					</RadioButton>

					<RadioButton value={"HOME"}>
						<Text style={{ ...commonStyles.formText, color: colors.black }}>Home</Text>
					</RadioButton>

					<RadioButton value={"BOTH"}>
						<Text style={{ ...commonStyles.formText, color: colors.black }}>
							Both at home and hotel
						</Text>
					</RadioButton>
				</RadioGroup>
				<TouchableOpacity onPress={this.onSubmit} style={{ ...commonStyles.bottomButton }}>
					<Text style={commonStyles.bottomButtonText}>Submit</Text>
				</TouchableOpacity>
				{this.state.isLoading == true ? (
					<View style={{ ...commonStyles.loader, zIndex: 100 }}>
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
)(ServiceLocation);
