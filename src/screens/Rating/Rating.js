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
	Dimensions,
	FlatList
} from "react-native";

//Third party packages
import StarRating from "react-native-star-rating";
import { verticalScale, moderateScale, scale, ScaledSheet } from "react-native-size-matters";
import Bubbles from "react-native-loader/src/Bubbles";

//Redux Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserDataAction from "../../actions/userDataActions";

// Common components and helper methods
import { fontNames } from "../../theme/fontFamily";
import colors from "../../theme/colors";
import { Images } from "../../components/ImagesPath";
import { checkInternetAvailibility } from "../../helper/CheckInternet";
import strings from "../../constants/LocalizedStrings";
import { putApi } from "../../config/HitApis";
import { API_RATING } from "../../config/Urls";
import Header from "../../components/CustomHeader";

import commonStyles from "../../components/commonStyles";
import RenderEmpty from "../../components/RenderEmpty";
import styles from "./RatingStyle";

class Ratings extends Component {
	constructor(props) {
		super(props);
		console.log(this.props.navigation.getParam("item"),'the data ratin')
		this.state = {
			ratingCount: 0,
			item: this.props.navigation.getParam("item"),
			review: "",
			isLoading: false
		};
	}

	onSubmitRating = () => {
		if (this.state.ratingCount === 0) {
			alert("Please provide rating");
		} else if (this.state.review.trim().length === 0) {
			alert("Please rate the user");
		} else {
			this._hitRatingBookingApi();
		}
	};

	_hitRatingBookingApi = () => {
		if (checkInternetAvailibility()) {
			this.setState({ isLoading: true });
			const payload = {
				bookingId: this.state.item._id,
				customerRating: this.state.ratingCount,
				customerReview: this.state.review.trim()
			};
			putApi(payload, API_RATING, "en", this.props.userDataReducer.userData.accessToken, response =>
				this.ratingBookingApiResponse(response)
			);
		} else {
			alert("No internet");
		}
	};

	ratingBookingApiResponse = response => {
		console.log(response,'the response i get from servr')
		this.setState({ isLoading: false });
		if (response != null) {
			// var data = response.data.info;
			var message = response.data.message;
			var statusCode = response.data.statusCode;
			console.warn(JSON.stringify(response));
			if (statusCode === 200) {
				setTimeout(() => {
					alert("Rating submitted successfully");
				}, 600);
				this.props.navigation.goBack(null);
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

	headerPress = () => {
		this.props.navigation.goBack(null);
	};
	render() {
		const { flexDirection, textAlign } = this.props.userDataReducer;
		// const flexDirection="row-reverse"
		// const textAlign="right"
		return (
			<SafeAreaView>
				<Header
					flexDirection={flexDirection}
					iconLeft={Images.back}
					title={"Review & Rating"}
					iconRight={Images.icCrossBoldIcon}
					onPressLeft={this.headerPress}
					onPressRight={this.headerPress}
				/>
				<View style={{ marginTop: verticalScale(42), marginHorizontal: moderateScale(56) }}>
					<Text style={styles.headingText}>Please rate and review your service.</Text>
					<View style={{ marginTop: verticalScale(38) }}>
						<Image
							source={{
								uri: this.state.item.userId.profileImg.thumbnail
							}}
							style={styles.imageStyle}
						/>
						<Text style={styles.textName}>{this.state.item.userId.fullName}</Text>
					</View>
					<View style={{ marginTop: verticalScale(35), marginBottom: verticalScale(45) }}>
						<StarRating
							style={{ flexDirection: flexDirection }}
							disabled={false}
							maxStars={5}
							rating={this.state.ratingCount}
							selectedStar={rating => this.setState({ ratingCount: rating })}
							fullStarColor={"#F38204"}
							emptyStar={"star"}
							emptyStarColor={colors.textInputBottomBorder}
							starStyle={{ fontSize: moderateScale(24) }}
						/>
					</View>
				</View>
				<View style={{ marginHorizontal: moderateScale(24) }}>
					<TextInput
					  selectionColor={colors.tabsActiveColor}
						style={{ ...styles.reviewInput, textAlign, textAlignVertical: 'top' }}
						multiline={true}
						placeholder="Write down your review"
						onChangeText={review => this.setState({ review })}
						value={this.state.review}
					/>
					<TouchableOpacity
						style={{
							backgroundColor: colors.tabsActiveColor,
							height: moderateScale(48),
							alignItems: "center",
							justifyContent: "center",
							marginTop: moderateScale(20)
						}}
						onPress={this.onSubmitRating}
					>
						<Text style={{ ...commonStyles.bottomButtonText }}>Submit</Text>
					</TouchableOpacity>
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
)(Ratings);
