import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import reducers from '../reducers/rootReducer'; //Import the reducer

let middleware = [thunk];

if (__DEV__) {
	middleware = [...middleware, logger];
} else {
	middleware = [...middleware];
}

export default createStore(reducers, applyMiddleware(...middleware));
