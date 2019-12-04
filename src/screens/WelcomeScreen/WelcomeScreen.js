import React, { Component } from 'react';

import {
    View,
    StatusBar,
    SafeAreaView,
    Image,
    Text,
    TouchableOpacity,
    ImageBackground
} from 'react-native';

//Third party packages
import { verticalScale,moderateScale } from 'react-native-size-matters';

//Redux Imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserDataAction from '../../actions/userDataActions';

//Common components and helper methods
import styles from './WelcomeScreenStyle'
import colors from '../../theme/colors';
import { Images } from '../../components/ImagesPath';
import strings from '../../constants/LocalizedStrings';

class WelcomeScreen extends Component {

    static navigationOptions = {
        header: null
    }

    renderContents() {
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground style={styles.mainImageDimensions} source={Images.loginBackground}>
                    <View style={{ flex: 0.8 }}>
                        <View style={{ height: verticalScale(85) }} />
                        {/* <Image style={{alignSelf: 'center' }} source={Images.logo} /> */}
                    </View>
                    <View style={{ flex: 0.2 }}>
                        <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                            <TouchableOpacity style={styles.register} onPress={() => this.props.navigation.navigate('chooseAccountType')}>
                                <Text style={styles.registerText}>{strings.registerCaps}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.login} onPress={() => this.props.navigation.navigate('login')}>
                                <Text style={styles.loginText}>{strings.loginCaps}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: verticalScale(16) }} />
                        <Text style={styles.bottomText}>{strings.byLoggingInYouAgreeToNoovvoo}</Text>
                        <Text style={styles.bottomGreenText} onPress={() => alert('Privacy Policy')}>{strings.privacyPolicy} <Text style={styles.bottomText} onPress={() => console.log('')}>{strings.and} </Text><Text onPress={() => alert('Terms of Use')}>{strings.termsOfUse}</Text></Text>
                    </View>
                </ImageBackground>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar backgroundColor={colors.black} barStyle="default"/>
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
export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen)