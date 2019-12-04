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
import { StackActions } from 'react-navigation';

//Redux Imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserDataAction from '../../actions/userDataActions';

//Common components and helper methods
import styles from './SetPasswordScreenStyle'
import colors from '../../theme/colors';
import { Images } from '../../components/ImagesPath';
import { checkInternetAvailibility } from '../../helper/CheckInternet'
import strings from '../../constants/LocalizedStrings';
import { postApi } from '../../config/HitApis';
import { API_REGISTER } from '../../config/Urls'

const popAction = StackActions.pop({
    n: 3,
  });

class SetPasswordScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            password: "",
            showPassword: true,
            crossIcon: false,
            registerData: this.props.navigation.getParam('registerData'),
            isLoading: false
        };
    }

    static navigationOptions = {
        header: null
    }

    componentDidMount() {
        checkInternetAvailibility()
    }

    _checkValidations = () => {
        if (this.state.password == null || this.state.password.trim().length == 0) {
            alert("Please enter password")
        }
        else {
            if (checkInternetAvailibility()) {
                this.setState({ isLoading: true })
                // AsyncStorage.getItem('deviceToken').then((keyValue) => {
                //     console.warn('tok '+JSON.parse(keyValue))
                //     var value = JSON.parse(keyValue)
                //     this._hitLoginApi(value)
                // }, (error) => {
                //     console.log(error)
                // });
                this.state.registerData.password = this.state.password
                console.warn(this.state.registerData)
                postApi(this.state.registerData, API_REGISTER, null, response => this.registerApiResponse(response))
            }
            else
                alert("No Internet")
        }
    }

    registerApiResponse = (response) => {
        console.log(response,'hte resposne from server')
        this.setState({ isLoading: false })
        //alert(JSON.stringify(response))
        if (response != null) {
            if (response.data.statusCode == 200 || response.data.statusCode == 201) {
                this.props.navigation.dispatch(popAction)
                setTimeout(() => {
                    alert("Please check the verification link on your Email-Id to activate your account")
                }, 600);
            }
            else {
                setTimeout(() => {
                    alert(response.data.message)
                }, 600);
            }
        }
        else
            alert("Network Error")
    }

    _showHidePassword = () => {
        this.setState({ showPassword: !this.state.showPassword });
        this.setState({ crossIcon: !this.state.crossIcon });
    }

    //***************Header contents**************** */
    renderContents() {
        return (
            <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: colors.white }}>
                <View >
                    <View style={{ height: verticalScale(24) }} />
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}>
                        <Image style={{ marginLeft: moderateScale(24) }} source={Images.back} />
                    </TouchableOpacity>
                    <View style={{ height: verticalScale(48) }} />
                    <Text style={styles.forgotPasswordText}>{strings.setPassword}</Text>
                    <View style={{ height: verticalScale(12) }} />
                    <Text style={styles.enterTheEmailAddressAssociatedWithYourAccount}>{strings.setAPasswordForYourNewAccount}</Text>
                    <Text style={styles.phoneNumberValue}>({this.state.registerData.contactDetails.countryCode}) {this.state.registerData.contactDetails.phoneNo}</Text>
                    <View style={{ height: verticalScale(76) }} />
                    <View style={styles.inputMainView}>
                        <Text style={styles.inputLabel}>{strings.password}</Text>
                        <View>
                            <TextInput style={styles.textInputStyle}
                                selectionColor={colors.tabsActiveColor}
                                ref={password => this.password = password}
                                underlineColorAndroid="transparent"
                                placeholder=""
                                autoCapitalize="none"
                                keyboardType="default"
                                secureTextEntry={this.state.showPassword}
                                returnKeyType={"done"}
                                onChangeText={(password) => this.setState({ password })}
                                value={this.state.password} />
                            {
                                this.state.crossIcon == false ?
                                    <TouchableOpacity activeOpacity={0.5} style={styles.visibilityIconStyle} hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }} onPress={() => this._showHidePassword()}>
                                        <Image source={Images.visibilityIconLogin} />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity activeOpacity={0.5} style={styles.visibilityIconStyle} hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }} onPress={() => this._showHidePassword()}>
                                        <Image source={Images.visibilityHideIconLogin} />
                                    </TouchableOpacity>
                            }
                        </View>
                        <View style={styles.inputLine} />
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
export default connect(mapStateToProps, mapDispatchToProps)(SetPasswordScreen)