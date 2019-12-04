
import React,{Component,ViewPropTypes} from "react";
import  {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity
} from 'react-native';

import commonStyles from "../../components/commonStyles";
import {ScaledSheet, moderateScale} from "react-native-size-matters";
import { fontNames } from "../../theme/fontFamily";
class DefaultTabBar extends Component{

componentDidMount(){
    console.log(this.props,'the properties');
}

//   getDefaultProps=()=> {
//     return {
//       activeTextColor: 'navy',
//       inactiveTextColor: 'black',
//       backgroundColor: null,
//     };
//   }

  renderTabOption=(name, page)=> {
  }

  renderTab = (name, page, isTabActive, onPressHandler)=> {
    const { activeTextColor, inactiveTextColor, textStyle,newNotifications} = this.props;
    console.log(newNotifications,'the notifications value');

    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    const fontWeight = isTabActive ? 'bold' : 'normal';

    return <TouchableOpacity
      style={{flex: 1, }}
      key={page}
      accessible={true}
      accessibilityLabel={name}
      accessibilityTraits='button'
      onPress={() => onPressHandler(page)}
    >
      <View style={[styles.tab, this.props.tabStyle, ]}>
        <Text style={[{color: textColor, fontWeight,fontFamily:fontNames.regularFont }, textStyle, ]}>
          {name}
        </Text>
        {page ==0&& newNotifications&&<View style={{...commonStyles.notificationBadgeContianer,right:moderateScale(10)}}>
            <Text style={{...commonStyles.notificationBadgeText}}>10</Text>
        </View>}
      </View>
    </TouchableOpacity>;
  }

  render() {
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: 4,
      backgroundColor: 'navy',
      bottom: 0,
    };

    const translateX = this.props.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0,  containerWidth / numberOfTabs],
    });
    return (
      <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor, }, this.props.style, ]}>
        {this.props.tabs.map((name, page) => {
          const isTabActive = this.props.activeTab === page;
          const renderTab = this.props.renderTab || this.renderTab;
          return renderTab(name, page, isTabActive, this.props.goToPage);
        })}
        <Animated.View
          style={[
            tabUnderlineStyle,
            {
              transform: [
                { translateX },
              ]
            },
            this.props.underlineStyle,
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  tabs: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
  },
});

export default DefaultTabBar;
