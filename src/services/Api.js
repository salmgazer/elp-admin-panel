import axios from 'axios';
const resources = require('./resources');

export default class Api {

    constructor(resourceName) {
        const resourceConfig = resources[resourceName];
        const {resource, primaryKeyName} = resourceConfig;
        this.resource = resource;
        this.primaryKeyName = primaryKeyName;
    }

    static get apiUrl() {
        return 'http://elpfakeapi-env.unhavpij3f.us-east-2.elasticbeanstalk.com';
    }

    async index () {
        return axios(`${this.constructor.apiUrl}/${this.resource}`);
    }

    async create () {}

    async delete () {}

    async update () {}

    async findOne (identifierValue) {
        return axios(`${this.constructor.apiUrl}/${this.resource}/${identifierValue}`);
    }
}

/*
new Api('brands').findOne(1).then((res) => {
    console.log(res.data);
});
*/




