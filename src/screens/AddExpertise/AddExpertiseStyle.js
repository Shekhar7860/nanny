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
		height: "66@ms",
		borderBottomColor: colors.borderBottomColor,
		paddingHorizontal: "16@ms",
		borderBottomWidth: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	servicesText: {
		fontFamily: fontNames.regularFont,
		fontSize: "14@ms",
		color: colors.serviceTextColor,
		paddingHorizontal: "16@ms",
		paddingVertical: "8@ms"
	}
});