import React from "react";
import { Images } from "./ImagesPath";
import { View, Image, Text ,TouchableOpacity} from "react-native";
import { moderateScale, ScaledSheet } from "react-native-size-matters";
import colors from '../theme/colors';
import { fontNames } from "../theme/fontFamily";


const CustomRightNotification = props => {
	const { onPress, value } = props;
	return (
		<TouchableOpacity onPress={onPress}>
			<Image
				source={Images.notification}
			/>
			{value&&<View style={styles.notificationBadgeContianer}>
				<Text style={styles.notificationBadgeText}>{value}</Text>
			</View>}
		</TouchableOpacity>
	);
};

export default CustomRightNotification;
const styles = ScaledSheet.create({
	notificationBadgeContianer: {
		color: "white",
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
	}
});
