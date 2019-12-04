import { Dimensions, PixelRatio } from "react-native";
let { height, width } = Dimensions.get("window");

export const widthPercentageToDP = widthPercent => {
	const screenWidth = width;
	const elemWidth = parseFloat(widthPercent);
	return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};
export const heightPercentageToDP = heightPercent => {
	const screenHeight = height;
	// Convert string input to decimal number
	const elemHeight = parseFloat(heightPercent);
	return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};