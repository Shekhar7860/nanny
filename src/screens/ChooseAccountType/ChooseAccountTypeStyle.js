import { Dimensions } from 'react-native';

//Third party packages
import { ScaledSheet } from 'react-native-size-matters';

//Common components and helper methods
import colors from '../../theme/colors'
import { fontNames } from '../../theme/fontFamily'

const { width, height } = Dimensions.get('window')

export default ScaledSheet.create({
    container: {
        flex: 1
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
    continue: {
        height: '48@vs',
        width: width - 48,
        borderRadius: '2@ms',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.tabsActiveColor,
        alignSelf: 'center'
    },
    chooseYourAccountType: {
        lineHeight: '32@ms',
        fontSize: '24@ms',
        color: 'black',
        fontFamily: fontNames.boldFont,
        textAlign: 'center',
        textTransform:"uppercase"
    },
    typeText: {
        lineHeight: '24@ms',
        fontSize: '20@ms',
        color: 'black',
        textAlign: 'center',
        fontFamily: fontNames.regularFont,
    },
    loginText: {
        lineHeight: '16@ms',
        fontSize: '12@ms',
        color: 'white',
        fontFamily: fontNames.boldFont,
        letterSpacing:"1@ms"
    },
});