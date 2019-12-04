import React, { Component, Fragment } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Alert,
	Button,
	ScrollView,
	Image,
	AsyncStorage,
	SafeAreaView
} from "react-native";

//Third party imports
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from "react-native-table-component";
import { scale, verticalScale, moderateScale, ScaledSheet } from "react-native-size-matters";
import _ from "lodash";
import moment from "moment";
import Bubbles from "react-native-loader/src/Bubbles";

//Redux Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserDataAction from "../../actions/userDataActions";

//Common components and helper methods
import { Images } from "../../components/ImagesPath";
import colors from "../../theme/colors";
import { checkInternetAvailibility } from "../../helper/CheckInternet";
import { postApi, putApi } from "../../config/HitApis";
import { widthPercentageToDP } from "../../helper/deviceDimensions";
import { API_SETTINGS } from "../../config/Urls";
import styles from "./AvailabilityStyle";
import { fontNames } from "../../theme/fontFamily";
import strings from "../../constants/LocalizedStrings";
import clearAsyncStorage from "../../helper/clearAsyncStorage";

class Availablity extends Component {
	state = {
		tableHead: ["Head", "Head2", "Head3", "Head4"],
		tableTitle: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
		tableData: [
			["10", "10", "10", "10", "10", "10", "10"],
			["11", "11", "11", "11", "11", "11", "11"],
			["12", "12", "12", "12", "12", "12", "12"],
			["01", "01", "01", "01", "01", "01", "01"],
			["02", "02", "02", "02", "02", "02", "02"],
			["03", "03", "03", "03", "03", "03", "03"],
			["04", "04", "04", "04", "04", "04", "16"]
		],
		selectedData: {},
		data: {},
		isLoading: false
	};

	componentDidMount() {
		checkInternetAvailibility();
		let data = {};
		const availData = this.props.userDataReducer.userData.availabilitySlots;
		_.forEach(availData, (val, key) => {
			data[key] = val.slots;
		});
		this.setState({ data });
	}

	_onPress = (key, val) => {
		this.addSelected(key, val);
	};

	onSave = () => {
		const apiData = {};
		_.forEach(this.state.data, (val, key) => {
			apiData[key] = { slots: val };
		});
		this.setState({ isLoading: true });
		putApi(
			{ availability: apiData },
			API_SETTINGS,
			null,
			this.props.userDataReducer.userData.accessToken,
			this.availabilityUpdateResponse
		);

		// console.log(apiData,'the apiData to send at server');
		// console.log(this.state.data, "the data to send at server");
	};

	availabilityUpdateResponse = response => {

		console.log(response,'hte response')
		if (response) {
			const statusCode = response.data.statusCode;
			if (statusCode == 200 || statusCode == 201) {
				Alert.alert("Success", "Slots updated successfully");
				console.log(response.data.info, "api data repsonse value");
				const availabilitySlots = response.data.info.availabilitySlots;
				AsyncStorage.getItem("userData").then(res => {
					const userData = JSON.parse(res);
					userData.availabilitySlots = availabilitySlots;
					AsyncStorage.setItem("userData", JSON.stringify(userData));
				});
				this.props.actions.updateAvaiability(availabilitySlots);
				this.props.navigation.goBack(null);
				return;
				// console.log(response, "the repsone from the server which i get is ");
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
				this.setState({ isLoading: false });
				alert(response.data.message);
				return;
			}
		}
		alert("Network Error");
	};

	minutesToHoursConvertor = m => {
		return moment
			.utc()
			.startOf("day")
			.add(m, "minutes")
			.format("hh:mm A");
	};
	addSelected = (key, val) => {
		let data = { ...this.state.data };
		let keyArray = [...data[key]];
		const selectedItemIndex = _.findIndex(keyArray, val);
		if (selectedItemIndex !== -1) {
			const selectedItem = { ...keyArray[selectedItemIndex] };
			selectedItem.availability = !selectedItem.availability;
			keyArray[selectedItemIndex] = selectedItem;
		}

		data[key] = keyArray;
		this.setState({ data });

		return;
	};

