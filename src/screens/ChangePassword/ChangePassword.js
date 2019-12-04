import React, { Component } from "react";
import {
    View,
    StatusBar,
    SafeAreaView,
    Image,
    Text,
    TouchableOpacity,
    AsyncStorage,
    TextInput,
    KeyboardAvoidingView,
    ScrollView,
    FlatList,
    Platform
} from "react-native";

//Third party packages
import { verticalScale, moderateScale, scale } from "react-native-size-matters";
import Bubbles from "react-native-loader/src/Bubbles";

//Redux Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserDataAction from "../../actions/userDataActions";

//Common components and helper methods
import styles from "./ChangePasswordStyle";
import Header from "../../components/Header";
import colors from "../../theme/colors";
import { Images } from "../../components/ImagesPath";
import { checkInternetAvailibility } from "../../helper/CheckInternet";
import strings from "../../constants/LocalizedStrings";
import { postApi, putApi } from "../../config/HitApis";
import { API_REGISTER, API_CHANGE_PASSWORD } from "../../config/Urls";
import commonStyles from "../../components/commonStyles";
import { clearAsyncStorage }  from "../../helper/clearAsyncStorage";



class ChangePassword extends Component {


    state = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        isLoading: false
    }

    onChangeText = id => val => {
        this.setState({ [id]: val.trim() })
    }

    validData = ({ newPassword, oldPassword, confirmPassword }) => {
        if (oldPassword.length < 1) {
            alert("Please enter your old password");
        }
        else if (oldPassword.length < 6) {
            alert("The length of old password should be greater than 5");
        }
        else if (newPassword.length < 1) {
            alert("Please enter your new password");
            return false
        }
        else if (newPassword.length < 6) {
            alert("The length of new password should be greater than 5");
            return false
        }
        else if (confirmPassword.length < 1) {
            alert("Please enter confirm password");
            return false
        }
        else if (newPassword !== confirmPassword) {
            alert("New Password didn't matched with confirm password");
            return false
        } else {
            return true
        }

    }

    onSubmit = () => {
        const { newPassword, oldPassword, confirmPassword } = this.state;
        console.log(newPassword, oldPassword, confirmPassword)
        if (this.validData({ newPassword, oldPassword, confirmPassword })) {
            this.setState({ isLoading: true });
            const data = new FormData();
            data.append("oldPassword", oldPassword);
            data.append("newPassword", newPassword);

            putApi(data, API_CHANGE_PASSWORD, null, this.props.userDataReducer.userData.accessToken, this.onChangePasswordApiResponse);
        }
    }

    onChangePasswordApiResponse = response => {
        if (response) {
            const statusCode = response.data.statusCode
            if (statusCode == 200) {
                debugger
                clearAsyncStorage()
                this.props.navigation.navigate('signOut');
                setTimeout(() => {
                    alert("Password changed successfully, please log in again with new password");
                }, 600);

            } else if (statusCode === 401) {
                clearAsyncStorage()
                this.props.navigation.navigate('signOut');
                setTimeout(() => {
                    alert("Session Expired, please log In again to continue");
                }, 600);

            } else {
                alert(response.data.message)
                this.setState({ isLoading: false });
            }
        } else {
            alert("Network Error");
        }
    }
    render() {
        const { flexDirection, textAlign } = this.props.userDataReducer;
        return (
            <>
                <SafeAreaView style={{ flex: 1 }}>
                    <Header
                        title="Change Password"
                        flexDirection={flexDirection}
                        iconLeft={Images.back}
                        iconRight={Images.small_logo}
                        onPressLeft={() => this.props.navigation.goBack(null)}
                    />
                    <View style={{ paddingHorizontal: moderateScale(16), paddingTop: moderateScale(16) }}>
                        <View style={{ ...commonStyles.formContainer, borderBottomColor: colors.textInputBottomBorder, borderBottomWidth: moderateScale(1) }}>
                            <Text style={commonStyles.formText}>Old Password</Text>
                            <TextInput secureTextEntry={true} value={this.state.oldPassword} onChangeText={this.onChangeText("oldPassword")} style={commonStyles.formTextInput} />
                        </View>
                        <View style={{ ...commonStyles.formContainer, borderBottomColor: colors.textInputBottomBorder, borderBottomWidth: moderateScale(1) }}>
                            <Text style={commonStyles.formText}>New Password</Text>
                            <TextInput secureTextEntry={true} value={this.state.newPassword} onChangeText={this.onChangeText("newPassword")} style={commonStyles.formTextInput} />
                        </View>
                        <View style={{ ...commonStyles.formContainer, borderBottomColor: colors.textInputBottomBorder, borderBottomWidth: moderateScale(1) }}>
                            <Text style={commonStyles.formText}>Confirm New Password</Text>
                            <TextInput secureTextEntry={true} value={this.state.confirmPassword} onChangeText={this.onChangeText("confirmPassword")} style={commonStyles.formTextInput} />
                        </View>
                        <TouchableOpacity onPress={this.onSubmit} style={{ marginVertical: moderateScale(16), backgroundColor: colors.tabsActiveColor, height: moderateScale(48), justifyContent: 'center' }}>
                            <Text style={commonStyles.bottomButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>

                </SafeAreaView>
                {
                    this.state.isLoading == true ?
                        <View style={{ ...commonStyles.loader, zIndex: 200 }}>
                            <Bubbles size={14} color={colors.tabsActiveColor} />
                        </View>
                        :
                        null
                }
            </>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        userDataReducer: state.userDataReducer
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(UserDataAction, dispatch)
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChangePassword);
