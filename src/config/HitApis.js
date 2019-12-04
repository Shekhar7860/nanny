//Third party plugins
import axios from 'axios';

module.exports.postApi = (payload, url, authToken, data) => {
    console.warn(payload,' Payload');
    axios.post(url, payload, { headers: { 'authorization': "bearer "+ authToken, 'language': null } })
        .then(function (response) {
            console.warn(response)
            data(response);
        })
        .catch(function (error) {
            console.warn(error.response)
            if (error.response != null)
                data(error.response)
            else
                data(null);
        });
}

module.exports.putApi = (payload, url, language, authToken, data) => {

    axios.put(url, payload, { headers: { 'authorization': authToken, 'language': language } })
        .then(function (response) {
            console.warn(response)
            data(response);
        })
        .catch(function (error) {
            console.warn(error)
            if (error.response != null)
                data(error.response)
            else
                data(null);
        });
}

module.exports.getApi = (url, authToken, data) => {
    // console.log(url,'the url')
    // console.log(authToken,'the auth token')
    axios.get(url, { headers: { 'authorization': authToken } })
        .then(function (response) {
            data(response);
           
        })
        .catch(function (error) {
            if (error.response != null)
                data(error.response)
            else
                data(null);
        });
}

module.exports.deleteApi = (payload, url, authToken, data) => {
    const headers = { 'authorization': 'Bearer ' + authToken }
    console.log(payload);
    console.log(url, 'the urel to be delte');
    console.log(authToken, 'the authtoke');
    axios.delete(url, { headers, data: payload })
        .then(function (response) {
            console.log(response)
            data(response);
        })
        .catch(function (error) {
            if (error.response != null)
                data(error.response)
            else
                data(null);
        });
}