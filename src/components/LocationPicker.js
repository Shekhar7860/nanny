import React, { Component } from "react";

import {
	View,
	StatusBar,
	SafeAreaView,
	Image,
	Text,
	TouchableOpacity,
	AsyncStorage,
	ImageBackground,
	FlatList,
	PermissionsAndroid,
	Platform,
	Alert,
	Dimensions,
	TextInput,
	ScrollView
} from "react-native";

//Third party packages
import { verticalScale, moderateScale } from "react-native-size-matters";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import _ from "lodash"
//Redux Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserDataAction from "../actions/userDataActions";

//Common components and helper methods
// import styles from './CreatePostViewStyle'
import colors from "../theme/colors";
import { Images } from "./ImagesPath";
import Header from "./Header";
// import strings from '../../../../constants/LocalizedStrings';

class LocationPicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			latitude: 0,
			longitude: 0,
			address: ""
		};
	}

	static navigationOptions = {
		header: null
	};


    getAddress = (data, details = null) => {
        //console.log(data,'the data value');
        const countryObj=_.find(details.address_components,val=>{
			
			return _.includes(val.types,"country")
		});

        this.props.navigation.state.params.updateData(
            data.description,
            details.geometry.location.lat,
            details.geometry.location.lng,
            countryObj.long_name
        );
        this.props.navigation.goBack();
	
	};

	renderContents() {
        let {  appLang, textAlign } = this.props.userDataReducer;
        const flexDirection="row";
		return (
			<View style={{ flex: 1 }}>
				<Header
					title="Select Address"
					flexDirection={flexDirection}
					iconRight={Images.crossIcon}
					onPressRight={()=>this.props.navigation.goBack(null)}
				/>
				<GooglePlacesAutocomplete
					placeholder="Enter Location"
					minLength={2}
					autoFocus={false}
					returnKeyType={"default"}
					fetchDetails={true}
					listViewDisplayed={false}
					styles={{
						textInputContainer: {
							width: "100%"
						},
						description: {
							fontWeight: "bold"
						},
						predefinedPlacesDescription: {
							color: "#1faadb"
						}
					}}
					onPress={this.getAddress}
					currentLocation={false}
					nearbyPlacesAPI="GooglePlacesSearch"
					query={{
						// available options: https://developers.google.com/places/web-service/autocomplete
						key: "AIzaSyD0nhmGVsfQ3JwVaJeSa-yRKovdzMrEvwM",
						language: "en" // language of the results
						//types: "(cities)" // default: 'geocode'
					}}
				/>
			</View>
		);
	}

	render() {
		let { flexDirection, appLang, textAlign } = this.props.userDataReducer;
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
)(LocationPicker);
