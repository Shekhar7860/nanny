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
	tabBarContainer: {
		// elevation:"10@ms",
		backgroundColor: colors.white,
		shadowOffset: { width: 0, height: "6@ms" },
		// shadowRadius: "12@ms",
		shadowOpacity: "1@ms",
		// alignItems: "center",
		// justifyContent: "space-between",
		shadowColor: "rgba(0,0,0,0.08)",
		borderWidth: 2,
		borderColor: "rgba(0,0,0,0.08)"
	},
	onGoingButton:{
		height: "24@vs",
		width: "112@s",
		borderRadius: "4@vs",
		backgroundColor: "#FBE7EF",
		justifyContent: "center",
	}
});
