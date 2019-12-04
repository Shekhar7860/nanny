import { ScaledSheet, moderateScale, scale, verticalScale } from "react-native-size-matters";
import { fontNames } from "../theme/fontFamily";
import colors from "../theme/colors";
export default ScaledSheet.create({
	bottomButton: {
		bottom: 0,
		position: "absolute",
		width: "100%",
		height: "48@vs",
		backgroundColor: colors.tabsActiveColor,
		alignItems: "center",
		justifyContent: "center"
	},
	bottomButtonText: {
		fontFamily: fontNames.boldFont,
		letterSpacing: "2@ms",
		fontSize: "12@ms",
		color: colors.white,
		textAlign: "center"
	},
	headerWithoutShadowContainer: {
		backgroundColor: colors.white,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		height: moderateScale(56),
		paddingHorizontal: moderateScale(16)
	},
	searchContainer: {
		margin: moderateScale(16),
		paddingHorizontal: moderateScale(12),
		borderRadius: moderateScale(4),
		borderWidth: moderateScale(1),
		borderColor: "rgba(0,0,0,0.06)",
		height: moderateScale(44),
		alignItems: "center"
	},
	searchTextInput: {
		flex: 1,
		color: colors.black,
		textAlignVertical: "center",
		fontSize: moderateScale(14),
		paddingVertical: 0,
		fontFamily: fontNames.regularFont
	},
	loader: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: "center",
		justifyContent: "center"
	},
	listElementContainer: {
		paddingTop: "16@ms",
		paddingBottom: "17@ms",
		paddingHorizontal: "16@ms",
		borderBottomColor: "rgba(0,0,0,0.08)",
		borderBottomWidth: "1@ms"
	},
	listElementImage: {
		height: "56@ms",
		width: "56@ms",
		borderRadius: "28@ms"
	},
	listElementName: {
		fontFamily: fontNames.boldFont,
		color: colors.black,
		fontSize: "16@ms"
	},
	listElementSubText: {
		fontFamily: fontNames.regularFont,
		fontSize: "14@ms",
		color: colors.black,
		opacity: "0.5@ms"
	},
	notificationBadgeContianer: {
		color: colors.white,
		height: "20.4@ms",
		width: "20.4@ms",
		top: 0,
		right: 0,
		position: "absolute",
		backgroundColor: colors.tabsActiveColor,
		borderRadius: "10@ms",
		alignItems: "center",
		justifyContent: "center"
	},
	notificationBadgeText: {
		color: "white",
		fontFamily: fontNames.boldFont,
		textAlign: "center",
		fontSize: "11.5@ms"
	},
	cardButtonContainer: {
		height: "40@vs",
		flex: 1,
		borderColor: colors.tabsActiveColor,
		backgroundColor: colors.tabsActiveColor,
		borderRadius: "2@ms",
		borderWidth: "1@ms",
		alignItems: "center",
		justifyContent: "center"
	},
	cardButtonOutlineContainer: {
		height: "40@vs",
		flex: 1,
		borderColor: colors.tabsActiveColor,
		borderRadius: "2@ms",
		borderWidth: "1@ms",
		alignItems: "center",
		justifyContent: "center"
	},
	cardButtonText: {
		textTransform: "uppercase",
		letterSpacing: scale(2),
		textAlign: "center",
		color: colors.tabsActiveColor,
		fontFamily: fontNames.boldFont,
		fontSize: moderateScale(12)
	},
	bookingCardContainer: {
		borderRadius: moderateScale(4),
		backgroundColor: colors.white,
		marginVertical: moderateScale(8),
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: moderateScale(1),
		shadowColor: "rgba(0,0,0,0.08)",
		padding: moderateScale(16),
		elevation: "6@ms",
		shadowRadius:moderateScale(12)
		
	},
	bookingCardDateText: {
		color: "#4f4f4f",
		fontFamily: fontNames.regularFont,
		fontSize: moderateScale(14)
	},
	bookingCardNameText: {
		marginTop: moderateScale(16),
		fontSize: moderateScale(16),
		fontFamily: fontNames.boldFont,
		color: colors.black
	},
	bookingCardServiceText: {
		textTransform: "uppercase",
		color: colors.interestItemTextColor,
		alignSelf: "center",
		fontSize: moderateScale(12),
		fontFamily: fontNames.regularFont,
		opacity: moderateScale(0.5)
	},
	bookingCardPriceText: {
		fontFamily: fontNames.boldFont,
		fontSize: moderateScale(16),
		color: colors.black
	},
	bookingCardPriceServiceContainer: {
		flexDirection: "row",
		marginTop: moderateScale(16),
		marginBottom: moderateScale(21),
		justifyContent: "space-between"
	},
	cardShadow: {
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: moderateScale(12),
		shadowRadius: moderateScale(12),
		shadowColor: "rgba(0,0,0,0.08)",
		elevation: moderateScale(4)
	},
	editProfileText: {
		lineHeight: "16@ms",
		fontSize: "14@ms",
		color: colors.tabsActiveColor,
		fontFamily: fontNames.regularFont
	},
	formText: {
		fontFamily: fontNames.regularFont,
		color: colors.titleTextInputColor,
		fontSize: "14@ms",
		lineHeight: "16@ms"
	},
	formTextInput: {
		fontSize: "16@ms",
		fontFamily: fontNames.regularFont,
		color: colors.valueTextInputColor,
		paddingTop: "9@ms",
		paddingBottom: "11@ms"
	},
	formContainer: {
		marginVertical: "14@ms",
		borderBottomColor: colors.textInputBottomBorder,
		borderBottomWidth: "1@ms"
	},
	formDateText: {
		fontSize: "16@ms",
		paddingTop: "9@ms",
		paddingBottom: "11@ms",
		color: colors.black,
		opacity: 0.8,
		fontFamily: fontNames.regularFont
	},
	formDateView: {
		width: "100%",
		justifyContent: "center"
	},
	formDateIcon: {
		marginRight: 0,
		height: "12@ms",
		width: "12@ms"
	},
	formDateInput: {
		borderWidth: 0
	},
	formCountryPicker: {
		height: "22@vs",
		width: "75@ms"
	},
	formCountryCode: {
		fontSize: "16@ms",
		color: colors.black,
		opacity: 0.8,
		fontFamily: fontNames.regularFont
	},
	formCountryCodeContiner: {
		position: "absolute",
		width: "75@s",
		justifyContent: "space-between",
		flexDirection: "row"
	},
	formCountryCodeArrow: {
		position: "absolute",
		right: 0,
		height: "10@vs",
		width: "10@s",
		marginTop: 6
	},
	listElementButton: {
		height: "32@vs",
		width: "90@s",
		borderRadius: "4@vs",
		backgroundColor: colors.followersButtonBackgroundColor,
		justifyContent: "center",
		alignItems: "center"
	},
	loadMoreButton: {
		width: "328@s",
		height: "50@vs",
		borderRadius: "4@ms",
		shadowRadius: "12@ms",
		marginVertical: "8@ms",
		shadowOpacity: "1@ms",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.white,
		shadowColor: "rgba(0,0,0,0.08)",
		shadowOffset: { width: 0, height: 4 },
		alignSelf: "center",
		elevation: "12@ms"
	},
	profilePicStyle: {
		height: "88@ms",
		width: "88@ms",
		borderRadius: "44@ms",
		borderWidth: "2@ms",
		borderColor: colors.tabsActiveColor
	}
});
