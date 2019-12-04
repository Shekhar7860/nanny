import React, { Component } from 'react';

import {
    View,
    StatusBar,
    SafeAreaView,
    Image,
    Text,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';

//Third party packages
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';

//Redux Imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserDataAction from '../../actions/userDataActions';

//Common components and helper methods
import styles from './ChooseAccountTypeStyle'
import colors from '../../theme/colors';
import { Images } from '../../components/ImagesPath';
import strings from '../../constants/LocalizedStrings';

class ChooseAccountType extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isSalonSelected: true,
            isFreelancerSelected: false,
            salonBackgroundColor: 'rgba(0,0,0,0.05)',
            freelancerBackgroundColor: 'transparent',
            userType: 'AGENCY'
        };
    }

    static navigationOptions = {
        header: null
    }

    _selectSalon = () => {
        this.setState({ isSalonSelected: true, isFreelancerSelected: false, salonBackgroundColor: 'rgba(0,0,0,0.05)', freelancerBackgroundColor: 'transparent', userType: 'AGENCY' })
    }

    _selectFreelancer = () => {
        this.setState({ isSalonSelected: false, isFreelancerSelected: true, salonBackgroundColor: 'transparent', freelancerBackgroundColor: 'rgba(0,0,0,0.05)', userType: 'FREELANCER' })
    }

    //***************Header contents**************** */
    renderContents() {
        return (
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                <View style={{ height: verticalScale(24) }} />
                <TouchableOpacity onPress={() => this.props.navigation.goBack()} hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}>
                    <Image style={{ marginLeft: moderateScale(24) }} source={Images.back} />
                </TouchableOpacity>
                <View style={{ height: verticalScale(24) }} />
                <Text style={styles.chooseYourAccountType}>{strings.chooseYourAccountType}</Text>
                <View style={{ height: verticalScale(8) }} />
                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => this._selectSalon()}>
                    <Image source={this.state.isSalonSelected?Images.salonSelected:Images.salonIcon} />
                </TouchableOpacity>
                <Text style={styles.typeText}>{strings.salon}</Text>

                <View style={{ height: verticalScale(8) }} />
                <View>
                    <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => this._selectFreelancer()}>
                        <Image source={this.state.isFreelancerSelected?Images.freelancerSelected:Images.freelancerIcon} />
                    </TouchableOpacity>
                    <Text style={styles.typeText}>{strings.freelancer}</Text>
                </View>
                <View style={{ height: verticalScale(32) }} />
                <TouchableOpacity style={styles.continue} onPress={() => this.props.navigation.navigate('register', { userType: this.state.userType })}>
                    <Text style={styles.loginText}>{strings.continueCaps}</Text>
                </TouchableOpacity>
            </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(ChooseAccountType)