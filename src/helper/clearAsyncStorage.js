import AsyncStorage from '@react-native-community/async-storage';

module.exports.clearAsyncStorage = () => {
   AsyncStorage.removeItem('userData');
};