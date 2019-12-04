import {ScaledSheet} from "react-native-size-matters";
import { fontNames } from '../../theme/fontFamily';
import colors from "../../theme/colors";
export default ScaledSheet.create({
	header: {
		backgroundColor: colors.white,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		height: "56@vs",
		paddingHorizontal: "16@ms"
	},
	collapsableLable: {
		color: colors.white,
		fontSize: "11@ms",
		lineHeight: "16@ms",
		fontFamily: fontNames.boldFont,
		letterSpacing: "0.92@ms"
	},
	collapsableBoldText: {
		
		// backgroundColor:'red',
		color: colors.white,
		fontSize: "20@ms",
		paddingVertical:0,
		fontWeight:'bold',
		textAlignVertical:'center',
		fontFamily: fontNames.regularFont,
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
	headerRightText: {
		fontSize: "12@ms",
		color: colors.tabsActiveColor,
		lineHeight: "24@ms",
		fontWeight: "bold",
		fontFamily:fontNames.boldFont
	},
	textItem: {
		marginHorizontal: "16@ms",
		borderBottomColor: colors.borderBottomColor,
		borderBottomWidth: "1@ms"
	},
	textItemRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		height: "25@vs"
	},
	itemTextInput: {
		paddingBottom: "16@ms",
		width: "112@ms",
		lineHeight: "16@ms",
		fontSize: "12@ms"
	},
	touchableItem: {
		height: "66@ms",
		borderBottomColor: colors.borderBottomColor,
		marginHorizontal: "16@ms",
		borderBottomWidth: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	loader: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: "center",
		justifyContent: "center"
	}
});
