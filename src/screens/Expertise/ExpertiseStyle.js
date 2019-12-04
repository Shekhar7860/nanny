//Third party packages
import {ScaledSheet} from "react-native-size-matters";

//Common components and helper methods
import colors from '../../theme/colors'
import { fontNames } from '../../theme/fontFamily'

export default ScaledSheet.create({
	headerRightText: {
		fontSize: "12@ms",
		color: colors.tabsActiveColor,
		lineHeight: "24@ms",
		fontWeight: "bold"
	},
	touchableItem: {
	
		borderBottomColor: colors.borderBottomColor,
		paddingHorizontal: "16@ms",
		borderBottomWidth: 1,
		// justifyContent: "space-between"
	},
	itemTextInput: {
		paddingBottom: "16@ms",
		lineHeight: "16@ms",
		fontSize: "12@ms"
	},
	servicesText: {
		fontFamily: fontNames.regularFont,
		fontSize: "14@ms",
		color: colors.serviceTextColor,
		paddingHorizontal: "16@ms",
		paddingVertical: "8@ms"
	},	collapsableLable: {
		color: colors.white,
		fontSize: "11@ms",
		lineHeight: "16@ms",
		fontFamily: fontNames.boldFont,
		letterSpacing: "0.92@ms"
	},
	collapsableBoldText: {
		color: colors.white,
		fontSize: "20@ms",
		paddingVertical:0,
		fontFamily: fontNames.boldFont,
	},
	collapsableButtonA: {
		marginTop: "25@ms",
		borderColor: colors.white,
		height: "40@vs",
		borderWidth: "1@ms",
		justifyContent: "center",
		alignItems: "center",
		width: "156@s",
		borderRadius: "2@ms"
	},
	collapsableButtonText: {
		lineHeight: "16@ms",
		fontFamily: fontNames.boldFont,
		color: colors.white,
		fontSize: "12@ms"
	},
	collapsableButtonB: {
		marginTop: "25@ms",
		backgroundColor: colors.white,
		height: "40@vs",
		justifyContent: "center",
		alignItems: "center",
		width: "156@s",
		borderRadius: "2@ms"
	},
	collapsableTimeContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: "10@ms"
	},
	collapsableContainer: {
		backgroundColor: colors.tabsActiveColor,
		height: "152@ms",
	},
});