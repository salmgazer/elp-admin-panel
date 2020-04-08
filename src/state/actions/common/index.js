import * as types from './actionTypes';

const DEFAULT_ALERT_MESSAGE =
  'There seems to be a system error, please refresh.';

export const alert = (type, message, entity) => {
  switch (type) {
    case types.ALERT_FAILURE: {
      return async dispatch => {
        dispatch({ type: types.ALERT_FAILURE, message, entity });
      };
    }
    case types.ALERT_SUCCESS: {
      return async dispatch => {
        dispatch({ type: types.ALERT_SUCCESS, message, entity });
      };
    }
    default:
      return async dispatch => {
        dispatch({ type: types.ALERT_FAILURE, message: DEFAULT_ALERT_MESSAGE, entity });
      };
  }
};
