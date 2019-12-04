import { Dimensions } from 'react-native';

//Third party packages
import { ScaledSheet } from 'react-native-size-matters';

//Common components and helper methods
import colors from '../../theme/colors'
import { fontNames } from '../../theme/fontFamily'

const { width, height } = Dimensions.get('window')

export default ScaledSheet.create({
    loader: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadMoreButton: {
        width: '328@s',
        height: '50@vs',
        borderRadius: '4@ms',
        shadowRadius: '12@ms',
        marginVertical: '8@ms',
        shadowOpacity: '1@ms',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOffset: { width: 0, height: '4@ms' },
        alignSelf: 'center',
        elevation: '12@ms'
    },
    titleText: {
        fontSize: '16@ms',
        lineHeight: '19@ms',
        marginHorizontal: '16@ms',
        color: colors.black,
        fontFamily: fontNames.boldFont,
    },
    listItemMainView: {
        marginHorizontal: '8@ms',
        marginVertical: '12@ms',
        height: '80@vs'
    },
    profilePicStyle: {
        height: '40@ms',
        width: '40@ms',
        marginHorizontal: '8@ms',
    },
    notificationsText: {
        fontSize: '12@ms',
        marginHorizontal: '8@ms',
        color: colors.black,
        fontFamily: fontNames.regularFont,
        width: width / 1.4
    },
    timeText: {
        fontSize: '11@ms',
        marginHorizontal: '8@ms',
        color: 'rgba(0,0,0,0.40)',
        fontFamily: fontNames.regularFont,
    },
    inputLine: {
        height: '1@ms',
        width: '272@s',
        backgroundColor: colors.black,
        opacity: 0.10,
        borderRadius: '4@ms',
        marginTop: '6@ms',
    },
});