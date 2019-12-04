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
	ImageBackground,
	FlatList
} from "react-native";

//Third party packages
import { verticalScale, moderateScale, scale } from "react-native-size-matters";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Bubbles from "react-native-loader/src/Bubbles";
import { StackActions } from "react-navigation";

//Redux Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserDataAction from "../../actions/userDataActions";

//Common components and helper methods
import styles from "./MembersStyle";
import { fontNames } from "../../theme/fontFamily";
import colors from "../../theme/colors";
import { Images } from "../../components/ImagesPath";
import { checkInternetAvailibility } from "../../helper/CheckInternet";
import strings from "../../constants/LocalizedStrings";
import { postApi, getApi } from "../../config/HitApis";
import { API_REGISTER, API_MEMBERS } from "../../config/Urls";
import Header from "../../components/Header";
import clearAsyncStorage from "../../helper/clearAsyncStorage";
import commonStyles from "../../components/commonStyles";
import CustomRightNotification from "../../components/CustomRightNotification";
import RenderEmpty from "../../components/RenderEmpty";

var pageNo = 0;
var currentListlength = 0;
var limit=6;
class Members extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			members: [
				"https://st3.depositphotos.com/1662991/15593/i/1600/depositphotos_155935400-stock-photo-makeup-artist-in-beauty-salon.jpg",
				"https://st3.depositphotos.com/1662991/15593/i/1600/depositphotos_155935400-stock-photo-makeup-artist-in-beauty-salon.jpg",
				"https://st3.depositphotos.com/1662991/15593/i/1600/depositphotos_155935400-stock-photo-makeup-artist-in-beauty-salon.jpg",
				"https://st3.depositphotos.com/1662991/15593/i/1600/depositphotos_155935400-stock-photo-makeup-artist-in-beauty-salon.jpg"
			],
			searchMember: "",
			skip: 0,
			endReached: false
		};
	}

	static navigationOptions = {
		header: null
	};

	getMembersApiHit = url => {
		console.log(this.props.userDataReducer.userData.accessToken);
		console.log(url, "hte urlv value");
		if (checkInternetAvailibility()) {
			this.setState({ isLoading: true });
			getApi(url, this.props.userDataReducer.userData.accessToken, this.getMembersResponse);
			return;
		}
		alert("Network Error");
		this.setState({ isLoading: false });
		return;
	};
	componentDidMount() {
		checkInternetAvailibility();
		setTimeout(() => {
			this.getMembersApiHit(API_MEMBERS + "?limit="+limit);
		}, 300);

		console.log(this.props.userDataReducer.expertiseList);
	}

	getMembersResponse = response => {
		console.log(response, "the repsoen");
		if (response) {
			const statusCode = response.data.statusCode;
			if (statusCode == 200 || statusCode == 201) {
				const { records } = response.data.info;
				let endReached=false
				if (records.length < limit && this.state.searchMember.trim().length<1) {
					endReached=true;
				}
				// console.log("======================the endreachejkj vlaue =================",endReached);
				// console.log(records,'the recored valueo======')		
				this.props.actions.updateMembersList(records);
				this.setState({ isLoading: false, skip: records.length,endReached });
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
				alert(response.data.message);
				this.setState({ isLoading: false, endReached: false });
				return;
			}
		}
		alert("Network Error");
		this.setState({ isLoading: false });
	};

	//***************Header contents**************** */
	renderContents() {
		return (
			<View style={styles.container}>
				<Text>Members</Text>
				{this.state.isLoading == true ? (
					<View style={styles.loader}>
						<Bubbles size={14} color={colors.tabsActiveColor} />
					</View>
				) : null}
			</View>
		);
	}

	renderItem = (data, index) => {
		const { flexDirection, textAlign } = this.props.userDataReducer;
		const { item } = data;
		const positionRightToggle = flexDirection == "row" ? "Right" : "Left";
		const positionLeftToggle = flexDirection == "row" ? "Left" : "Right";
		return (
			<View style={{ ...styles.elementContainer, flexDirection }}>
				<View
					style={{
						[`padding${positionRightToggle}`]: moderateScale(16)
					}}
				>
					{item.profileImg ? (
						<Image
							style={styles.elementImage}
							source={{
								uri: item.profileImg.thumbnail
							}}
						/>
					) : (
						<Image style={styles.elementImage} source={Images.ic_avatar} />
					)}
				</View>
				<View style={{ paddingVertical: moderateScale(9), justifyContent: "space-between" }}>
					<Text style={{ ...styles.elementName, textAlign }}>{item.fullName}</Text>
					<Text style={{ ...styles.elementPhone, textAlign }}>
						{`(${item.contactDetails.countryCode}) ${item.contactDetails.phoneNo}`}
					</Text>
				</View>
			</View>
		);
	};

	onSearchChange = val => {
		this.setState({ searchMember: val }, () => {
			if (this.searchTimeout) {
				clearTimeout(this.searchTimeout);
			}
			this.searchTimeout = setTimeout(this.searchApiHit, 400);
		});
	};

	searchApiHit = () => {
		const searchMember = this.state.searchMember;
		if (searchMember.trim() !== "") {
			this.getMembersApiHit(`${API_MEMBERS}?search=${searchMember}`);
			return;
		}
		this.getMembersApiHit(API_MEMBERS + "?limit="+limit);
	};

	renderEmpty = () => {
		return <RenderEmpty />;
	};

	// CustomRight = props => {
	//  return (
	//      <View>
	//          <Image
	//              onPress={() => alert("on image")}
	//              style={{ width: moderateScale(30), height: moderateScale(34) }}
	//              source={Images.notification}
	//          />
	//          <View style={styles.notificationBadgeContianer}>
	//              <Text style={styles.notificationBadgeText}>10</Text>
	//          </View>
	//      </View>
	//  );
	// };

	loadMoreApiHit = url => {
		if (checkInternetAvailibility()) {
			this.setState({ isLoading: true });
			getApi(url, this.props.userDataReducer.userData.accessToken, this.loadMoreMembersResponse);
			return;
		}
		alert("Network Error");
		this.setState({ isLoading: false });
		return;
	};

	loadMoreMembersResponse = response => {
		console.log(response, "the repsoen");
		if (response) {
			const statusCode = response.data.statusCode;
			if (statusCode == 200 || statusCode == 201) {
				const { records } = response.data.info;
				let endReached=false
				if (records.length < limit && this.state.searchMember.trim().length<1) {
					endReached=true;
				}
				console.log("======================the endreachejkj vlaue =================",endReached);
				console.log(records,'the recored valueo======')
				const updateMembersList = [...this.props.userDataReducer.membersList, ...records];
				this.props.actions.updateMembersList(updateMembersList);
				this.setState({ isLoading: false, skip: updateMembersList.length,endReached });
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
				alert(response.data.message);
				this.setState({ isLoading: false });
				return;
			}
		}
		alert("Network Error");
		this.setState({ isLoading: false });
	};

	_onEndReached = () => {
		console.log(this.state.skip, "the value of skip");

		const { isLoading, endReached,searchMember } = this.state;
		if (!this.onEndReachedCalledDuringMomentum) {
			console.log(this.state,'the state has a value');
			if (!isLoading && !endReached  && searchMember.trim().length<1) {
				const url = `${API_MEMBERS}?skip=${this.props.userDataReducer.membersList.length}&limit=${limit}`;
				this.loadMoreApiHit(url);
			}
			this.onEndReachedCalledDuringMomentum = true;
		}
	};

	render() {
		const { flexDirection, textAlign } = this.props.userDataReducer;
		const positionRightToggle = flexDirection == "row" ? "Right" : "Left";
		const positionLeftToggle = flexDirection == "row" ? "Left" : "Right";
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<Header
					iconCenter={Images.noovooLogo}
					flexDirection={flexDirection}
					iconLeft={Images.small_logo}
					title={"Nanny Line"}
					iconCenter={null}
					customRight={() => (
						<CustomRightNotification
							onPress={() => {
								this.props.navigation.navigate("notificationsListingMember");
							}}
							// value="22"
						/>
					)}
					iconRight={Images.notification}
				/>
				<View style={{ ...commonStyles.searchContainer, flexDirection }}>
					<Image source={Images.searchIcon} />
					<TextInput
						selectionColor={colors.tabsActiveColor}
						onChangeText={this.onSearchChange}
						value={this.state.searchMember}
						style={{
							...commonStyles.searchTextInput,
							[`padding${positionLeftToggle}`]: moderateScale(6),
							textAlign: positionLeftToggle.toLowerCase()
						}}
						placeholder="Search"
					/>
				</View>
				<View style={{ ...styles.memberTextContainer, flexDirection }}>
					<Text style={styles.memberText}>{strings.members}</Text>
					<TouchableOpacity
						style={styles.addMemberButton}
						onPress={() => this.props.navigation.navigate("addMember")}
					>
						<Text style={{ fontSize: moderateScale(12), color: colors.tabsActiveColor }}>
							{strings.addMembers}
						</Text>
					</TouchableOpacity>
				</View>

				<FlatList
					keyboardShouldPersistTaps="always"
					data={this.props.userDataReducer.membersList}
					showsVerticalScrollIndicator={false}
					renderItem={this.renderItem}
					bounces={false}
					ListEmptyComponent={this.state.isLoading ? null : this.renderEmpty}
					onEndReachedThreshold={0.01}
					onEndReached={this._onEndReached}
					keyExtractor={(item, index) => index.toString()}
					onMomentumScrollBegin={() => {
						this.onEndReachedCalledDuringMomentum = false;
					}}

					//ListFooterComponent={this.renderFooterComponent.bind(this)}

					//
				/>

				{this.state.isLoading ? (
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
)(Members);
