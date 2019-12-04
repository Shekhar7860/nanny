import { Platform } from 'react-native';
import NetInfo from "@react-native-community/netinfo";

var status = undefined;
module.exports.checkInternetAvailibility = () => {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    NetInfo.isConnected.fetch().done(
        (isConnected) => {
            status = isConnected;
        }
    );
    if (Platform.OS === 'ios') {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
        NetInfo.isConnected.fetch().done(
            (isConnected) => {
                status = isConnected;
            }
        );
    } else {
        NetInfo.isConnected.fetch().then(isConnected => {
            console.log('First, is ' + (isConnected ? 'online' : 'offline'));
            status = isConnected;
        });
    }
    if (status)
        return true;
    else
        return false;
}

handleConnectionChange = (isConnected) => {
    status = isConnected;
}
