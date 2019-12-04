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
    crossIconButton: {
        // alignSelf: 'flex-end',
        marginTop: '20@ms',
        marginHorizontal: '20@ms'
    },
    crossIcon: {
        height: '16@vs',
        width: '16@s'
    },
    categoryText: {
        marginTop: '22@ms',
        lineHeight: '24@ms',
        fontSize: '24@ms',
        color: colors.black,
        fontFamily: fontNames.boldFont,
        textAlign: 'left',
        textAlignVetical:"center",
        marginLeft: '16@s'
    },
    categoryText: {
        marginTop: '22@ms',
        lineHeight: '28@ms',
        fontSize: '24@ms',
        color: colors.black,
        fontFamily: fontNames.boldFont,
        textAlign: 'left',
        marginHorizontal: '16@s'
    },
    chooseYourCategoryText: {
        marginTop: '6@ms',
        lineHeight: '16@ms',
        fontSize: '14@ms',
        color: colors.black,
        fontFamily: fontNames.regularFont,
        opacity: 0.30,
        textAlign: 'left',
        marginHorizontal: '16@s'
    },
    searchMainView: {
        height: '40@vs',
        width: width - 32,
        paddingHorizontal: '12@ms',
        borderRadius: '4@ms',
        shadowRadius: '12@ms',
        shadowOpacity: '1@ms',
        alignItems: 'center',
        justifyContent:'space-between',
        backgroundColor: colors.white,
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOffset: { width: 0, height: 4 },
        alignSelf: 'center',
        elevation: '12@ms'
    },
    textInputStyle: {
        //lineHeight: '24@vs',
        fontSize: '14@ms',
        width:width/1.8,
        alignSelf:'center',
        color: colors.black,
        opacity: 0.30,
        fontFamily: fontNames.regularFont,
        padding: 0,
        //paddingHorizontal:'16@ms'
    },
    listItemMainView: {
        height: '144@vs',
        width: width - 32,
        alignSelf: 'center',
        borderRadius: '4@ms',
        shadowRadius: '12@ms',
        shadowOpacity: '1@ms',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOffset: { width: 0, height: 4 },
        alignSelf: 'center',
        elevation: '12@ms',
        marginBottom: '16@ms'
    },
    imageBackground: {
        height: '144@vs',
        width: width - 32,
        borderRadius: '4@ms',
        justifyContent: 'center'
    },
    listItemText: {
        fontSize: '24@ms',
        color: colors.white,
        fontFamily: fontNames.boldFont,
        marginHorizontal: '16@s',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    continue: {
        height: '48@vs',
        width: width - 48,
        borderRadius: '2@ms',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(61,212,222,1)',
        alignSelf: 'center'
    },
    chooseYourAccountType: {
        lineHeight: '32@ms',
        fontSize: '24@ms',
        color: 'black',
        fontFamily: fontNames.boldFont,
        textAlign: 'center'
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
        letterSpacing: "1@ms"
    },
});