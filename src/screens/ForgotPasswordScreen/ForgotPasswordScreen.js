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
import { Bubbles } from 'react-native-loader';

//Redux Imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserDataAction from '../../actions/userDataActions';

//Common components and helper methods
import styles from './ForgotPasswordScreenStyle'
import colors from '../../theme/colors';
import { Images } from '../../components/ImagesPath';
import { checkInternetAvailibility } from '../../helper/CheckInternet'
import strings from '../../constants/LocalizedStrings';
import { validateEmailId } from '../../helper/Validations';
import { postApi } from '../../config/HitApis';
import { API_FORGOT_PASSWORD } from '../../config/Urls'

class ForgotPasswordScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: ""
        };
    }

    static navigationOptions = {
        header: null
    }

    componentDidMount() {
        checkInternetAvailibility()
    }

    _checkValidations = () => {
        if (this.state.email == null || this.state.email.trim().length == 0) {
            alert("Please enter email id")
        }
        else if (!validateEmailId(this.state.email)) {
            alert("Please enter valid email id")
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
                const payload = {
                    "email": this.state.email,
                    "userType": "Stylist"
                }
                postApi(payload, API_FORGOT_PASSWORD, null, response => this.forgotPasswordApiResponse(response))
            }
            else
                alert("No Internet")
        }
    }

    forgotPasswordApiResponse = (response) => {
        this.setState({ isLoading: false })
        if (response != null) {
            if (response.data.statusCode == 200) {
                this.props.navigation.goBack()
                setTimeout(() => {
                    alert("Please check your email for new temporary password.")
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

    //***************Header contents**************** */
    renderContents() {
        return (
            <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: colors.white }}>

                <View >
                    <View style={{ height: verticalScale(24) }} />
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}>
                        <Image style={{ marginLeft: moderateScale(24) }} source={Images.back} />
                    </TouchableOpacity>
                    <View style={{ height: verticalScale(55) }} />
                    <Image style={{ alignSelf: 'center' }} source={Images.forgotPassword} />
                    <View style={{ height: verticalScale(48) }} />
                    <Text style={styles.forgotPasswordText}>{strings.forgotPassword}</Text>
                    <View style={{ height: verticalScale(12) }} />
                    <Text style={styles.enterTheEmailAddressAssociatedWithYourAccount}>{strings.enterTheEmailAddressAssociatedWithYourAccount}</Text>
                    <View style={{ height: verticalScale(76) }} />
                    <View>
                        <Text style={styles.inputLabel}>{strings.email}</Text>
                        <TextInput style={styles.textInputStyle}
                          selectionColor={colors.tabsActiveColor}
                            underlineColorAndroid="transparent"
                            placeholder=""
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType={"done"}
                            onChangeText={(email) => this.setState({ email })}
                            value={this.state.email} />
                        <View style={styles.inputLine} />
                    </View>
                    <View style={{ height: verticalScale(32) }} />
                    <TouchableOpacity style={styles.loginButton} onPress={() => this._checkValidations()}>
                        <Text style={styles.loginButtonText}>{strings.sendCaps}</Text>
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
export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordScreen)