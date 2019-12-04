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
    profilePicNameMainView: {
        marginHorizontal: '24@ms'
    },
    profilePicStyle: {
        height: '88@ms',
        width: '88@ms',
        borderRadius: '44@ms',
        borderWidth: '2@ms',
        borderColor: colors.tabsActiveColor
    },
    nameEditProfileMainView: {
        marginHorizontal: '16@ms',
        paddingTop: '13@ms',
    },
    fullNameText: {
        lineHeight: '24@ms',
        fontSize: '20@ms',
        color: colors.black,
        fontFamily: fontNames.boldFont,
    },
    editProfileText: {
        lineHeight: '16@ms',
        fontSize: '14@ms',
        color: colors.tabsActiveColor,
        fontFamily: fontNames.regularFont,
    },
    availableSlotContainer: {
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    availableSlotText: {
        lineHeight: '24@ms',
        fontSize: '16@ms',
        color: colors.tabsActiveColor,
        fontFamily: fontNames.regularFont,
    },
    postsFollowersFollowingCountMainView: {
        backgroundColor: colors.profileScreenBannerOne,
        height: '56@vs',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    countText:{
        lineHeight: '16@ms',
        fontSize: '16@ms',
        color: colors.black,
        opacity:0.87,
        fontFamily: fontNames.boldFont,
    },
    countLabel:{
        lineHeight: '16@ms',
        fontSize: '12@ms',
        color: colors.black,
        opacity:0.50,
        fontFamily: fontNames.regularFont,
        marginTop:'4@ms'
    },
    postsFollowersFollowingIconsMainView: {
        height: '56@vs',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal:'52@ms'
    },
});