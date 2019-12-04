import React, { Component } from 'react';

import {
    View,
    StatusBar,
    SafeAreaView,
    Image,
    Text,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';

//Third party packages
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Bubbles from 'react-native-loader/src/Bubbles';
import AsyncStorage from '@react-native-community/async-storage';

//Redux Imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserDataAction from '../../actions/userDataActions';

//Common components and helper methods
import styles from './PhoneNumberVerificationStyle'
import colors from '../../theme/colors';
import { Images } from '../../components/ImagesPath';
import { checkInternetAvailibility } from '../../helper/CheckInternet'
import strings from '../../constants/LocalizedStrings';
import { getApi } from '../../config/HitApis';
import { API_VERIFICATION } from '../../config/Urls'

class PhoneNumberVerification extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            one: '',
            two: '',
            three: '',
            four: '',
            isOneValid: false,
            isTwoValid: false,
            isThreeValid: false,
            isFourValid: false,
            visible: false,
            empty_character: ' ',
            accessToken: this.props.navigation.getParam('accessToken'),
           // userType:this.props.navigation.getParam('userType'),
        };
    }

    static navigationOptions = {
        header: null
    }

    componentDidMount() {
        checkInternetAvailibility()
    }

    _checkValidations = () => {
        let { one, two, three, four, isOneValid, isTwoValid, isThreeValid, isFourValid, isLoading } = this.state;
        if (checkInternetAvailibility()) {
            if (!one || !two || !three || !four) {
                alert("Please enter valid OTP to continue")
            }
            else if (!isOneValid && !isTwoValid && !isThreeValid && !isFourValid) {
                this.setState({ isLoading: true })
                let otp = one + two + three + four;
                var getUrl = API_VERIFICATION + '?token=' + this.state.accessToken + '&otp=' + otp
                getApi(getUrl, "", response => this.verificationApiResponse(response))
            }
            else {
            }
        }
        else {
            alert("No Internet")
        }
    }

    verificationApiResponse = (response) => {
        console.log(response);
        
        //alert(JSON.stringify(response))
        if (response != null) {
            if (response.data.statusCode == 200 || response.data.statusCode == 201) {
                console.log(response.data.info,'the data.info let chaeck')
                AsyncStorage.setItem('userData', JSON.stringify(response.data.info)).then(val=>{
                    this.props.actions.setUserData(response.data.info);
                        this.setState({ isLoading: false });
                        // console.log(response.data.info.userType,'39080q8008hhiuadhiuhudhfa03008009090098808');
                        // console.log(response.data.info,'hte idoahodjoajoj');
                        //this.props.navigation.navigate('homeChooseYourCategoryScreen',{home:true,userType:response.data.info.userType});
                        if (response.data.info.userType === "AGENCY") {
                            this.props.navigation.navigate("tabbarNavigation");
                        } else {
                            this.props.navigation.navigate("tabbarNavigationWithoutMember");
                        }
                    // alert(response.data.message);
                });
                // setTimeout(() => {
                    
                //     
                //     alert(response.data.message);
                // },700);
            }
            else {
                setTimeout(() => {
                    alert(response.data.message)
                }, 600);
            }
        }
        else
            alert(strings.networkError)
    }

    validate = (field, value) => {
        this.setState({ [field]: value });
        var Regex = /^[0-9]$/;
        switch (field) {
            case 'one': {
                if (!value.match(Regex)) {
                    this.setState({ isOneValid: true });
                }
                else {
                    this.setState({ isOneValid: false });
                    this.setState({ one: value })
                }
                break;
            }
            case 'two': {
                if (!value.match(Regex)) {
                    this.setState({ isTwoValid: true });
                }
                else {
                    this.setState({ isTwoValid: false });
                    this.setState({ two: value })
                }
                break;
            }
            case 'three': {
                if (!value.match(Regex)) {
                    this.setState({ isThreeValid: true });
                }
                else {
                    this.setState({ isThreeValid: false });
                    this.setState({ three: value })
                }
                break;
            }
            case 'four': {
                if (!value.match(Regex)) {
                    this.setState({ isFourValid: true });
                }
                else {
                    this.setState({ isFourValid: false });
                    this.setState({ four: value })
                }
                break;
            }
            case 'default': {
                alert('Incorrect OTP');
                break;
            }
        }
    }

    //***************Header contents**************** */
    renderContents() {
        const contactDetails=this.props.navigation.getParam("contactDetails");
        return (
            <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: colors.white }}>
                <View >
                    <View style={{ height: verticalScale(24) }} />
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}>
                        <Image style={{ marginLeft: moderateScale(24) }} source={Images.back} />
                    </TouchableOpacity>
                    <View style={{ height: verticalScale(48) }} />
                    <Text style={styles.forgotPasswordText}>{strings.verificationCode}</Text>
                    <View style={{ height: verticalScale(12) }} />
                    <Text style={styles.enterTheEmailAddressAssociatedWithYourAccount}>{strings.pleaseTypeTheVerificationCodeSentTo}</Text>
                    <Text style={styles.phoneNumberValue}>{`(${contactDetails.countryCode}) ${contactDetails.phoneNo}` }</Text>
                    <View style={{ height: verticalScale(76) }} />
                    <View style={{ flex: 0.15, flexDirection: 'row', justifyContent: 'space-around', }}>
                        <TextInput
                              selectionColor={colors.tabsActiveColor}
                            style={{ width: 48, borderBottomColor: '#E9EAED', borderBottomWidth: 2, fontSize: 40, width: 48, textAlign: 'center' }}
                            ref="first"
                            maxLength={1}
                            underlineColorAndroid='transparent'
                            returnKeyType="next"
                            keyboardType='numeric'
                            autoCorrect={false}
                            autoCapitalize='none'
                            onChangeText={(one) => {
                                this.validate('one', one)
                                if (one.length > 0) {
                                    this.refs.second.focus();
                                }
                            }
                            }
                        />
                        <TextInput
                              selectionColor={colors.tabsActiveColor}
                            style={{ width: 48, borderBottomColor: '#E9EAED', borderBottomWidth: 2, fontSize: 40, width: 48, textAlign: 'center' }}
                            ref="second"
                            maxLength={1}
                            underlineColorAndroid='transparent'
                            returnKeyType="next"
                            keyboardType='numeric'
                            autoCorrect={false}
                            autoCapitalize='none'
                            onChangeText={(two) => {
                                this.validate('two', two)
                                if (two.length == 0 || !two) {
                                    this.refs.first.focus();
                                }
                                else if (two.length > 0 && two) {
                                    this.refs.third.focus();
                                }
                            }
                            }
                        />
                        <TextInput
                          selectionColor={colors.tabsActiveColor}
                            style={{ width: 48, borderBottomColor: '#E9EAED', borderBottomWidth: 2, fontSize: 40, width: 48, textAlign: 'center' }}
                            ref="third"
                            maxLength={1}
                            underlineColorAndroid='transparent'
                            returnKeyType="next"
                            keyboardType='numeric'
                            autoCorrect={false}
                            autoCapitalize='none'
                            onChangeText={(three) => {
                                this.validate('three', three)
                                if (three.length == 0 || !three) {
                                    this.refs.second.focus();
                                }
                                else if (three.length > 0 && three) {
                                    this.refs.forth.focus();
                                }
                            }
                            }
                        />
                        <TextInput
                          selectionColor={colors.tabsActiveColor}
                            style={{ width: 48, borderBottomColor: '#E9EAED', borderBottomWidth: 2, fontSize: 40, width: 48, textAlign: 'center' }}
                            ref="forth"
                            maxLength={1}
                            underlineColorAndroid='transparent'
                            returnKeyType="done"
                            keyboardType='numeric'
                            autoCorrect={false}
                            autoCapitalize='none'
                            onChangeText={(four) => {
                                this.validate('four', four)
                                if (four.length == 0) {
                                    this.refs.third.focus();
                                }
                            }
                            }
                        />
                    </View>
                    <View style={{ height: verticalScale(32) }} />
                    <TouchableOpacity style={{ alignSelf: 'flex-end', marginRight: moderateScale(10) }} onPress={() => this._checkValidations()}>
                        <Image source={Images.submitBlue} />
                    </TouchableOpacity>
                    {
                        this.state.isLoading == true ?
                            <View style={styles.loader}>
                                <Bubbles size={14} color={colors.tabsActiveColor} />
                            </View>
                            :
                            null
                    }
                </View>
            </KeyboardAwareScrollView>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar backgroundColor={colors.black} barStyle="default" />
                {this.renderContents()}
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        userDataReducer: state.userDataReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(UserDataAction, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PhoneNumberVerification)