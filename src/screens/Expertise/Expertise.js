import React, { Component } from "react";
import {
	View,
	Text,
	SafeAreaView,
	TextInput,
	Image,
	StyleSheet,
	TouchableOpacity,
	FlatList,
	Alert
} from "react-native";

//Redux Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserDataAction from "../../actions/userDataActions";

//Third party packages
import CountryPicker from "react-native-country-picker-modal";
import { moderateScale, verticalScale, scale, ScaledSheet } from "react-native-size-matters";
import Bubbles from "react-native-loader/src/Bubbles";
import Collapsible from "react-native-collapsible";
import { Dropdown } from "react-native-material-dropdown";
import _ from "lodash";

//Common components and helper methods

import { fontNames } from "../../theme/fontFamily";
import colors from "../../theme/colors";
import { checkInternetAvailibility } from "../../helper/CheckInternet";
import strings from "../../constants/LocalizedStrings";
import { postApi, getApi, putApi,deleteApi } from "../../config/HitApis";
import { API_REGISTER, API_GET_STYLIST_SERVICES, API_STYLIST_SERVICE,API_DELETE_SERVICE } from "../../config/Urls";
import Header from "../../components/Header";
import { Images } from "../../components/ImagesPath";
import commonStyles from "../../components/commonStyles";
import styles from "./ExpertiseStyle";
import clearAsyncStorage from "../../helper/clearAsyncStorage";

class AddExpertise extends Component {
	state = {
		isLoading: true,
		expertiseList: [],
		searchText: "",
		time: [
			{
				label: "30 mins",
				value: "30"
			},
			{
				label: "45 mins",
				value: "45"
			},
			{
				label: "60 mins",
				value: "60"
			},
			{
				label: "75 mins",
				value: "75"
			}
		]
	};

	getServicesApiHit = url => {
		console.log(url, "hte url valuel");
		const accessToken = this.props.userDataReducer.userData.accessToken;
		if (checkInternetAvailibility()) {
			getApi(url, accessToken, this.getServicesResponse);
			return;
		}
		this.setState({ isLoading: false });
		alert("No Internet");
	};
	componentDidMount() {
		checkInternetAvailibility();
		setTimeout(() => {
			this.getServicesApiHit(API_GET_STYLIST_SERVICES);
		}, 400);
	}

