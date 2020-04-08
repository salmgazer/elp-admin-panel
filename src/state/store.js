import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import initialState from './reducers/initialState';
import { createLogger } from 'redux-logger';

const loggerMiddleware = createLogger();
const enhancers = [];
const middleware = [thunk, loggerMiddleware];

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

export default createStore(rootReducer, initialState, composedEnhancers);
