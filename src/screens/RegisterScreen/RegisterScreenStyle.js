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
    topCornerImage: {
        position: 'absolute',
        top: 0,
        right: 0
    },
    inputMainView: {

    },
    inputLabelHalf: {
        lineHeight: '16@ms',
        fontSize: '14@ms',
        color: colors.black,
        opacity: 0.50,
        fontFamily: fontNames.regularFont,
        textAlign: 'left'
    },
    textInputStyleHalf: {
        // lineHeight: '19@vs',
        fontSize: '16@ms',
        color: colors.black,
        width: '147@s',
        opacity: 0.80,
        marginTop: '5@ms',
        fontFamily: fontNames.regularFont,
        padding: 0,
        paddingRight: '24@ms',
        textAlign: 'left'
    },
    inputLineHalf: {
        height: '1@ms',
        width: '147@s',
        backgroundColor: colors.black,
        opacity: 0.10,
        borderRadius: '4@ms',
        marginTop: '12@ms',
        alignSelf: 'center'
    },
    inputLabel: {
        lineHeight: '16@ms',
        fontSize: '14@ms',
        color: colors.black,
        opacity: 0.50,
        marginLeft: '23@ms',
        fontFamily: fontNames.regularFont,
        textAlign: 'left'
    },
    textInputStyle: {
        // lineHeight: '19@vs',
        fontSize: '16@ms',
        color: colors.black,
        opacity: 0.80,
        marginTop: '5@ms',
        marginHorizontal: '23@ms',
        fontFamily: fontNames.regularFont,
        padding: 0,
        paddingRight: '24@ms',
        textAlign: 'left'
    },
    addressTextInputStyle: {
        // lineHeight: '19@ms',
        // fontSize: '16@ms',
        color: colors.black,
        opacity: 0.80,
        // marginTop: '5@ms',
        marginHorizontal: '23@ms',
        fontFamily: fontNames.regularFont,
        padding: 0,
        paddingRight: '24@ms',
        textAlign: 'left'
    },
    addressInputLine: {
        height: '1@ms',
        width: width - 46,
        backgroundColor: colors.black,
        opacity: 0.10,
        borderRadius: '4@ms',
        //marginTop: '10@ms',
        alignSelf: 'center'
    },
    dateView: {
        paddingRight: '4@ms',
        width: width - 48,
        height: '28@ms',
        alignSelf: 'center',
    },
    dateText: {
        fontSize: '16@ms',
        lineHeight: '19@ms',
        color: colors.black,
        opacity: 0.80,
        fontFamily: fontNames.regularFont,
    },
    dateIcon: {
        position: 'absolute',
        right: 0,
        top: '8@ms',
        marginLeft: 0,
        height: '12@vs',
        width: '12@s'
    },
    dateInput: {
        borderWidth: 0,
        alignItems: 'flex-start',
        marginTop: '-6@ms',
        justifyContent: 'center'
    },
    countryCodeInnerContainer: {
        height: '22@vs',
        width: '70@s',
    },
    countryInnerContainer: {
        height: '30@ms',
        width: width - 46,
        justifyContent: 'center',
        marginLeft:'23@ms'
    },
    countryView: {
        height: '30@ms',
        width: width - 46,
        position: 'absolute',
        alignSelf:'center',
       // marginTop:'16@vs',
        justifyContent: 'center',
        
        //alignItems: 'center'
    },
    countryText: {
        fontSize: '16@ms',
        color: colors.black,
        opacity: 0.80,
       // marginTop:'5@vs',
        paddingRight:'20@ms',
        fontFamily: fontNames.regularFont,
    },
    inputLineCountry: {
        height: '1@ms',
        width: '147@s',
        backgroundColor: colors.black,
        opacity: 0.10,
        borderRadius: '4@ms',
        position:'absolute',
        bottom:0,
        alignSelf: 'center'
    },
    countryCodeView: {
        height: '22@vs',
        width: '70@s',
        position: 'absolute',
        justifyContent: 'center',
        //justifyContent: 'center',
        //alignItems: 'center'
    },
    countryCodeText: {
        //lineHeight: '19@ms',
        fontSize: '16@ms',
        color: colors.black,
        opacity: 0.80,
        fontFamily: fontNames.regularFont,
    },
    inputLinePhone: {
        height: '1@ms',
        width: width - 46,
        backgroundColor: colors.black,
        opacity: 0.10,
        borderRadius: '4@ms',
        marginTop: '8@ms',
        alignSelf: 'center'
    },
    textInputPhoneStyle: {
        //lineHeight: '17@vs',
        width: width/1.5,
        fontSize: '16@ms',
        color: colors.black,
        opacity: 0.80,
        fontFamily: fontNames.regularFont,
        padding: 0,
        paddingLeft: '8@ms',
        paddingRight: '24@ms',
        textAlign: 'left'
    },
    inputLine: {
        height: '1@ms',
        width: width - 46,
        backgroundColor: colors.black,
        opacity: 0.10,
        borderRadius: '4@ms',
        marginTop: '10@ms',
        alignSelf: 'center'
    },
    forgotPassword: {
        lineHeight: '24@ms',
        fontSize: '14@ms',
        color: colors.tabsActiveColor,
        marginRight: '23@ms',
        fontFamily: fontNames.regularFont,
        textAlign: 'right'
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
    register: {
        height: '48@vs',
        width: '148@s',
        backgroundColor: 'transparent',
        borderWidth: '1@ms',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '2@ms',
        borderColor: 'white'
    },
    loginButton: {
        height: '48@vs',
        width: width - 46,
        borderRadius: '2@ms',
        shadowRadius: '12@ms',
        shadowOpacity: '1@ms',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.gradientButtonShadow,
        shadowOffset: { width: 0, height: 4 },
        backgroundColor: colors.tabsActiveColor,
        alignSelf: 'center',

    },
    loginButtonText: {
        lineHeight: '16@ms',
        fontSize: '12@ms',
        color: colors.white,
        letterSpacing: '1@ms',
        fontFamily: fontNames.boldFont
    },
    chooseYourAccountType: {
        lineHeight: '32@ms',
        fontSize: '24@ms',
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    regiterTextBold: {
        lineHeight: '24@ms',
        fontSize: '20@ms',
        color: colors.black,
        fontFamily: fontNames.boldFont,
    },
    loginTextBold: {
        lineHeight: '24@ms',
        fontSize: '20@ms',
        color: colors.black,
        fontFamily: fontNames.boldFont,
    },
    regiterTextRegular: {
        lineHeight: '24@ms',
        fontSize: '20@ms',
        opacity: 0.5,
        fontFamily: fontNames.regularFont,
        color: colors.black,

    },
    loginTextRegular: {
        lineHeight: '24@ms',
        fontSize: '20@ms',
        color: colors.black,
        fontFamily: fontNames.regularFont,
        opacity: 0.5,
    },
    loginRegisterView: {
        flexDirection: 'row',
        marginLeft: '23@ms'
    },
    selectedLine: {
        height: '2@vs',
        width: '14@s',
        backgroundColor: colors.tabsActiveColor,
        borderRadius: '1.5@ms'
    },
    blankLine: {
        height: '2@vs',
        width: '14@s',
        backgroundColor: colors.white,
        borderRadius: '1.5@ms'
    },
    visibilityIconStyle: {
        position: 'absolute',
        right: 0,
        top: '10@ms',
        marginRight: '23@ms',
        alignItems: 'center'
    },
    bottomText: {
        lineHeight: '20@ms',
        fontSize: '12@ms',
        color: 'rgba(0,0,0,0.5)',
        textAlign: 'left',
        fontFamily: fontNames.regularFont,
    },
    bottomBlackText: {
        lineHeight: '20@ms',
        fontSize: '12@ms',
        color: colors.black,
        textAlign: 'left',
        fontFamily: fontNames.regularFont,
    }
});