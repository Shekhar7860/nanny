import React, { Component } from "react";

import {
	View,
	StatusBar,
	SafeAreaView,
	Image,
	Text,
	TouchableOpacity,
	AsyncStorage,
	FlatList,
	ImageBackground,
	TextInput,
	BackHandler
} from "react-native";

//Third party packages
import { verticalScale, moderateScale, scale } from "react-native-size-matters";
import { Bubbles } from "react-native-loader";

//Redux Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserDataAction from "../../actions/userDataActions";

//Common components and helper methods
import styles from "./ChooseYourCategoryScreenStyle";
import colors from "../../theme/colors";
import { getApi } from "../../config/HitApis";
import { Images } from "../../components/ImagesPath";
import strings from "../../constants/LocalizedStrings";
import { API_GET_SERVICE_CATEGORY } from "../../config/Urls";
import { checkInternetAvailibility } from "../../helper/CheckInternet";
import { ScrollView } from "react-native-gesture-handler";
import clearAsyncStorage from "../../helper/clearAsyncStorage";

const apiToken =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2M0MGFhZWYwYzg5NjI2MzEzYzc4NDAiLCJzY29wZSI6IlNUWUxJU1QiLCJ0b2tlbklzc3VlZEF0IjoxNTU3OTIzMjI2ODA5LCJpYXQiOjE1NTc5MjMyMjZ9.yYD15_YjY_RU-mpvlbHdgnkmYe_LnZuyeqfURw87DcY";
class ChooseYourCategoryScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchText: "",
			categoriesArray: [],
			isLoading: true
		};
		this.backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			this.onBackButtonPressAndroid
		);
	}

	componentDidMount() {
		checkInternetAvailibility();
		setTimeout(() => {
			if (checkInternetAvailibility()) {
				getApi(
					`${API_GET_SERVICE_CATEGORY}`,
					this.props.userDataReducer.userData.accessToken,
					this.getCategoryList
				);
				return;
			}
			this.setState({ isLoading: false });
			alert("No Internet");
		}, 300);
	}

	onBackButtonPressAndroid = () => {
		if (this.props.navigation.getParam("home")) {
			BackHandler.exitApp();
			return true;
		}
	};

	componentWillUnmount() {
		this.backHandler.remove();
	}

	getCategoryList = response => {
		if (response) {
			const statusCode = response.data.statusCode;
			if (statusCode === 200 || statusCode === 201) {
				const data = response.data.info;
				const categoriesArray = [...data.records];
				this.setState({ categoriesArray, isLoading: false });
				return;
			} else if (statusCode == 401) {
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
		}
		alert("Network Error");
	};

	static navigationOptions = {
		header: null
	};

	moveToNewScreen = (id, title) => () => {
		if (this.props.navigation.getParam("home")) {
			this.props.navigation.navigate("homeAddCategoryService", { categoryId: id, title });
		} else {
			this.props.navigation.navigate("profileAddCategoryService", { categoryId: id, title });
		}
	};

	renderItem = data => {
		let { item, index } = data;
		let { appLang, textAlign } = this.props.userDataReducer;
		return (
			<TouchableOpacity
				onPress={this.moveToNewScreen(item._id, item.name)}
				activeOpacity={1}
				style={styles.listItemMainView}
			>
				<ImageBackground style={styles.imageBackground} source={{ uri: item.imageUrl.original }}>
					<Text
						ellipsizeMode="tail"
						numberOfLines={3}
						style={[styles.listItemText, { textAlign: textAlign }]}
					>
						{item.name}
					</Text>
				</ImageBackground>
			</TouchableOpacity>
		);
	};

	renderEmpty = () => {
		return (
			<View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
				<Image source={Images.noDataFound} />
			</View>
		);
	};

	searchApiCall = () => {
		let searchText = this.state.searchText;
		if (checkInternetAvailibility()) {
			if (searchText.trim() !== "") {
				getApi(
					`${API_GET_SERVICE_CATEGORY}?name=${searchText}`,
					this.props.userDataReducer.userData.accessToken,
					this.getCategoryList
				);
				return;
			}
			getApi(
				`${API_GET_SERVICE_CATEGORY}`,
				this.props.userDataReducer.userData.accessToken,
				this.getCategoryList
			);
			return;
		}
		alert("No Internet");
	};
	onSearchChange = searchText => {
		this.setState({ searchText }, () => {
			if (this.searchTimeout) {
				clearTimeout(this.searchTimeout);
			}
			this.searchTimeout = setTimeout(this.searchApiCall, 400);
		});
	};

	onClosePress = () => {
		console.log(this.props.navigation.getParam("home"), "the hoem astagbl");
		if (this.props.navigation.getParam("home")) {
			if (this.props.navigation.getParam("userType") === "SALOON") {
				this.props.navigation.navigate("tabbarNavigation");
			} else {
				this.props.navigation.navigate("tabbarNavigationWithoutMember");
			}
		} else {
			this.props.navigation.goBack(null);
		}
	};

	//***************Header contents**************** */
	renderContents() {
		let { flexDirection, appLang, textAlign } = this.props.userDataReducer;
		return (
			<View style={{ flex: 1, backgroundColor: colors.white }}>
				<View style={{ flexDirection: flexDirection, justifyContent: "space-between" }}>
					<Text style={{ ...styles.categoryText }}>{strings.category}</Text>
					<TouchableOpacity
						activeOpacity={0.5}
						style={styles.crossIconButton}
						onPress={this.onClosePress}
					>
						<Image style={styles.crossIcon} source={Images.crossIcon} />
					</TouchableOpacity>
				</View>
				<Text
					style={[
						styles.chooseYourCategoryText,
						{ alignSelf: appLang === "en" ? "flex-start" : "flex-end", textAlign: textAlign }
					]}
				>
					{strings.chooseyourCategory}
				</Text>
				<View style={{ height: verticalScale(20) }} />
				<View style={[styles.searchMainView, { flexDirection: flexDirection }]}>
					<Image source={Images.searchIcon} />
					<TextInput
					  selectionColor={colors.tabsActiveColor}
						style={{ ...styles.textInputStyle, textAlign: "center", color: "#000", opacity: 1 }}
						underlineColorAndroid="transparent"
						placeholder="Search"
						autoCapitalize="none"
						keyboardType="default"
						secureTextEntry={this.state.showPassword}
						returnKeyType={"done"}
						onChangeText={this.onSearchChange}
						value={this.state.searchText}
					/>
					<View style={{ width: scale(26) }} />
				</View>
				<View style={{ height: verticalScale(20) }} />
				<ScrollView keyboardShouldPersistTaps="always" style={{ flex: 1 }}>
					<FlatList
						keyboardShouldPersistTaps="always"
						style={{ paddingBottom: moderateScale(10) }}
						showsVerticalScrollIndicator={false}
						data={this.state.categoriesArray}
						bounces={false}
						keyExtractor={(item, index) => index.toString()}
						renderItem={this.renderItem}
						ListEmptyComponent={this.renderEmpty}
						contentContainerStyle={{ flex: 1 }}
					/>
				</ScrollView>
			</View>
		);
	}

	render() {
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<StatusBar backgroundColor={colors.black} barStyle="default" />
				{this.state.isLoading == true ? (
					<View style={styles.loader}>
						<Bubbles size={14} color={colors.tabsActiveColor} />
					</View>
				) : (
					this.renderContents()
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
)(ChooseYourCategoryScreen);
