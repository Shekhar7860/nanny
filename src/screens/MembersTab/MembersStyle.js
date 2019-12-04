import { Dimensions } from "react-native";

//Third party packages
import { ScaledSheet } from "react-native-size-matters";

//Common components and helper methods
import colors from "../../theme/colors";
import { fontNames } from "../../theme/fontFamily";

const { width, height } = Dimensions.get("window");

export default ScaledSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
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
	elementContainer: {
		paddingTop: "16@ms",
		paddingBottom: "17@ms",
		paddingHorizontal: "16@ms",
		borderBottomColor: "rgba(0,0,0,0.08)",
		borderBottomWidth: "1@ms"
	},
	elementImage: {
		height: "56@ms",
		width: "56@ms",
		borderRadius: "28@ms"
	},
	elementName: {
		fontFamily: fontNames.boldFont,
		color: colors.black,
		fontSize: "16@ms"
	},
	elementPhone: {
		fontFamily: fontNames.regularFont,
		fontSize: "14@ms",
		color: colors.black,
		opacity: "0.5@ms"
    },
    memberTextContainer:{
        justifyContent: "space-between",

        paddingHorizontal:"16@ms",
        marginBottom: "9@ms",
        alignItems: "center"
    },
    memberText:{
        fontFamily: fontNames.regularFont,
        color: colors.black,
        opacity: "0.5@ms",
        textAlign: "center",
        textAlignVertical: "center"
    },
    addMemberButton:{
        height: "32@vs",
        width: "112@s",
        borderRadius: "4@vs",
        backgroundColor: colors.followersButtonBackgroundColor,
        justifyContent: "center",
        // shadowOffset:{width:0,height:4},
        // shadowOffset:moderateScale(1),
        // shadowRadius:moderateScale(12),
        alignItems: "center"
	},
	notificationBadgeContianer:{
		color: "white",
		height:"20.4@ms",
		width: "20.4@ms",
		top: 0,
		right: 0,
		position: "absolute",
		backgroundColor: colors.tabsActiveColor,
		borderRadius:"10@ms",
		alignItems: "center",
		justifyContent: "center"
	},
	notificationBadgeText:{
		color: "white",
		fontFamily: fontNames.boldFont,
		textAlign: "center",
		fontSize:"11.5@ms"
	}
});
