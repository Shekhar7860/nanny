import React from "react";
import { View, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { moderateScale, verticalScale, scale, ScaledSheet } from "react-native-size-matters";
import commonStyles from "./commonStyles";
import colors from "../theme/colors";
import { fontNames } from "../theme/fontFamily";

const GradientButton = props => {
	const { onPress, buttonText,buttonStyle={},textStyle={} } = props;

	return (
		<LinearGradient
			style={{...styles.gradientButton,...buttonStyle}}
			colors={colors.gradientButtonArray}
			start={{ x: 1, y: 0.5 }}
			end={{ x: 0, y: 0.5 }}
			locations={[0, 1]}
		>
			<Text style={{...styles.text,...textStyle}}>{buttonText}</Text>
		</LinearGradient>
	);
};

export default GradientButton;

const styles = ScaledSheet.create({
	gradientButton: {
		height: "48@vs",
		borderRadius: "2@ms",
		shadowRadius: "12@ms",
		shadowOpacity: "1@ms",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: colors.gradientButtonShadow,
		shadowOffset: { width: 0, height: 4 }
	},
	text: {
		lineHeight: "16@ms",
		fontSize: "12@ms",
		color: colors.white,
		letterSpacing: "1@ms",
		fontFamily: fontNames.boldFont
	}
});
