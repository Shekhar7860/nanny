import { Dimensions } from "react-native";

//Third party packages
import { ScaledSheet } from "react-native-size-matters";

//Common components and helper methods
import colors from "../../theme/colors";
import { fontNames } from "../../theme/fontFamily";

const { width, height } = Dimensions.get("window");

export default ScaledSheet.create({
	container: {
		flex: 1
	},
	inputMainView: {},
	imageBackground: {
		height: '192@vs',
		width: width,
		justifyContent: 'center',
		alignItems: 'center'
	},
	loginText:{

	},
	inputLabelHalf: {
		lineHeight: "16@ms",
		fontSize: "14@ms",
		color: colors.black,
		opacity: 0.5,
		fontFamily: fontNames.regularFont,
		textAlign: "left"
	},
	topCornerImage: {
		position: "absolute",
		top: 0,
		right: 0
	},
	textInputStyleHalf: {
		lineHeight: "19@ms",
		fontSize: "16@ms",
		color: colors.black,
		width: "147@s",
		opacity: 0.8,
		marginTop: "5@ms",
		fontFamily: fontNames.regularFont,
		padding: 0,
		paddingRight: "24@ms",
		textAlign: "left"
	},
	inputLineHalf: {
		height: "1@ms",
		width: "147@s",
		backgroundColor: colors.black,
		opacity: 0.1,
		borderRadius: "4@ms",
		marginTop: "12@ms",
		alignSelf: "center"
	},
	inputLabel: {
		lineHeight: "16@vs",
		fontSize: "14@ms",
		color: colors.black,
		opacity: 0.5,
		marginLeft: "23@ms",
		fontFamily: fontNames.regularFont,
		textAlign: "left"
	},
	textInputStyle: {
		//lineHeight: '19@vs',
		fontSize: "16@ms",
		color: colors.black,
		opacity: 0.8,
		marginTop: "5@ms",
		marginHorizontal: "23@ms",
		fontFamily: fontNames.regularFont,
		padding: 0,
		paddingRight: "24@ms",
		textAlign: "left"
	},
	inputLine: {
		height: "1@ms",
		width: width - 46,
		backgroundColor: colors.black,
		opacity: 0.1,
		borderRadius: "4@ms",
		marginTop: "12@ms",
		alignSelf: "center"
	},
	forgotPassword: {
		lineHeight: "24@ms",
		fontSize: "14@ms",
		color: colors.tabsActiveColor,
		marginRight: "23@ms",
		fontFamily: fontNames.regularFont,
		textAlign: "right"
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
	register: {
		height: "48@vs",
		width: "148@s",
		backgroundColor: "transparent",
		borderWidth: "1@ms",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: "2@ms",
		borderColor: "white"
	},
	loginButton: {
		height: "48@vs",
		width: width - 46,
		borderRadius: "2@ms",
		shadowRadius: "12@ms",
		shadowOpacity: "1@ms",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: colors.gradientButtonShadow,
		shadowOffset: { width: 0, height: 4 },
		backgroundColor: colors.tabsActiveColor,
		alignSelf: "center"
	},
	loginButtonText: {
		fontSize: "12@ms",
		color: colors.white,
		letterSpacing: "1@ms",
		fontFamily: fontNames.boldFont,
		textTransform: "uppercase",
	},
	chooseYourAccountType: {
		lineHeight: "32@ms",
		fontSize: "24@ms",
		color: "black",
		fontWeight: "bold",
		textAlign: "center"
	},
	regiterTextBold: {
		lineHeight: "24@ms",
		fontSize: "20@ms",
		color: colors.black,
		fontFamily: fontNames.boldFont
	},
	loginTextBold: {
		//lineHeight: '24@vs',
        fontSize: '32@ms',
        color: colors.white,
        fontFamily: fontNames.boldFont,
        marginHorizontal: '16@s',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
	},
	regiterTextRegular: {
		lineHeight: "24@ms",
		fontSize: "20@ms",
		opacity: 0.5,
		fontFamily: fontNames.regularFont,
		color: colors.black
	},
	loginTextRegular: {
		lineHeight: "24@ms",
		fontSize: "20@ms",
		color: colors.black,
		fontFamily: fontNames.regularFont,
		opacity: 0.5
	},
	loginRegisterView: {
		flexDirection: "row",
		marginLeft: "23@ms"
	},
	selectedLine: {
		height: "2@ms",
		width: "14@s",
		backgroundColor: colors.tabsActiveColor,
		borderRadius: "1.5@ms"
	},
	blankLine: {
		height: "2@vs",
		width: "14@s",
		backgroundColor: colors.white,
		borderRadius: "1.5@ms"
	},
	visibilityIconStyle: {
		position: "absolute",
		right: 0,
		top: "10@ms",
		marginRight: "23@ms",
		alignItems: "center"
	},
	bottomText: {
		lineHeight: "24@ms",
		fontSize: "14@ms",
		color: "rgba(0,0,0,0.5)",
		alignSelf: "center",
		fontFamily: fontNames.regularFont
	},
	bottomGreenText: {
		lineHeight: "24@ms",
		fontSize: "14@ms",
		color: colors.black,
		alignSelf: "center",
		fontFamily: fontNames.regularFont
	}
});
