import React, { Component, Fragment } from "react";
import {
	View,
	Text,
	SafeAreaView,
	TouchableOpacity,
	Image,
	StyleSheet,
	Alert,
	TextInput,
	ScrollView
} from "react-native";
import { scale, verticalScale, moderateScale, ScaledSheet } from "react-native-size-matters";

//Redux Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserDataAction from "../../actions/userDataActions";
//Third party packages

import Collapsible from "react-native-collapsible";
import { Dropdown } from "react-native-material-dropdown";
import { Bubbles } from "react-native-loader";
import _ from "lodash";

//Common components and helper methods
import { Images } from "../../components/ImagesPath";
import strings from "../../constants/LocalizedStrings";
import { API_GET_SERVICE_CATEGORY, API_ADD_SERVICE, API_DELETE_SERVICE } from "../../config/Urls";
import { postApi, getApi, deleteApi } from "../../config/HitApis";
import { checkInternetAvailibility } from "../../helper/CheckInternet";
import colors from "../../theme/colors";
import styles from "./AddCategoryServiceStyle";
import clearAsyncStorage from "../../helper/clearAsyncStorage";
import RenderEmpty from "../../components/RenderEmpty";
import { fontNames } from "../../theme/fontFamily";

class AddCategory extends Component {
	state = {
		collapsable: false,
		isNotCollapsed: "",
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
		],
		timeSelected: "45",
		serviceList: [],
		apiData: {},
		isLoading: true,
		savedServices: []
	};
	static navigationOptions = ({ navigation }) => {
		return {
			header: null
		};
	};

	getCategoryServicesApiCall = () => {
		const categoryId = this.props.navigation.getParam("categoryId");
		if (checkInternetAvailibility()) {
			getApi(
				`${API_GET_SERVICE_CATEGORY}?categoryId=${categoryId}`,
				this.props.userDataReducer.userData.accessToken,
				this.getServiceList
			);
			return;
		}
		alert("No Internet");
	};

	componentDidMount() {
		checkInternetAvailibility();
		setTimeout(() => {
			this.getCategoryServicesApiCall();
		}, 300);
	}

	getServiceList = response => {
		if (response !== null) {
			const data = response.data.info;
			const statusCode = response.data.statusCode;
			if (statusCode === 200 || statusCode === 201) {
				const serviceList = [...data.records];
				let apiData = {};
				serviceList.map(service => {
					apiData[service._id] = {
						price: "",
						duration: "30"
					};
				});

				console.log(serviceList, "the servicelist value");

				this.setState({ serviceList, apiData, isLoading: false });
				return;
			} else if (statusCode == 401) {
				clearAsyncStorage();
				this.props.navigation.navigate("signOut");
				setTimeout(() => {
					this.props.actions.clearReduxValues();
					alert("Session Expired, please log in again to continue");
				}, 500);
				this.setState({ isLoading: false });
			} else {
				this.setState({ isLoading: false });
				alert(response.data.message);
			}
			return;
		}
		alert("Network Error");
		this.setState({ isLoading: false });
	};

	headerBackPress = () => {
		this.props.navigation.goBack(null);
	};

	toggleCollapasable = id => () => {
		console.log(id);
		this.setState(prevState => {
			if (prevState.isNotCollapsed === id) {
				return { isNotCollapsed: "" };
			}
			return { isNotCollapsed: id };
		});
	};

	selectValueChange = id => (timeSelected, val, bal) => {
		const apiData = { ...this.state.apiData[id] };
		let updatedData = { ...apiData[id] };
		updatedData.duration = timeSelected;
		apiData[id] = updatedData;
		this.setState({ apiData });
	};

	_onChange = (id, key) => val => {
		if (key == "price") {
			val = val.replace(/[^0-9]/g, "");
		}
		console.log(val, "the value");
		console.log(key,'the id value');
		const apiData = { ...this.state.apiData };
		let updatedData = { ...apiData[id] };
		updatedData[key] = val;
		apiData[id] = updatedData;
		this.setState({ apiData });
	};

	convertMinsToHrsMins(mins) {
        // var mins = this.state.data.endMinutes - this.state.data.startMinutes
        let h = Math.floor(mins / 60);
        let m = mins % 60;
        h = h < 10 ? '0' + h : h;
        m = m < 10 ? '0' + m : m;
        return h + "hr" + " " + m + "min";
    }

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

	addService = (id, name,duration,price) => () => {
		const data = { ...this.state.apiData[id] };
		let formData = new FormData();
		formData.append("serviceCategoryId", id);
			console.log(id, "the id has a value");
			this.setState({ isLoading: true });
			postApi(
				formData,
				API_ADD_SERVICE,
				this.props.userDataReducer.userData.accessToken,
				this.addServiceResponse(name)
			);
	};

	// addServiceResponse = name => response => {
	//     console.log(response, "the response i get is");
	//     if (response !== null) {
	//         const data = (response.data && response.data.info) || null;
	//         const statusCode = response.data.statusCode;
	//         if (statusCode === 200 || statusCode === 201) {
	//             const serviceList = [...this.state.serviceList];
	//             _.remove(serviceList, { _id: data.serviceCategoryId });
	//             const savedServices = [...this.state.savedServices];
	//             savedServices.push({ ...data, name });
	//             this.setState({ serviceList, savedServices,isLoading:false,isNotCollapsed:"" });
	//             return
	//         }
	//         alert(response.data.message);
	//         return;
	//     } else {
	//         this.setState({ isLoading: false });
	//         alert("Network Error");
	//     }
	// };

	addServiceResponse = name => response => {
		console.log(response, "the response i get is");
		if (response !== null) {
			const data = (response.data && response.data.info) || null;
			const statusCode = response.data.statusCode;
			if (statusCode === 200 || statusCode === 201) {
				const serviceList = [...this.state.serviceList];
				_.remove(serviceList, { _id: data.serviceCategoryId });
				const savedServices = [...this.state.savedServices];
				savedServices.push({ ...data, name });
				console.log(savedServices, "the services whaich are saved are as follow");
				console.log(this.props.navigation.getParam("categoryId"), "the category id");
				this.setState({ serviceList, savedServices, isLoading: false, isNotCollapsed: "" }, () => {
					this.props.actions.updateSavedServices(savedServices);
					// this.props.actions.updateCategoryServices(serviceList);
				});
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
				this.setState({ isLoading: false });
				alert(response.data.message);
				return;
			}
		} else {
			this.setState({ isLoading: false });
			alert("Network Error");
		}
	};
	deleteServiceResponse = _id => response => {
		console.log(this.state.savedServices);
		console.log(_id, "the id value");
		const statusCode = response.data.statusCode;
		if (response !== null) {
			if (statusCode === 200 || statusCode === 201) {
				const savedServices = [...this.state.savedServices];
				_.remove(savedServices, { _id });
				this.props.actions.updateSavedServices(savedServices);
				this.getCategoryServicesApiCall();
				this.setState({ savedServices, isNotCollapsed: "" });
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

	// deleteServiceResponse = _id => response => {
	// 	console.log(response,'the delete api response');
	//     console.log(this.state.savedServices);
	//     console.log(_id, "the id value");
	//     if (response !== null) {
	// 		const statusCode = response.data.statusCode;
	//         if (statusCode === 200 || statusCode === 201) {
	//             this.getCategoryServicesApiCall();
	//             const savedServices = [...this.state.savedServices];
	//             _.remove(savedServices, { _id });
	//             this.setState({ savedServices,isNotCollapsed:"" });
	//         }
	//         this.setState({ isLoading: false });
	//     } else {
	//         this.setState({ isLoading: false });
	//         alert("Network Error");
	//     }
	// };

	deleteService = id => () => {
		this.setState({ isLoading: true });
		const formData = new FormData();
		formData.append("serviceId", id);
		deleteApi(
			formData,
			`${API_DELETE_SERVICE}`,
			this.props.userDataReducer.userData.accessToken,
			this.deleteServiceResponse(id)
		);
	};

	deleteServiceModalToggle = id => () => {
		Alert.alert("Delete Service", "Are you sure you want to delete this service?", [
			{ text: "Yes", onPress: this.deleteService(id) },
			{ text: "No", style: "cancel" }
		]);
		console.log(id, "the id to be deleted");
	};

	render() {
		console.log(this.props.userDataReducer, "the usse data tie geotoi is");
		const { flexDirection, textAlign } = this.props.userDataReducer;
		const marginKey = flexDirection == "row" ? "marginRight" : "marginLeft";
		const { serviceList, isNotCollapsed, apiData, savedServices, isLoading } = this.state;
		const categoryId = this.props.navigation.getParam("categoryId");
		const parentId = this.props.userDataReducer.savedServices[0]
			? this.props.userDataReducer.savedServices[0].serviceParentCategoryId
			: "";
		console.log(categoryId, "the category id array");
		console.log(parentId, "the parent id");
		const renderSavedServices = categoryId == parentId;
		console.log(renderSavedServices, "the render saved services is");
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<View style={{ ...styles.header, flexDirection }}>
					<TouchableOpacity
						hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
						onPress={this.headerBackPress}
					>
						<Image
							style={{ transform: [{ scaleX: flexDirection === "row" ? 1 : -1 }] }}
							source={Images.back}
						/>
					</TouchableOpacity>

					<Text
						style={{ fontSize: moderateScale(18), color: colors.black, fontFamily: fontNames.boldFont }}
					>
						{this.props.navigation.getParam("title")}
					</Text>

					<Text onPress={this.headerBackPress} style={styles.headerRightText}>
						{strings.done}
					</Text>
				</View>
				{this.state.isLoading == true ? (
					<View style={styles.loader}>
						<Bubbles size={14} color={colors.tabsActiveColor} />
					</View>
				) : (
					<ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
						<View style={{ paddingTop: moderateScale(18) }}>
							{
								this.state.savedServices.map(value => (
									<TouchableOpacity
										key={value._id}
										style={{ ...styles.textItem, paddingTop: moderateScale(16) }}
									>
										<View style={{ ...styles.textItemRow, flexDirection }}>
											<Text
												style={{
													fontSize: moderateScale(16),

													color: colors.black
												}}
											>
												{value.name}
											</Text>
											<TouchableOpacity onPress={this.deleteServiceModalToggle(value._id)}>
												<Image source={Images.delete} />
											</TouchableOpacity>
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
												{"DURATION: " + value.duration + "MIN"}
											</Text>

											<Text
												style={{
													...styles.itemTextInput,
													width:moderateScale(160),
													opacity: moderateScale(0.6),
													textAlign: flexDirection == "row" ? "left" : "right"
												}}
											>
												{"PRICE: $" + value.price + ".00"}
											</Text>
										</View>
									</TouchableOpacity>
								))}
						</View>
						{serviceList.map((service, index) => (
							<Fragment key={service._id}>
								<TouchableOpacity
									style={{ ...styles.touchableItem, flexDirection }}
									onPress={this.toggleCollapasable(service._id)}
								>
									<Text
										style={{
											fontSize: moderateScale(16),
											lineHeight: moderateScale(16),
											color: colors.black
										}}
									>
										{service.name}
									</Text>
									<Image source={Images.addBlack} />
								</TouchableOpacity>
								<Collapsible collapsed={!(service._id === isNotCollapsed)}>
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
														height: moderateScale(27),
														alignItems: "center"
													}}
												>
													<Text style={{ ...styles.collapsableBoldText }}>$ {service.price}</Text>
													
													{/* <TextInput
													  	selectionColor={colors.white}
														keyboardType="number-pad"
														value={apiData[service._id].price}
														onChangeText={this._onChange(service._id, "price")}
														maxLength={6}
														style={{ ...styles.collapsableBoldText, flex: 1 }}
													/> */}
												</View>

												<TouchableOpacity
													onPress={this.toggleCollapasable(service._id)}
													style={{ ...styles.collapsableButtonA, width: scale(156) }}
												>
													<Text style={styles.collapsableButtonText}>{strings.cancel}</Text>
												</TouchableOpacity>
											</View>
											<View>
												<Text style={{ ...styles.collapsableLable, textAlign }}>
													{strings.duration}
												</Text>
												<View
													style={{
														flexDirection,
														marginTop: moderateScale(10),
														height: moderateScale(27),
														alignItems: "center"
													}}
												>
													<Text style={{ ...styles.collapsableBoldText }}>{this.convertMinsToHrsMins(service.duration)}</Text>
													
													{/* <TextInput
													  	selectionColor={colors.white}
														keyboardType="number-pad"
														value={apiData[service._id].price}
														onChangeText={this._onChange(service._id, "price")}
														maxLength={6}
														style={{ ...styles.collapsableBoldText, flex: 1 }}
													/> */}
												</View>

												<TouchableOpacity
													style={styles.collapsableButtonB}
													onPress={this.addService(service._id, service.name,service.duration,service.price)}
												>
													<Text style={{ ...styles.collapsableButtonText, color: colors.tabsActiveColor }}>
														{strings.save}
													</Text>
												</TouchableOpacity>
											</View>
										</View>
									</View>
								</Collapsible>
							</Fragment>
						))}
						{this.state.savedServices.length<1&& serviceList.length < 1 && <RenderEmpty />}
					</ScrollView>
				)}
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
)(AddCategory);
