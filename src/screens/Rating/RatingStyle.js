import {ScaledSheet} from 'react-native-size-matters';
import { fontNames } from "../../theme/fontFamily";
import colors from "../../theme/colors";

export default ScaledSheet.create({
    textName:{
        marginTop: "8@ms",
        fontSize:"14@ms",
        color: colors.interestItemTextColor,
        lineHeight: "24@ms",
        fontFamily: fontNames.boldFont,
        textAlign: "center"
    },
    reviewInput:{
        height:"120@vs",
        width: "312@ms",
        paddingHorizontal:"16@ms",
        borderRadius: "4@ms",
        borderColor: "rgba(0,0,0,0.06)",
        borderWidth: 1,
        fontFamily:fontNames.regularFont,
        
    },
    imageStyle:{
        height:"80@ms",
        width: "80@ms",
        alignSelf: "center",
        borderRadius:"40@ms"
    },
    headingText:{
        color: colors.black,
        opacity: 0.8,
        fontFamily: fontNames.regularFont,
        fontSize:"24@ms",
        textAlign: "center"
    }
})
