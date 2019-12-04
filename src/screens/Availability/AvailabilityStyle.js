import {ScaledSheet} from "react-native-size-matters";
import { widthPercentageToDP } from "../../helper/deviceDimensions";
import { fontNames } from '../../theme/fontFamily';
import colors from "../../theme/colors";

export default  ScaledSheet.create({
    container: { flex: 1, backgroundColor: colors.textInputBottomBorder },
    header:{
        zIndex: 1,
        elevation: 2,
        backgroundColor: colors.white,
        width: "100%",
        shadowOffset: { width: 0, height:"6@ms" },
        shadowRadius: "12@ms",
        shadowColor: "rgba(0,0,0,0.08)",
        shadowOpacity: "1@ms",
        height: "56@ms",
        paddingHorizontal:"23@s",
        justifyContent: "space-between",
        alignItems: "center"
    },
	head: { height: "40@ms", backgroundColor: colors.headColor },
	title: {
		borderColor: colors.textInputBottomBorder,
		paddingLeft: widthPercentageToDP(4.44),
		paddingRight: widthPercentageToDP(3.06)
	},
	btn: { borderRadius: 2, marginRight: "35.33@ms" },
	btnText: {
		textAlign: "center",
		color: colors.white,
		lineHeight: "56@ms",
		fontSize: "12@ms",
		fontFamily:fontNames.regularFont
	},
	row: { flex: 1, flexDirection: "row" },
	text: { margin: "6@ms",fontFamily:fontNames.regularFont },
	headerLabel: {
		fontSize: "14@ms",
		alignSelf:'center',
		color: colors.black,
		fontFamily:fontNames.regularFont

	},
	btnContent: {
		height: "13@vs",
		width: "22@s",
		alignSelf: "center",
		shadowOffset: { width: 0, height: "2@ms" },
		shadowColor: colors.gradientButtonShadow,
		shadowOpacity: "1@ms",
		shadowRadius: "4@ms",
		backgroundColor: colors.tabsActiveColor,
		elevation: "3@ms",
		borderRadius: "6.5@ms",
		zIndex: "10@ms"
	},
	btnContainer: {
		height: "20@vs",
		width: "30@s",
		borderRadius: "10@ms",
		borderWidth: "1@ms",
		borderColor: colors.tabsActiveColor,
		justifyContent: "center",
		alignItems: "center",
		alignContent: "center"
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
