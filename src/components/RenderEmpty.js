import React from 'react';
import {View,Image,Dimensions} from 'react-native';

//Common components and helper methods
import { Images } from "./ImagesPath";

const { width, height } = Dimensions.get('window')

export default  (props) => {
    return (
        <View style={{ height: height / 2, alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Image source={Images.noDataFound} />
    </View>
    );
};