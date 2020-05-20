import pluralize from 'pluralize';
import {message} from 'antd';
import * as actionTypes from './actionTypes';
import Api from '../../services/Api';


const alertTypes = {
  SUCCESS: "SUCCESS",
  FAIL: "FAIL",
};

const {singular} = pluralize;

const index = (resourceConfig, parentResources = {}, options = {}) => async dispatch => {
    try {
      const results = await new Api(resourceConfig, parentResources, options).index();
      if (results) {
        dispatch({
          type: actionTypes[`INDEX_${resourceConfig.resource.toUpperCase()}_SUCCESS`],
          results: results.data[resourceConfig.resource],
          resource: resourceConfig.resource
        });
      } else {
        dispatch({
          type: actionTypes[`INDEX_${resourceConfig.resource.toUpperCase()}_FAIL`],
          resource: resourceConfig.resource
        });
      }
    } catch (err) {
      alert('feedback', alertTypes.FAIL, err);
    }
  };

const createOne = (params, resourceConfig, parentResources = {}, options = {}) => async (dispatch) => {
    try {
      const result = await new Api(resourceConfig, parentResources, options).create(params);
      if (result) {
        message.success(`Successfully created ${resourceConfig.resource}`);
        dispatch({
          type: actionTypes[`CREATE_ONE_${singular(resourceConfig.resource).toUpperCase()}_SUCCESS`],
          result: result.data,
          resource: resourceConfig.resource
        });
      } else {
        message.error(`Failed to create ${resourceConfig.resource}`);
        dispatch({
          type: actionTypes[`CREATE_ONE_${singular(resourceConfig.resource).toUpperCase()}_FAIL`],
          resource: resourceConfig.resource
        });
      }
    } catch (err) {
      alert('feedback', alertTypes.FAIL, err);
    }
  };

const updateOne = (identifierValue, params, resourceConfig, parentResources = {}, options = {}) => async (dispatch) => {
    try {
      const result = await new Api(resourceConfig, parentResources, options).update(identifierValue, params);
      if (result) {
        message.success(`Successfully updated ${resourceConfig.resource}`);
        dispatch({
          type: actionTypes[`UPDATE_ONE_${singular(resourceConfig.resource).toUpperCase()}_SUCCESS`],
          result: result.data,
          resource: resourceConfig.resource,
          primaryKeyName: resourceConfig.primaryKeyName,
          identifierValue
        });
      } else {
        message.error(`Failed to update ${resourceConfig.resource}`);
        dispatch({
          type: actionTypes[`UPDATE_ONE_${singular(resourceConfig.resource).toUpperCase()}_FAIL`],
          resource: resourceConfig.resource
        });
      }
    } catch (err) {
      alert('feedback', alertTypes.FAIL, err);
    }
  };


const deleteOne = (identifierValue, resourceConfig, parentResources = {}, options = {}) => async (dispatch) => {
    try {
      const result = await new Api(resourceConfig, parentResources, options).delete(identifierValue);
      if (result) {
        message.success(`Successfully deleted ${resourceConfig.resource}`);
        dispatch({
          type: actionTypes[`DELETE_ONE_${singular(resourceConfig.resource).toUpperCase()}_SUCCESS`],
          identifierValue,
          resource: resourceConfig.resource,
          primaryKeyName: resourceConfig.primaryKeyName
        });
      } else {
        message.error(`Failed to delete ${resourceConfig.resource}`);
        dispatch({
          type: actionTypes[`DELETE_ONE_${singular(resourceConfig.resource).toUpperCase()}_FAIL`],
          resource: resourceConfig.resource
        });
      }
    } catch (err) {
      alert('feedback', alertTypes.FAIL, err);
    }
  };

const alert = (entity, alertType, message) => async dispatch => {
    try {
      dispatch({
        type: 'ALERT',
        alertType,
        message,
        entity
      });
    } catch (err) {
      console.error(err);
    }
  };

const clearAlert = (entity) => async dispatch => {
    try {
      dispatch({
        type: 'CLEAR_ALERT',
        entity
      });
    } catch (err) {
      console.error(err);
    }
  };



export default  {
  index,
  createOne,
  alert,
  clearAlert,
  updateOne,
  deleteOne
};
