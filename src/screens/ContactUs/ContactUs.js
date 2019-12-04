import React, { Component } from "react";
import { View, Text, SafeAreaView,Image } from "react-native";
import Header from "../../components/Header";

//Redux Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserDataAction from "../../actions/userDataActions";

//Common components and helper methods
import commonStyles from "../../components/commonStyles";
import styles from "./ContactUsStyle";
import colors from "../../theme/colors";
import strings from '../../constants/LocalizedStrings';
import { Images } from "../../components/ImagesPath";
import Modal from "react-native-modal";
import { moderateScale } from "react-native-size-matters";

class ContactUs extends Component {
	render() {
        const {flexDirection,userData}=this.props.userDataReducer;
        const positionRightToggle = flexDirection == "row" ? "Right" : "Left";
		const positionLeftToggle = flexDirection == "row" ? "Left" : "Right";
        const {adminContactDetails}=userData;
		return (
			<SafeAreaView>
				<Header
                    flexDirection={flexDirection}
					iconLeft={Images.back}
					iconRight={Images.small_logo}
					onPressLeft={() => {
						this.props.navigation.goBack(null);
					}}
					title="Contact Us"
				/>
                <View style={{alignItems:'center',paddingTop:moderateScale(40),paddingBottom:moderateScale(31),borderWidth:moderateScale(1),borderColor:colors.textInputBottomBorder,paddingHorizontal:moderateScale(24),flexDirection}}>
                    <Image source={Images.phone}/>
                    <Text style={{[`margin${positionLeftToggle}`]:moderateScale(21)}}>{adminContactDetails.phoneNo}</Text>
                </View>
                <View style={{alignItems:"center",paddingTop:moderateScale(30),paddingHorizontal:moderateScale(24),flexDirection}}>
                    <Image source={Images.message}/>
                    <Text style={{[`margin${positionLeftToggle}`]:moderateScale(21)}} >{adminContactDetails.email}</Text>
                </View>
			</SafeAreaView>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(UserDataAction, dispatch)
	};
}
export default connect(state => state,mapDispatchToProps)(ContactUs);
