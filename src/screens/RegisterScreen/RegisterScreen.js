import React, { Component } from 'react';

import {
    View,
    StatusBar,
    SafeAreaView,
    Image,
    Text,
    TouchableOpacity,
    AsyncStorage,
    TextInput,
    Platform
} from 'react-native';

//Third party packages
//import { Bubbles } from 'react-native-loader';
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DatePicker from 'react-native-datepicker';
import CountryPicker from 'react-native-country-picker-modal'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import moment from 'moment'

//Redux Imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserDataAction from '../../actions/userDataActions';

//Common components and helper methods
import styles from './RegisterScreenStyle'
import { Images } from '../../components/ImagesPath';
import strings from '../../constants/LocalizedStrings';
import colors from '../../theme/colors';
import { checkInternetAvailibility } from '../../helper/CheckInternet'
import { validateEmailId, isNumber } from '../../helper/Validations';
import _ from "lodash";


//import { changePassword } from '../../config/HitApis'

var today = new Date();
var date =`${(today.getFullYear() - 18)}-${parseInt(today.getMonth() + 1) < 10 ? "0" + parseInt(today.getMonth() + 1) : parseInt(today.getMonth() + 1)}-${today.getDate() < 10 ? "0" + today.getDate() : today.getDate()}`;

class RegisterScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            email: '',
            firstName: '',
            lastName: '',
            agencyName: '',
            password: '',
            dateOfBirth: 'Select date',
            date: date,
            isLoginSelected: true,
            showPassword: true,
            crossIcon: false,
            selectedCountryCode: "+961",
            selectedCountry: 'Select Country',
            cca2: "LB",
            postalZipCode: '',
            isChecked: false,
            latitude: 0,
            longitude: 0,
            address: '',
            phoneNumber: "",
            country:"",
            userType: this.props.navigation.getParam('userType')
        };
    }

    static navigationOptions = {
        header: null
    }



    formattedDate(d = new Date) {
        let month = String(d.getMonth() + 1);
        let day = String(d.getDate());
        const year = String(d.getFullYear());
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return `${day}/${month}/${year}`;
    }

    componentDidMount() {
        checkInternetAvailibility()
    }

    _checkValidations = () => {
        //this.props.navigation.navigate('setPassword')
        if (this.state.firstName == null || this.state.firstName.trim().length == 0) {
            alert("Please enter first name")
        }
        else if (this.state.lastName == null || this.state.lastName.trim().length == 0) {
            alert("Please enter last name")
        }
        else if (this.state.userType === 'AGENCY' && (this.state.agencyName == null || this.state.agencyName.trim().length == 0)) {
            alert("Please enter agency name")
        }
        else if (this.state.selectedCountryCode == "Select") {
            alert("Please select country code")
        }
        else if (this.state.phoneNumber == null || this.state.phoneNumber.trim().length == 0) {
            alert("Please enter phone number")
        }
        else if (this.state.phoneNumber.length < 5 || this.state.phoneNumber.length > 15) {
            alert("The phone number must be 5-15 digits")
        }
        else if (this.state.email == null || this.state.email.trim().length == 0) {
            alert("Please enter email id")
        }
        else if (!validateEmailId(this.state.email)) {
            alert("Please enter valid email id")
        }
        else if (this.state.address == null || this.state.address.trim().length == 0) {
            alert("Please enter an address")
        }
        else if (this.state.postalZipCode == null || this.state.postalZipCode.trim().length==0) {
            alert("Please enter postal or zip code")
        }
        else if (this.state.postalZipCode.trim().length < 3) {
            alert("Please enter valid postal or zip code")
        }
        else if (this.state.date === new Date().toISOString().split("T")[0]) {
            alert("Please enter valid DOB")
        }
        else if (this.state.isChecked === false) {
            alert("Please accept the terms and conditions")
        }
        else {
            if (checkInternetAvailibility()) {
                let agencyData = {}
                if (this.state.userType === 'AGENCY') {
                    agencyData["saloonName"] = this.state.agencyName;
                }
                this.setState({ isLoading: true })
                var platform;
                if (Platform.OS === 'ios')
                    platform = "IOS"
                else
                    platform = "ANDROID"
                const registerData = {
                    "firstName": this.state.firstName,
                    "lastName": this.state.lastName,
                    "description": "string",
                    "email": this.state.email,
                    "password": "",
                    "dob": this.state.date,
                    "contactDetails": {
                        "phoneNo": this.state.phoneNumber,
                        "countryCode": this.state.selectedCountryCode,
                        "countryCodeISO": this.state.cca2
                    },
                    "addressDetails": {
                        "address": this.state.address,
                        "postalCode": this.state.postalZipCode,
                        "country": this.state.country,
                        "coordinates": [this.state.longitude, this.state.latitude]
                    },
                    "registerFrom": platform,
                    "userType": this.state.userType,
                    "offset": 0,
                    "deviceToken": "fggfgf23343gfggffg",
                    ...agencyData
                }
                this.props.navigation.navigate('setPassword', { registerData: registerData })
            }
            else
                alert("No Internet")
        }
    }
    getAddress = (data, details = null) => {
        console.log(data, "the data value");
        const countryObj = _.find(details.address_components, val => {
            return _.includes(val.types, "country");
        });
        this.setState({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            address: data.description,
            country: countryObj.long_name
        });
    };
    _selectLogin = () => {
        this.setState({ isLoginSelected: true })
    }

    _selectRegister = () => {
        this.setState({ isLoginSelected: false })
    }

    _showHidePassword = () => {
        this.setState({ showPassword: !this.state.showPassword });
        this.setState({ crossIcon: !this.state.crossIcon });
    }

    onChanged(text) {
        if(text.charAt(0)=="0"){
            text=""
        }
        this.setState({
            phoneNumber: text.replace(/[^0-9]/g, ''),
        });
    }

    _checkUnCheck = () => {
        this.setState({ isChecked: !this.state.isChecked });
    }

    renderContents() {
        return (
            <KeyboardAwareScrollView keyboardShouldPersistTaps="always" style={{ flex: 1, backgroundColor: colors.white }}>
                <View>
                    {/* <Image style={styles.topCornerImage} source={Images.topCornerRegister} /> */}
                    <View style={{ height: verticalScale(24) }} />
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}>
                        <Image style={{ marginLeft: moderateScale(24) }} source={Images.back} />
                    </TouchableOpacity>
                    <View style={{ height: verticalScale(37) }} />
                    <View style={{ marginLeft: moderateScale(23) }}>
                        <Text style={styles.loginTextBold}>{strings.register}</Text>
                        <View style={{ height: verticalScale(9) }} />
                        {/* <View style={styles.selectedLine} /> */}
                    </View>
                    <View style={{ height: verticalScale(58) }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: moderateScale(23) }}>
                        <View style={styles.inputMainView}>
                            <Text style={styles.inputLabelHalf}>{strings.firstName}</Text>
                            <TextInput style={styles.textInputStyleHalf}
                              selectionColor={colors.tabsActiveColor}
                                underlineColorAndroid="transparent"
                                placeholder=""
                                autoCapitalize="none"
                                keyboardType="email-address"
                                returnKeyType={"next"}
                                onChangeText={(firstName) => this.setState({ firstName })}
                                onSubmitEditing={() => this.lastName.focus()}
                                value={this.state.firstName} />
                            <View style={styles.inputLineHalf} />
                        </View>
                        <View style={styles.inputMainView}>
                            <Text style={styles.inputLabelHalf}>{strings.lastName}</Text>
                            <TextInput style={styles.textInputStyleHalf}
                              selectionColor={colors.tabsActiveColor}
                                ref={lastName => this.lastName = lastName}
                                underlineColorAndroid="transparent"
                                placeholder=""
                                autoCapitalize="none"
                                keyboardType="email-address"
                                returnKeyType={"next"}
                                onChangeText={(lastName) => this.setState({ lastName })}
                                onSubmitEditing={() => this.agencyName.focus()}
                                value={this.state.lastName} />
                            <View style={styles.inputLineHalf} />
                        </View>
                    </View>
                    {
                        this.state.userType === 'AGENCY' ?
                            <View>
                                <View style={{ height: verticalScale(28) }} />
                                <View style={styles.inputMainView}>
                                    <Text style={styles.inputLabel}>{strings.agency}</Text>
                                    <TextInput style={styles.textInputStyle}
                                      selectionColor={colors.tabsActiveColor}
                                        ref={agencyName => this.agencyName = agencyName}
                                        underlineColorAndroid="transparent"
                                        placeholder=""
                                        autoCapitalize="none"
                                        keyboardType="default"
                                        returnKeyType={"next"}
                                        onChangeText={(agencyName) => this.setState({ agencyName })}
                                        onSubmitEditing={() => this.phoneNumber.focus()}
                                        value={this.state.agencyName} />
                                    <View style={styles.inputLine} />
                                </View>
                            </View>
                            :
                            <View />
                    }

                    <View style={{ height: verticalScale(28) }} />
                    <View style={styles.inputMainView}>
                        <Text style={styles.inputLabel}>{strings.dateOfBirth}</Text>
                        <DatePicker
                            style={styles.dateView}
                            maxDate={new Date()}
                            date={this.state.date}
                            mode="date"
                            // placeholder={this.state.dateOfBirth}
                            format="YYYY-MM-DD"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            iconSource={Images.downArrow}
                            customStyles={{
                                dateIcon: styles.dateIcon,
                                dateInput: styles.dateInput,
                                btnTextConfirm: {
                                    color: colors.tabsActiveColor,
                                },
                                btnTextCancel: {
                                    color: colors.tabsActiveColor,
                                },
                                dateText: styles.dateText
                            }}
                            onDateChange={(date) => { this.setState({ date: date }) }}
                        />
                        <View style={styles.inputLine} />
                    </View>
                    <View style={{ height: verticalScale(28) }} />
                    <View style={styles.inputMainView}>
                        <Text style={styles.inputLabel}>{strings.phoneNumber}</Text>
                        <View style={{ flexDirection: 'row', marginHorizontal: moderateScale(23) }}>
                            <View style={styles.countryCodeInnerContainer}>
                                <CountryPicker style={styles.countryCodeInnerContainer}
                                    onChange={value => {
                                        console.log(value, 'the value selected');
                                        this.setState({ cca2: value.cca2, selectedCountry:value.cca2, selectedCountryCode: '+' + value.callingCode })
                                    }}
                                    cca2={this.state.cca2}
                                    filterable
                                    autoFocusFilter={false}
                                    closeable={true}
                                />
                                <View pointerEvents="none" style={styles.countryCodeView}>
                                    <Text pointerEvents="none" numberOfLines={1} ellipsizeMode='tail' style={styles.countryCodeText}>({this.state.selectedCountryCode})</Text>
                                </View>
                                <Image style={{ position: "absolute", right: 0, height: verticalScale(10), width: scale(10), marginTop: 6 }} source={Images.downFilledArrow} />
                            </View>
                            <TextInput style={styles.textInputPhoneStyle}
                              selectionColor={colors.tabsActiveColor}
                                ref={phoneNumber => this.phoneNumber = phoneNumber}
                                underlineColorAndroid="transparent"
                                placeholder=""
                                textContentType='telephoneNumber'
                                contextMenuHidden={true}
                                dataDetectorTypes='phoneNumber'
                                keyboardType='number-pad'
                                onChangeText={(text) => this.onChanged(text)}
                                returnKeyType={"next"}
                                onSubmitEditing={() => this.email.focus()}
                                value={this.state.phoneNumber} />
                        </View>
                        <View style={styles.inputLinePhone} />
                    </View>
                    <View style={{ height: verticalScale(28) }} />
                    <View style={styles.inputMainView}>
                        <Text style={styles.inputLabel}>{strings.email}</Text>
                        <TextInput style={styles.textInputStyle}
                          selectionColor={colors.tabsActiveColor}
                            ref={email => this.email = email}
                            underlineColorAndroid="transparent"
                            placeholder="email"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType={"next"}
                            onChangeText={(email) => this.setState({ email })}
                            value={this.state.email} />
                        <View style={styles.inputLine} />
                    </View>
                    <View style={{ height: verticalScale(30) }} />
                    <Text style={styles.inputLabel}>{strings.address}</Text>
                    <GooglePlacesAutocomplete
                        placeholder=''
                        minLength={2}
                        autoFocus={false}
                        returnKeyType={'default'}
                        fetchDetails={true}
                        listViewDisplayed={false}
                        styles={{
                            textInputContainer: {
                                backgroundColor: 'rgba(0,0,0,0)',
                                borderTopWidth: 0,
                                marginLeft: 6,
                                borderBottomWidth: 0
                            },
                            textInput: styles.addressTextInputStyle,
                            predefinedPlacesDescription: {
                                color: '#1faadb'
                            },
                        }}
                        onPress={this.getAddress}
                        currentLocation={false}
                        nearbyPlacesAPI='GooglePlacesSearch'
                        query={{
                            // available options: https://developers.google.com/places/web-service/autocomplete
                            key: 'AIzaSyD0nhmGVsfQ3JwVaJeSa-yRKovdzMrEvwM',
                            language: 'en' // language of the results
                           // types: '(cities)' // default: 'geocode'
                        }}
                        textInputProps={{
                            onChangeText: (val) => {
                                if (val === "") {
                                    this.setState({ address: '',country:"" })
                                }
                            }
                        }}
                    />
                    <View style={styles.addressInputLine} />
                    <View style={{ height: verticalScale(28) }} />
                    <View >
                        <Text style={styles.inputLabel}>{strings.postalZipCode}</Text>
                        <TextInput style={styles.textInputStyle}
                          selectionColor={colors.tabsActiveColor}
                            //ref={lastName => this.lastName = lastName}
                            underlineColorAndroid="transparent"
                            placeholder=""
                            autoCapitalize="none"
                            returnKeyType={"next"}
                            onChangeText={(postalZipCode) =>{
                               postalZipCode= postalZipCode.replace(/[^0-9A-Za-z]/g, "")
                                this.setState({ postalZipCode })}
                            }
                            //onSubmitEditing={() => this.agencyName.focus()}
                            value={this.state.postalZipCode} />
                        <View style={styles.inputLine} />
                    </View>
                    <View style={{ height: verticalScale(28) }} />
                    <View style={styles.inputMainView}>
                        <Text style={styles.inputLabel}>{strings.country}</Text>
                        <Text style={styles.textInputStyle}>{this.state.country}</Text>
                        <View style={styles.inputLine} />
                    </View>

                    <View style={{ height: verticalScale(24) }} />
                    <View style={{ flexDirection: 'row', marginHorizontal: moderateScale(23) }}>
                        <TouchableOpacity activeOpacity={0.5} style={{ marginTop: verticalScale(5) }} onPress={() => this._checkUnCheck()}>
                            {
                                this.state.isChecked === false ?
                                    <Image source={Images.unCheck} />
                                    :
                                    <Image source={Images.check} />
                            }
                        </TouchableOpacity>
                        <Text style={styles.bottomText}>{strings.byLoggingInYouAgreeToNoovvoo}<Text style={styles.bottomBlackText} onPress={() => alert("Privacy Policy")}> {strings.privacyPolicyNextLine}</Text><Text style={styles.bottomText}> {strings.and} </Text><Text style={styles.bottomBlackText} onPress={() => alert("Terms of Use")}>{strings.termsOfUse}</Text>.</Text>
                    </View>
                    <View style={{ height: verticalScale(28) }} />
                    <TouchableOpacity style={styles.loginButton} onPress={() => this._checkValidations()}>
                        <Text style={styles.loginButtonText}>{strings.continueCaps}</Text>
                    </TouchableOpacity>
                    <View style={{ height: verticalScale(28) }} />
                </View>
            </KeyboardAwareScrollView>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar
                    barStyle="default"
                />
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
export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen)