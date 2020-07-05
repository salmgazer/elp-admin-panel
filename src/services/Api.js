import axios from 'axios';
import LocalInfo from "./LocalInfo";
const apis = require('../config/apis.json');
const envs = require('../config/environments.json');
const NODE_ENV = envs.NODE_ENV;
const apiConf = apis["elp-core-api"][NODE_ENV].v1;
const {basePath, protocol, prefix} = apiConf;
const apiUrl = `${protocol}://${basePath}/v1/${prefix}`;

const requestMethods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};

class Api {

    constructor(resourceConfig, parentResources = {}, options = {}) {
        const {resource, primaryKeyName, useHashLink} = resourceConfig;
        this.resource = resource;
        this.primaryKeyName = primaryKeyName;
        this.parentResources = parentResources;
        if (useHashLink) {
          this.useHashLink = useHashLink;
        }
        if (options.limit) {
          this.limit = options.limit;
        }
        if (options.offset) {
          this.offset = options.offset;
        }
        if (options.url) {
          this.url = options.url;
        }

        if (options.contentType) {
          this.contentType = options.contentType;
        }
        this.searchConfig = options.searchConfig;
    }

    static get apiUrl() {
        return apiUrl;
    }

    _makeRequest(method, params, identifierValue) {
      const headers = {'Authorization': `Bearer ${LocalInfo.userToken}`};
      if (this.contentType) {
        headers.accept = this.contentType;
      }
      const requestConfig = {
        method,
        url: this._generateUrl(identifierValue),
        headers
      };

      if (params) {
        requestConfig.data = params;
      }

      return axios(requestConfig);
    }

    _generateUrl(identifierValue) {
      if (this.url) {
        return `${this.constructor.apiUrl}${this.url}`;
      }

      if (this.useHashLink) {
        let hashUrl = `${this.constructor.apiUrl}${window.location.hash.replace("#", '')}`;
        if (identifierValue) {
          hashUrl = hashUrl[hashUrl.length - 1] === '/' ? `${hashUrl}${identifierValue}` : `${hashUrl}/${identifierValue}`;
        }

        // @todo remove duplicate
        if (this.searchConfig) {
          const searchConfigKeys = Object.keys(this.searchConfig);
          hashUrl = `${hashUrl}?`;
          for (let m = 0; m < searchConfigKeys.length; m++) {
            hashUrl = `${hashUrl}${searchConfigKeys[m]}=${this.searchConfig[searchConfigKeys[m]]}`;
            if (m < searchConfigKeys.length - 1) {
              hashUrl = `${hashUrl}&`;
            }
          }
        }
        return hashUrl;
      }

      let fullUrl = this.constructor.apiUrl;
      const parentResourceNames = Object.keys(this.parentResources);

      for (const parentResourceName of parentResourceNames) {
        fullUrl = `${fullUrl}/${parentResourceName}/${this.parentResources[parentResourceName]}`;
      }

      fullUrl = `${fullUrl}/${this.resource}`;

      if (identifierValue) {
        fullUrl = `${fullUrl}/${identifierValue}`;
      }

      fullUrl = `${fullUrl}?`;

      if (this.offset) {
        fullUrl = `${fullUrl}offset=${this.offset}`;
      }

      if (this.limit) {
        fullUrl = `${fullUrl}offset=${this.offset}`;
      }

      if (this.searchConfig) {
        const searchConfigKeys = Object.keys(this.searchConfig);
        for (let m = 0; m < searchConfigKeys.length; m++) {
          fullUrl = `${fullUrl}${searchConfigKeys[m]}=${this.searchConfig[searchConfigKeys[m]]}`;
          if (m < searchConfigKeys.length - 1) {
            fullUrl = `${fullUrl}&`;
          }
        }
      }

      return fullUrl;
    }

    async index () {
      return this._makeRequest(requestMethods.GET);
    }

    async create (params) {
        return this._makeRequest(requestMethods.POST, params);
    }

    async delete (identifierValue) {
        return this._makeRequest(requestMethods.DELETE, null, identifierValue);
    }

    async update (identifierValue, params) {
        return this._makeRequest(requestMethods.PUT,params, identifierValue);
    }

    async findOne (identifierValue) {
      return this._makeRequest(requestMethods.GET, null, identifierValue);
    }
}

export default Api;