	renderCell = (key, data) => {
		const { flexDirection } = this.props.userDataReducer;
		const positionRightToggle = flexDirection == "row" ? "Right" : "Left";
		const keyArray = this.state.data[key];
		const selectedItemIndex = _.findIndex(keyArray, data);
		const availability = keyArray[selectedItemIndex].availability;

		return (
			<TouchableOpacity activeOpacity={1} onPress={() => this._onPress(key, data)}>
				<View style={{ borderRadius: 2, [`margin${positionRightToggle}`]: moderateScale(35.33) }}>
					<Text style={{ ...styles.btnText, color: availability ? colors.tabsActiveColor : colors.unAvailabilityColor }}>
						{this.minutesToHoursConvertor(data.time)}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};
	render() {
		const { flexDirection } = this.props.userDataReducer;
		// const flexDirection="row-reverse"

		const positionRightToggle = flexDirection == "row" ? "Right" : "Left";
		const positionLeftToggle = flexDirection == "row" ? "Left" : "Right";
		const state = this.state;

		return (
			<SafeAreaView style={styles.container}>
				<View style={{ ...styles.header, flexDirection: flexDirection }}>
					<TouchableOpacity
						hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
						onPress={() => {
							this.props.navigation.goBack(null);
						}}
					>
						<Image
							style={{ transform: [{ scaleX: flexDirection === "row" ? 1 : -1 }] }}
							source={Images.back}
						/>
					</TouchableOpacity>

					<Text style={{ fontSize: verticalScale(18), fontFamily: fontNames.boldFont }}>
						{strings.availability}
					</Text>

					<View />
				</View>
				{this.state.isLoading ? (
					<View style={{ ...styles.loader, backgroundColor: colors.white }}>
						<Bubbles size={14} color={colors.tabsActiveColor} />
					</View>
				) : (
					<Fragment>
						<View style={{ flex: 1, backgroundColor: colors.white }}>
							<View style={{ flex: 1, flexDirection: flexDirection }}>
								<Col
									borderStyle={{ borderColor: "transparent" }}
									data={state.tableTitle}
									style={{
										...styles.title,
										paddingTop: moderateScale(17),
										[`margin${positionRightToggle}`]: widthPercentageToDP(6.39),
										[`border${positionRightToggle}Width`]: moderateScale(1),
										[`padding${positionLeftToggle}`]: widthPercentageToDP(4.44),
										[`padding${positionRightToggle}`]: widthPercentageToDP(3.06)
									}}
									textStyle={{
										color: colors.black,
										lineHeight: moderateScale(56),
										fontSize: moderateScale(14),
										fontFamily: fontNames.boldFont
									}}
								/>
								<View style={{ width: widthPercentageToDP(75.55), paddingTop: moderateScale(17) }}>
									<ScrollView horizontal={true} style={{ flex: 1 }}>
										<TableWrapper
											borderStyle={{ borderColor: "transparent" }}
											style={{ flexDirection: "column" }}
										>
											{_.map(state.data, (rowData, index) => (
												<TableWrapper key={index} style={{ ...styles.row, flexDirection }}>
													{rowData.map((cellData, cellIndex) => (
														<Cell
															key={cellIndex}
															data={this.renderCell(index, cellData)}
															textStyle={styles.text}
														/>
													))}
												</TableWrapper>
											))}
										</TableWrapper>
									</ScrollView>
								</View>
							</View>
							<View
								style={{
									marginBottom: moderateScale(77),
									marginTop: moderateScale(16),
									height: moderateScale(20),
									marginLeft: scale(65),
									flexDirection
								}}
							>
								<View style={{ [`margin${positionRightToggle}`]: scale(9) }}>
									<Image source={Images.available} />
								</View>
								<Text style={styles.headerLabel}>{strings.available}</Text>

								<View
									style={{
										[`margin${positionRightToggle}`]: scale(9),
										[`margin${positionLeftToggle}`]: scale(42)
									}}
								>
									<Image source={Images.notAvailable} />
								</View>

								<Text style={styles.headerLabel}>{strings.notAvailable}</Text>
							</View>
						</View>

						<TouchableOpacity
							style={{
								height: verticalScale(48),
								backgroundColor: colors.tabsActiveColor,
								alignItems: "center",
								justifyContent: "center"
							}}
							onPress={this.onSave}
						>
							<Text
								style={{
									color: "white",
									fontSize: verticalScale(12),
									textTransform: "uppercase",
									fontFamily: fontNames.boldFont,
									letterSpacing: scale(2)
								}}
							>
								{strings.save}
							</Text>
						</TouchableOpacity>
					</Fragment>
				)}
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
)(Availablity);