	getServicesResponse = response => {
		console.log(response, "the response");
		if (response) {
			const statusCode = response.data.statusCode;
			if (statusCode === 200 || statusCode === 201) {
				const data = response.data.info;
				console.log(data, "the data");
				const expertiseList = data.records.map(val => ({
					...val,
					editable: false,
					updatedData: { duration: val.duration, price: val.price }
				}));
				this.setState({ expertiseList, isLoading: false });
				return;
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
		this.setState({ isLoading: false });
		console.log(response, "the response i get from server");
	};

	_onChange = (index, key) => val => {
		if (key == "price") {
			val = val.replace(/[^0-9]/g, "");
		}
		const expertiseList = _.cloneDeep(this.state.expertiseList);
		expertiseList[index].updatedData[key] = val;
		this.setState({ expertiseList });
		// console.log(val, "the value");
		// const apiData = { ...this.state.apiData };
		// let updatedData = { ...apiData[id] };
		// updatedData[key] = val;
		// apiData[id] = updatedData;
		// this.setState({ apiData });
	};

	isValidData = price => {
		if (price.trim().length < 1) {
			Alert.alert("Error", "Please enter price");
			return false;
		}else{
			if(isNaN(price)){
				Alert.alert("Error", "Please enter valid price");
			}
			else if(price<1){
				Alert.alert("Error", "Price should be greater than 0");
				return false;
			}
			
		}
		return true;
	};

	updateService = index => () => {
		const data = this.state.expertiseList[index];
		const updatedData = data.updatedData;
		console.log(data, "the data");
		// console.log(data.serviceCategoryId._id,'the updata');
		// return;
		let formData = new FormData();
		if (this.isValidData(updatedData.price + "")) {
			formData.append("price", updatedData.price);
			formData.append("duration", updatedData.duration);
			formData.append("serviceId", data._id);
			formData.append("serviceCategoryId", data.serviceCategoryId._id);
			console.log(data.id, "the id has a value");
			console.log(data._id, "the data under vaue");
			this.setState({ isLoading: true });
			putApi(
				formData,
				API_STYLIST_SERVICE,
				null,
				this.props.userDataReducer.userData.accessToken,
				this.updateServiceApiResponse(index)
			);
		}
	};

	updateServiceApiResponse = index => response => {
		console.log(response, "the response i get is");
		if (response !== null) {
			const data = (response.data && response.data.info) || null;
			const statusCode = response.data.statusCode;
			if (statusCode === 200 || statusCode === 201) {
				this.setState({ isLoading: false });
				const success = true;
				this.closeCollapsable(index)(success);
				alert("Service Update Successfully");
				return;
			} else if (statusCode == 401) {
				clearAsyncStorage();
				this.props.navigation.navigate("signOut");
				setTimeout(() => {
					this.props.actions.clearReduxValues();
					alert("Session Expired, please log in again to continue");
				}, 600);
				this.setState({ isLoading: false });
				return;
			} else {
				console.log("the elese Parat");
				this.closeCollapsable(index)();
				this.setState({ isLoading: false });
				alert(response.data.message);
				return;
			}
		} else {
			this.setState({ isLoading: false });
			alert("Network Error");
		}
	};
	deleteService = index => () => {
		this.setState({ isLoading: true });
		const id= this.state.expertiseList[index]._id
		const formData = new FormData();
		formData.append("serviceId", id);
		deleteApi(
			formData,
			`${API_DELETE_SERVICE}`,
			this.props.userDataReducer.userData.accessToken,
			this.deleteServiceResponse(index)
		);
	};

	deleteServiceModalToggle = index => () => {
		Alert.alert("Delete Service", "Are you sure you want to delete this service?", [
			{ text: "Yes", onPress: this.deleteService(index) },
			{ text: "No", style: "cancel" }
		]);
	
	};

	deleteServiceResponse = index => response => {
	
		console.log(response,'the respnse i get from server');
		const statusCode = response.data.statusCode;
		if (response !== null) {
			if (statusCode === 200 || statusCode === 201) {
				// const savedServices = [...this.state.savedServices];
				// _.remove(savedServices, { _id });
				// this.props.actions.updateSavedServices(savedServices);
				this.getServicesApiHit(API_GET_STYLIST_SERVICES);
				this.setState({  isNotCollapsed: "" });
				return;
			} else if (statusCode == 401) {
				clearAsyncStorage();
				this.props.navigation.navigate("signOut");
				setTimeout(() => {
					this.props.actions.clearReduxValues();
					alert("Session Expired, please log in again to continue");
				}, 600);
				this.setState({ isLoading: false });
				return;
			} else {
				alert(response.data.message);
				this.setState({ isLoading: false });
			}
		} else {
			this.setState({ isLoading: false });
			alert("Network Error");
		}
	};

	closeCollapsable = index => success => {
		const expertiseList = _.map(this.state.expertiseList, (service, serviceIndex) => {
			service.editable = false;

			if (serviceIndex == index) {
				if (success == true) {
					service.price = service.updatedData.price;
					service.duration = service.updatedData.duration;
				} else {
					service.updatedData.price = service.price;
					service.updatedData.duration = service.duration;
					// this.dropdownRef.onPress(this._onChange(index, "duration")(service.updatedData.duration))
				}
			}
			return service;
		});
		this.setState({ expertiseList });
	};

	renderItem = (data, key) => {
		const { item, index } = data;
		console.log(item, "the is selected value");
		console.log(item.price, "the item price");
		const { flexDirection, textAlign } = this.props.userDataReducer;
		const marginKey = flexDirection == "row" ? "marginRight" : "marginLeft";

		return (
			<>
				<TouchableOpacity
					style={{ ...styles.touchableItem}}
					
				>
					<View
						style={{
							flexDirection,
							justifyContent: "space-between",
							paddingTop: moderateScale(8),
							alignItems:'center'
						}}
					>
						<Text
							style={{
								fontSize: moderateScale(16),
								lineHeight: moderateScale(16),
								color: colors.black,
								textAlign
							}}
						>
							{item.serviceCategoryId.name}
						</Text>
						<View style={{flexDirection}}>
						{/* <TouchableOpacity style={{padding:moderateScale(5),[marginKey]:moderateScale(20)}} onPress={this.toggleExpertise(index)}>
							<Image source={Images.edit} />
						</TouchableOpacity> */}
						<TouchableOpacity hitSlop={{top:5,bottom:5,left:5,right:5}} onPress={this.deleteServiceModalToggle(index)}>
							<Image source={Images.delete} />
						</TouchableOpacity>
						
						</View>
						
					</View>
					<View style={{ flexDirection }}>
						<Text
							style={{
								...styles.itemTextInput,
								[marginKey]: moderateScale(19),
								opacity: moderateScale(0.6),
								textAlign: flexDirection == "row" ? "left" : "right"
							}}
						>
							{"DURATION: " + item.serviceCategoryId.duration + "MIN"}
						</Text>

						<Text
							style={{
								...styles.itemTextInput,
								opacity: moderateScale(0.6),
								textAlign: flexDirection == "row" ? "left" : "right"
							}}
						>
							{"PRICE: $" + item.serviceCategoryId.price + ".00"}
						</Text>
					</View>
				</TouchableOpacity>
				<Collapsible collapsed={!item.editable}>
					<View style={{ ...styles.collapsableContainer, flexDirection }}>
						<View style={{ flexDirection, marginTop: moderateScale(21) }}>
							<View
								style={{
									marginLeft: moderateScale(14),
									width: scale(156),
									marginRight: moderateScale(12)
								}}
							>
								<Text style={{ ...styles.collapsableLable, textAlign }}>PRICE</Text>
								<View
									style={{
										flexDirection,
										marginTop: moderateScale(10),
										height: moderateScale(24),
										alignItems: "center"
									}}
								>
									<Text style={{ ...styles.collapsableBoldText }}>$ </Text>
									<TextInput
									  	selectionColor={colors.white}
										keyboardType="numbers-and-punctuation"
										value={"" + item.updatedData.price}
										onChangeText={this._onChange(index, "price")}
										maxLength={6}
										style={{ ...styles.collapsableBoldText, flex: 1 }}
									/>
								</View>

								<TouchableOpacity
									onPress={this.closeCollapsable(index)}
									style={{ ...styles.collapsableButtonA, width: scale(156) }}
								>
									<Text style={styles.collapsableButtonText}>{strings.cancel}</Text>
								</TouchableOpacity>
							</View>
							<View>
								<Text style={{ ...styles.collapsableLable, textAlign }}>{strings.duration}</Text>
								<View style={{ ...styles.collapsableTimeContainer, flexDirection }}>
									<Dropdown
										ref={ref => (this.dropdownRef = ref)}
										containerStyle={{
											height: moderateScale(24),
											width: scale(156)
										}}
										inputContainerStyle={{
											borderBottomColor: "transparent"
										}}
										style={{
											color: colors.white,
											fontSize: moderateScale(20),
											fontWeight: "bold"
										}}
										pickerStyle={{
											paddingHorizontal: 10
										}}
										value={item.updatedData.duration + " mins"}
										onChangeText={this._onChange(index, "duration")}
										dropdownOffset={{ top: 0, left: 0 }}
										dropdownMargins={{ min: 0, max: 0 }}
										data={this.state.time}
									/>
								</View>

								<TouchableOpacity
									style={styles.collapsableButtonB}
									onPress={this.updateService(index)}
								>
									<Text style={{ ...styles.collapsableButtonText, color: colors.tabsActiveColor }}>
										{strings.save}
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Collapsible>
			</>
		);
	};

	toggleExpertise = index => () => {
		const expertiseList = _.map(this.state.expertiseList, (service, serviceIndex) => {
			if (serviceIndex == index) {
				service.editable = !this.state.expertiseList[index].editable;
			} else {
				service.editable = false;
			}
			return service;
		});
		this.setState({ expertiseList });
		// let item = expertiseList[index]
		// this.setState(prevState => {
		// 	item.editable = !prevState.expertiseList[index].editable;
		// 	expertiseList[index] = item;
		// 	return {
		// 		expertiseList
		// 	};
		// });
	};

	onSearchChange = searchText => {
		this.setState({ searchText }, () => {
			if (this.searchTimeout) {
				clearTimeout(this.searchTimeout);
			}
			this.searchTimeout = setTimeout(this.searchApiHit, 400);
		});
	};
	searchApiHit = () => {
		const searchText = this.state.searchText;
		this.setState({ isLoading: true }, () => {
			if (searchText.trim() !== "") {
				this.getServicesApiHit(`${API_GET_STYLIST_SERVICES}?search=${searchText}`);
				return;
			}
			this.getServicesApiHit(API_GET_STYLIST_SERVICES);
		});
	};

	onSave = () => {
		this.props.actions.updateExpertiseList(this.state.expertiseList);
		this.props.navigation.goBack(null);
	};

	renderEmpty = () => {
		if (this.state.isLoading) {
			return;
		}
		return (
			<View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
				<Image source={Images.noDataFound} />
			</View>
		);
	};

	render() {
		console.log(this.props, "the props to be updated");
		const { flexDirection, textAlign } = this.props.userDataReducer;
		const positionRightToggle = flexDirection == "row" ? "Right" : "Left";
		const positionLeftToggle = flexDirection == "row" ? "Left" : "Right";
		console.log(this.state,'the staet')
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<Header
					onPressLeft={() => this.props.navigation.goBack(null)}
					title="Expertise"
					headerStyle={commonStyles.headerWithoutShadowContainer}
					flexDirection={flexDirection}
					iconLeft={Images.back}
					// textRight={strings.save}
					textRightStyle={styles.headerRightText}
					// onPressRight={this.onSave}
				/>

				<View style={{ ...commonStyles.searchContainer, flexDirection }}>
					<Image source={Images.searchIcon} />
					<TextInput
					  selectionColor={colors.tabsActiveColor}
						style={{
							...commonStyles.searchTextInput,
							[`padding${positionLeftToggle}`]: moderateScale(6),
							textAlign: positionLeftToggle.toLowerCase()
						}}
						value={this.state.searchText}
						onChangeText={this.onSearchChange}
						placeholder="Search"
					/>
				</View>
				<Text style={{ ...styles.servicesText, textAlign }}>{strings.services}</Text>
				<View style={{ flex: 1 }}>
					<FlatList
						style={{ flex: 1 }}
						showsVerticalScrollIndicator={false}
						bounces={false}
						keyExtractor={(item, index) => index.toString()}
						data={this.state.expertiseList}
						renderItem={this.renderItem}
						ListFooterComponent={<View style={{ padding: moderateScale(10) }} />}
						ListEmptyComponent={this.state.isLoading ? null : this.renderEmpty}
					/>
				</View>
				{this.state.isLoading == true ? (
					<View style={{ ...commonStyles.loader, backgroundColor: "rgba(0,0,0,0.1)", zIndex: 99 }}>
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
)(AddExpertise);
