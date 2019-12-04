//Third party packages
import { ScaledSheet } from 'react-native-size-matters';

//Common components and helper methods
import colors from '../../theme/colors'
import { fontNames } from '../../theme/fontFamily'

export default ScaledSheet.create({
    container: {
        flex: 1
    },
    mainImageDimensions: {
        flex: 1,
        width: null,
        height: null,
        flexDirection: 'column',
        backgroundColor:colors.white,
        justifyContent: 'space-between',
    },
    register: {
        height: '48@vs',
        width: '148@s',
        backgroundColor: 'transparent',
        borderWidth: '1@ms',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '2@ms',
        borderColor: colors.tabsActiveColor
    },
    login: {
        height: '48@vs',
        width: '148@s',
        backgroundColor: 'transparent',
        borderRadius: '2@ms',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.tabsActiveColor,
        marginLeft: '16@ms'
    },
    registerText: {
        lineHeight: '16@vs',
        fontSize: '12@ms',
        color: colors.tabsActiveColor,
        fontFamily: fontNames.boldFont,
    },
    loginText: {
        lineHeight: '16@vs',
        fontSize: '12@ms',
        color: colors.white,
        fontFamily: fontNames.boldFont,
    },
    bottomText: {
        lineHeight: '24@vs',
        fontSize: '14@ms',
        color: colors.grey,
        alignSelf: 'center',
        fontFamily: fontNames.regularFont,
    },
    bottomGreenText: {
        lineHeight: '24@vs',
        fontSize: '14@ms',
        color: colors.tabsActiveColor,
        alignSelf: 'center',
        fontFamily: fontNames.regularFont,
    }
});