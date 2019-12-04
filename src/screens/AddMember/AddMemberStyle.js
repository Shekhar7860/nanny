
//Third party packages
import {ScaledSheet} from "react-native-size-matters";

//Common components and helper methods
import { fontNames } from "../../theme/fontFamily";
import colors from "../../theme/colors";

export default ScaledSheet.create({
	itemText: {
		fontFamily: fontNames.regularFont,
		color: colors.titleTextInputColor,
		fontSize: "14@ms",
		lineHeight: "16@ms"
	},
	itemTextInput: {
		fontSize: "16@ms",
		fontFamily: fontNames.regularFont,
		color: colors.valueTextInputColor,
		paddingTop: "9@ms",
		paddingBottom: "11@ms"
	},
	itemContainer: {
		marginVertical: "14@ms",
		borderBottomColor: colors.textInputBottomBorder,
		borderBottomWidth: "1@ms"
	},
	countryPicker: {
		height: "22@vs",
		width: "75@ms"
	},
	countryCode: {
		fontSize: "16@ms",
		color: colors.black,
		opacity: 0.8,
		fontFamily: fontNames.regularFont
	},
	countryCodeContiner: {
		position: "absolute",
		width: "75@s",
		justifyContent: "space-between",
		flexDirection: "row"
	},
	countryCodeArrow: {
		position: "absolute",
		right: 0,
		height: "10@vs",
		width: "10@s",
		marginTop: 6
	},
	bottomButton: {
		marginTop: "11@ms",
		height: "48@vs",
		backgroundColor: colors.tabsActiveColor,
		alignItems: "center",
		justifyContent: "center",
		borderRadius:"2@ms"
	},
	bottomButtonText: {
		fontFamily: fontNames.boldFont,
		letterSpacing: "2@ms",
		fontSize: "12@ms",
		color: colors.white,
		textAlign: "center"
	},
	expertSelect: {
		paddingTop: "9@ms",
		paddingBottom: "11@ms",
		justifyContent: "space-between",
		alignItems: "center"
	},
	dateView: {
		width: "100%",
		justifyContent: "center"
	},
	dateText: {
		fontSize: "16@ms",
		paddingTop: "9@ms",
		paddingBottom: "11@ms",
		color: colors.black,
		opacity: 0.8,
		fontFamily: fontNames.regularFont,
	},
	dateIcon: {
		marginRight: 0,
		height: "12@ms",
		width: "12@ms"
	},
	dateInput: {
		borderWidth: 0
	}
});