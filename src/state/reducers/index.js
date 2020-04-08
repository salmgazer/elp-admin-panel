import initialState from './initialState';
import * as types from '../actions/actionTypes';
import pluralize from 'pluralize';


const reducer = (state = initialState, action) => {
  const resource = action.resource;
  if (action.type.indexOf('@@') !== -1) {
    return state;
  }
  switch (action.type) {
    case types[`INDEX_${resource.toUpperCase()}_SUCCESS`]: {
      const newState = Object.assign({}, state);
      newState[resource] = action.results;
      return newState;
    }
    case types[
      `CREATE_ONE_${pluralize.singular(resource).toUpperCase()}_SUCCESS`
      ]: {
      const newState = Object.assign({}, state);
      newState[resource] = [...[action.result], ...newState[resource]];
      return newState;
    }
    case types[
      `UPDATE_ONE_${pluralize.singular(resource).toUpperCase()}_SUCCESS`
      ]: {
      const newState = Object.assign({}, state);
      newState[resource] = newState[resource].filter(row => row[action.primaryKeyName] !== action.identifierValue);
      newState[resource] = [...[action.result], ...newState[resource]];
      return newState;
    }
    case types[
      `DELETE_ONE_${pluralize.singular(resource).toUpperCase()}_SUCCESS`
      ]: {
      const newState = Object.assign({}, state);
      console.log(action.primaryKeyName);
      console.log(action.identifierValue);
      newState[resource] = newState[resource].filter(row => row[action.primaryKeyName] !== action.identifierValue);
      return newState;
    }
    case 'ALERT': {
      const newState = Object.assign({}, state);
      newState.alert = {
        message: action.message,
        alertType: action.alertType,
      };
      return newState;
    }
    case 'CLEAR_ALERT': {
      const newState = Object.assign({}, state);
      newState.alert = {};
      return newState;
    }
    default:
      return state;
  }
};

export default reducer;
