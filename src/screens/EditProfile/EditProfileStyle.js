//Third party packages
import { ScaledSheet } from "react-native-size-matters";

//Common components and helper methods
import colors from "../../theme/colors";
import { fontNames } from "../../theme/fontFamily";

export default  ScaledSheet.create({
	followersTextContainer: {
		justifyContent: "space-between",

		paddingHorizontal: "16@ms",
		marginBottom: "9@ms",
		alignItems: "center"
	},
	followersText: {
		fontFamily: fontNames.regularFont,
		color: colors.black,
		opacity: "0.5@ms",
		textAlign: "center",
        textAlignVertical: "center",
        textTransform:"uppercase"
	},
	followersButton: {
		height: "32@vs",
		width: "90@s",
		borderRadius: "4@vs",
		backgroundColor: colors.followersButtonBackgroundColor,
		justifyContent: "center",
		alignItems: "center"
	},
	loadMoreButton: {
        width: '328@s',
        height: '50@vs',
        borderRadius: '4@ms',
        shadowRadius: '12@ms',
        marginVertical: '8@ms',
        shadowOpacity: '1@ms',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOffset: { width: 0, height: 4 },
        alignSelf: 'center',
        elevation: '12@ms'
    },
});