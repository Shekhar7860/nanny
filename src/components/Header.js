import React, { Component } from "react";

import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";

//Third party imports
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

//Common components and helper methods
import colors from "../theme/colors";
import { fontNames } from "../theme/fontFamily";
import strings from '../constants/LocalizedStrings';

const CreatePostHeader = props => {
	const {
		flexDirection,
		title,
		iconLeft,
		iconRight,
		onPressLeft,
		onPressRight,
		iconCenter,
		headerStyle,
		textRight,
		textRightStyle,
		customRight,
		showCenterIconAsRow
	} = props;
	let headerStyleProps = styles.header;
	if (headerStyle) {
		headerStyleProps = { ...headerStyle };
	}

	return (
		<View style={{ ...headerStyleProps, flexDirection }}>
			{iconLeft != null ? (
				<TouchableOpacity hitSlop={{top:10,bottom:10,right:10,left:10}} onPress={onPressLeft}>
					<Image
						style={{ transform: [{ scaleX: flexDirection === "row" ? 1 : -1 }] }}
						source={iconLeft}
					/>
				</TouchableOpacity>
			) : (
				<View style={{ minWidth: scale(18),height:moderateScale(10) }} />
			)}
			{iconCenter != null ? (
				<TouchableOpacity>
					<Image
						style={{ transform: [{ scaleX: flexDirection === "row" || showCenterIconAsRow ? 1 : -1 }] }}
						source={iconCenter}
					/>
				</TouchableOpacity>
			) : (
				<Text
					style={{
						fontSize: moderateScale(18),
						fontFamily: fontNames.boldFont,
						textAlign: "center",
						textAlignVertical: "center",
						color:colors.black
					}}
				>
					{title}
				</Text>
			)}

			{customRight!=null?<View>{customRight()}</View> :(iconRight != null ? (
				<TouchableOpacity hitSlop={{top:10,bottom:10,right:10,left:10}} onPress={onPressRight}>
					<Image
						style={{ transform: [{ scaleX: flexDirection === "row" ? 1 : -1 }] }}
						source={iconRight}
					/>
				</TouchableOpacity>
			) : (
				<View style={{ minWidth: scale(28) }}>
					<Text onPress={onPressRight} style={textRightStyle}>
						{textRight}
					</Text>
				</View>
			))}
		</View>
	);
};

export default CreatePostHeader;

const styles = StyleSheet.create({
	header: {
		elevation: moderateScale(4),
		backgroundColor: colors.white,
		shadowOffset: { width: 0, height: moderateScale(6) },
		shadowRadius: moderateScale(12),
		shadowOpacity: moderateScale(1),
		alignItems: "center",
		justifyContent: "space-between",
		shadowColor: "rgba(0,0,0,0.08)",
		height: verticalScale(56),
		paddingHorizontal: moderateScale(20)
	}
});
