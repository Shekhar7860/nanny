import React, { Component } from "react";
import {
	View,
	Text,
	SafeAreaView,
	TextInput,
	Image,
	StyleSheet,
	TouchableOpacity,
	FlatList
} from "react-native";

//Redux Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserDataAction from "../../actions/userDataActions";

//Third party packages
import { moderateScale, verticalScale, scale, ScaledSheet } from "react-native-size-matters";
import Bubbles from "react-native-loader/src/Bubbles";
import _ from 'lodash';

//Common components and helper methods

import { fontNames } from "../../theme/fontFamily";
import colors from "../../theme/colors";
import { checkInternetAvailibility } from "../../helper/CheckInternet";
import strings from "../../constants/LocalizedStrings";
import { postApi, getApi } from "../../config/HitApis";
import { API_REGISTER, API_GET_STYLIST_SERVICES } from "../../config/Urls";
import Header from "../../components/Header";
import { Images } from "../../components/ImagesPath";
import commonStyles from "../../components/commonStyles";
import styles from "./AddExpertiseStyle";
import clearAsyncStorage from "../../helper/clearAsyncStorage";

class AddExpertise extends Component {
	state = {
		isLoading: true,
		expertiseList: [],
		searchText: "",
		searchSelected: []
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
		const expertiseList = [...this.props.userDataReducer.expertiseList];
		if (expertiseList.length < 1) {
			checkInternetAvailibility();
			setTimeout(() => {
				this.getServicesApiHit(API_GET_STYLIST_SERVICES);
			}, 400);
			return;
		}
		this.setState({ expertiseList, isLoading: false });
	}

	getServicesResponse = response => {
		console.log(response, "the response");
		if (response) {
			const statusCode = response.data.statusCode;
			if (statusCode === 200 || statusCode === 201) {
				const data = response.data.info;
				console.log(data, "the data");
				const expertiseList = data.records.map(val => {
					if (this.state.searchSelected.includes(val._id)) {
						return { ...val, isSelected: true };
					} else {
						return { ...val, isSelected: false };
					}
				});
				this.setState({ expertiseList, isLoading: false });
				this.props.actions.updateExpertiseList(expertiseList);
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

	renderItem = (data, key) => {
		const { item, index } = data;
		console.log(item.isSelected, "the is selected value");
		const { flexDirection, textAlign } = this.props.userDataReducer;

		return (
			<TouchableOpacity
				style={{ ...styles.touchableItem, flexDirection }}
				onPress={this.toggleExpertise(index)}
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
				<Image source={item.isSelected ? Images.adddedBlueTick : Images.addBlack} />
			</TouchableOpacity>
		);
	};

	toggleExpertise = index => () => {
		const expertiseList = [...this.state.expertiseList];
		let item = { ...this.state.expertiseList[index] };
		this.setState(prevState => {
			let prevStateItemIsSelected = prevState.expertiseList[index].isSelected;
			let searchSelected = [...prevState.searchSelected];
			if (prevStateItemIsSelected) {
				_.remove(searchSelected, id => {
					return id == item._id;
				});
			} else {
				searchSelected.push(item._id);
			}
			console.log(searchSelected,'the serach selected array')
			item.isSelected = !prevStateItemIsSelected;
			expertiseList[index] = item;
			return {
				expertiseList,
				searchSelected
			};
		});
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
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<Header
					onPressLeft={() => this.props.navigation.goBack(null)}
					title="Add Expertise"
					headerStyle={commonStyles.headerWithoutShadowContainer}
					flexDirection={flexDirection}
					iconLeft={Images.back}
					textRight={strings.save}
					textRightStyle={styles.headerRightText}
					onPressRight={this.onSave}
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
						placeholder="Search"
						value={this.state.searchText}
						onChangeText={this.onSearchChange}
					/>
				</View>
				<Text style={{ ...styles.servicesText, textAlign }}>{strings.services}</Text>
				<View>
					<FlatList
						showsVerticalScrollIndicator={false}
						bounces={false}
						keyExtractor={(item, index) => index.toString()}
						data={this.state.expertiseList}
						renderItem={this.renderItem}
						ListEmptyComponent={this.state.isLoading ? null : this.renderEmpty}
					/>
				</View>
				{this.state.isLoading == true ? (
					<View style={commonStyles.loader}>
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
