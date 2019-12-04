//Third party imports
import { ScaledSheet } from "react-native-size-matters";

//Common components and helper methods
import colors from '../../theme/colors'
import { fontNames } from '../../theme/fontFamily'

export default ScaledSheet.create({
    header: {
        elevation: "10@ms",
        backgroundColor: colors.white,
        width: "100%",
        flexDirection: "row",
        shadowOffset: { width: 0, height: "6@ms" },
        shadowRadius: "12@ms",
        shadowOpacity: "1@ms",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "rgba(0,0,0,0.08)",
        height: "56@vs",
        paddingHorizontal: "23@ms"
    },
    borderLine: {
        height: "1@ms",
        backgroundColor: colors.black,
        opacity: 0.1,
        borderRadius: "1@ms",
        marginTop: "12@ms",
        alignSelf: "center"
    },
    itemContainer: {
        borderBottomColor: colors.borderBottomColor,
        borderBottomWidth: 1,
        justifyContent: "space-between"
    },
    itemText: {
        fontSize: "16@ms",
        lineHeight: "56@ms",
        color: colors.black,
        opacity:0.80,
        fontFamily: fontNames.regularFont,
        textAlignVertical: "center"
    },
    headerTextContainer: {

    },
    itemArrowContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    loader: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
});