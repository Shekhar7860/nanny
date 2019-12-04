import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
//Third party packages
import { ScaledSheet, moderateScale, verticalScale, scale } from "react-native-size-matters";
import moment from "moment";

//Common components and helper methods
import _ from 'lodash';
import colors from "../theme/colors";
import { Images } from "./ImagesPath";
import { fontNames } from "../theme/fontFamily";
import strings from '../constants/LocalizedStrings';

const { width } = Dimensions.get("window");
const time = [
	{
		label: "On Going",
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
];
i=0;

const CommonBookingCard = props => {
	console.log(props.data, "the item value is as follow");
	const flexDirection = "row";
	const data = { ...props.data };
	console.log(data, "the data value");
	console.log(data.fullName, "the full amnmae");
	const { customFooter } = props;
	const success = data.bookingStatus == "Completed" ? true : false;
	const statusText = data.bookingStatus;
	let servicesText;
	console.log(data.services, "the data services are as follow");
	if (data.services.length > 1) {
		i=i+1;
		let p=0;
		servicesText =
		data.services.map(e => e.name).join(",");
	} else {
		servicesText = data.services[0].name;
	}

	const positionRightToggle = flexDirection == "row" ? "Right" : "Left";
	const positionLeftToggle = flexDirection == "row" ? "Left" : "Right";
	const textAlign = "left";
	const imgUri =
		"https://st3.depositphotos.com/1662991/15593/i/1600/depositphotos_155935400-stock-photo-makeup-artist-in-beauty-salon.jpg";
	return (
		<View style={styles.cardContianer}>
			<View style={{ ...styles.cardBody, flexDirection }}>
				<View style={{ flexDirection }}>
					<Image
						style={styles.bodyImg}
						source={{
							uri: data.services[0].serviceId.imageUrl.original
						}}
					/>
					<View style={{ [`padding${positionLeftToggle}`]: moderateScale(12) }}>
						<Text
							style={{ ...styles.serviceText, textAlign }}
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{servicesText}
						</Text>
						<View style={{ ...styles.bodyImageTextContainer, flexDirection }}>
							<View style={{ paddingHorizontal: moderateScale(5) }}>
								<Image source={Images.mapsPinGrey} />
							</View>

							<Text
							numberOfLines={1}
							ellipsizeMode="tail"
								style={{
									color: colors.black,
									opacity: moderateScale(0.5),
									fontFamily: fontNames.regularFont,
									fontSize: moderateScale(12),
									textAlign,
									width:width*.4
								}}
							>
								{props.loc}
							</Text>
						</View>
						<Text style={{ ...styles.timeText, textAlign }}>
							{moment(data.bookingStartTimeMilli)
								.format("DD MMM . h:mm a")
								.toUpperCase()}
						</Text>
					</View>
				</View>

				<Text style={{ ...styles.priceText, textAlign }}>
					$ {data.total}
				</Text>
			</View>
			{customFooter ? (
				customFooter()
			) : (
				<View style={{ ...styles.footerContianer, flexDirection }}>
					<View style={{ flexDirection, alignItems: "center" }}>
						<Image
							style={styles.footerImg}
							source={{
								uri:
									(data.userId && data.userId.profileImg && data.userId.profileImg.original) || ""
							}}
						/>
						<View style={{ [`margin${positionLeftToggle}`]: moderateScale(8) }}>
							<Text
								style={{
									color: colors.interestItemTextColor,
									fontSize: moderateScale(12),
									fontFamily: fontNames.regularFont,
									textAlign
								}}
							>
								{data.userFullName}
							</Text>
							<View style={{ flexDirection, alignItems: "center" }}>
								<Image source={Images.starYellow} />
								<Text
									style={{
										[`margin${positionLeftToggle}`]: moderateScale(4),
										fontSize: moderateScale(10),
										fontFamily: fontNames.regularFont,
										color: colors.black,
										textAlign
									}}
								>
									{data.userId && data.userId.rating}
								</Text>
							</View>
						</View>
					</View>

					<TouchableOpacity
						style={{
							...styles.onGoingButton,
							backgroundColor: success ? "#EDF6E1" : colors.followersButtonBackgroundColor
						}}
					>
						<Text
							style={{
								...styles.statusButtonText,
								color: success ? "#74BF1B": colors.tabsActiveColor
							}}
						>
							{statusText}
						</Text>
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
};

export default CommonBookingCard;

const styles = ScaledSheet.create({
	cardContianer: {
		borderRadius: moderateScale(4),
		backgroundColor: colors.white,
		marginVertical: moderateScale(8),
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: moderateScale(12),
		shadowColor: "rgba(0,0,0,0.08)",
		paddingHorizontal: moderateScale(16),
		marginHorizontal: moderateScale(16),
		paddingTop: moderateScale(16),
		paddingBottom: moderateScale(8),
		elevation: "6@ms"
	},

	onGoingButton: {
		height: "24@vs",
		width: "96@s",
		borderRadius: "4@vs",
		backgroundColor: "#FBE7EF",
		justifyContent: "center"
	},
	bodyImg: {
		height: moderateScale(64),
		width: moderateScale(64),
		borderRadius: moderateScale(4)
	},
	cardBody: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingBottom: moderateScale(12),
		borderBottomColor: "rgba(0,0,0,0.08)",
		borderBottomWidth: moderateScale(1)
	},
	footerImg: {
		height: moderateScale(32),
		width: moderateScale(32),
		borderRadius: moderateScale(16)
	},
	serviceText: {
		color: colors.black,
		fontSize: moderateScale(16),
		width: width * 0.4,
		fontFamily: fontNames.regularFont
	},
	bodyImageTextContainer: {
		alignItems: "center",
		marginTop: moderateScale(12),
		marginBottom: moderateScale(4)
	},
	timeText: {
		fontFamily: fontNames.regularFont,
		fontSize: moderateScale(12),
		color: colors.black,
		opacity: moderateScale(0.4)
	},
	footerContianer: {
		justifyContent: "space-between",
		marginTop: moderateScale(7)
	},
	priceText: {
		fontFamily: fontNames.boldFont,
		fontSize: moderateScale(16),
		color: colors.black
	},
	statusButtonText: {
		fontFamily: fontNames.regularFont,
		opacity: 1,
		textAlign: "center"
	}
});
