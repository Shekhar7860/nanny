import React, { Component } from 'react';

import {
  Text,
  TouchableOpacity,
  NativeModules,
  StyleSheet,
  Platform,
  Image,
  SafeAreaView
} from 'react-native';

//Redux Imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserDataAction from '../actions/userDataActions';

//Common components and helper methods
import { TabImages } from './ImagesPath'
import colors from '../theme/colors'
import strings from '../constants/LocalizedStrings';


class TabComponent extends Component {
  constructor() {
    super();
    this.state = {
      tabName: [
        "Home",
        "Members",
        "My Bookings",
        "Profile"
      ]
    }
  }

  render() {
    const navigation = this.props.navigation;
    console.log(this.props.tabNameArray,'the tabArray value is as follopw')
    const { routes, index } = this.props.navigation.state;
    return (
      <SafeAreaView style={styles.tabContainer}  >
        {routes.map((route, idx) => {
          const color = index === idx ? colors.tabsActiveColor : colors.tabsInactiveColor;
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(route.routeName);
              }}

              style={styles.tab}
              key={route.routeName}
            >
              {index === idx ?
                <Image source={TabImages.selected[idx]} />
                :
                <Image source={TabImages.unselected[idx]} />
              }
              <Text style={{ color, fontSize: 12, lineHeight: 16 }}>

                {this.props.tabNameArray[idx]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
  tabContainer: {
    flexDirection: 'row',
    height: NativeModules.DeviceInfo.isIPhoneX_deprecated == true ? 84 : 56,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,

  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: NativeModules.DeviceInfo.isIPhoneX_deprecated == true ? 16 : 0,

    borderRadius: 4,
  },
});

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
export default connect(mapStateToProps, mapDispatchToProps)(TabComponent)