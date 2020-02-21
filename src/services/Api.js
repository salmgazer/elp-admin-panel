//import axios from 'axios';
//import React , {Component} from 'react';
const resources = require('./resources');
const axios = require('axios');

class Api{

    constructor(resourceName) {
        const resourceConfig = resources[resourceName];
        const {resource, primaryKeyName} = resourceConfig;
        this.resource = resource;
        this.primaryKeyName = primaryKeyName;
    }

    static get apiUrl() {
        return 'http://elpfakeapi-env.unhavpij3f.us-east-2.elasticbeanstalk.com';
    }

    //Implementing fetch all with limit

    /*async indexLimit (limitValue) {
        return axios(`${this.constructor.apiUrl}/${this.resource}?$limit=${limitValue}`);
    }*/

    async index () {
        return axios(`${this.constructor.apiUrl}/${this.resource}`);
    }

    async create (params) {
        axios.post(`${this.constructor.apiUrl}/${this.resource}`,
            params
    )
    }

    async show (identifierValue) {
        return axios.get(`${this.constructor.apiUrl}/${this.resource}/${identifierValue}`);
    }

    async delete () {}

    async update () {}
}




/*new Api('products').create(
    {
        "name": "Another product",
        "costPrice": 0,
        "sellingPrice": 0,
        "weight": 10,
        "manufacturerId": 6,
        "brandId": 39,
        "productCategoryId": 2,
        "productGroupId": 1
    }

).then((res) => {
    console.log("Saved successfully");
});*/























/*async createProduct (proname , desc , cp , sp , wt , man , cat , bn , gn , bc) {
    axios.post(`${this.constructor.apiUrl}/${this.resource}`,
        {
            pro_name : `${proname}` ,
            descrip : `${desc}` ,
            cost_price : `${cp}` ,
            selling_price : `${sp}` ,
            product_weight : `${wt}` ,
            p_manufact_id : `${man}` ,
            p_cat_id : `${cat}` ,
            p_brand_id : `${bn}` ,
            p_group_id : `${gn}` ,
            Bar_Code : `${bc}`


        }
    )
}*/

/*new Api('products').createProduct('Yam' , 'yam tuber' , '1' , '1' , '1' , '1' , '1', '1', '1' , '1' ).then((res) => {
    console.log("Product created");
    console.log("*******************************");
});*/



/*new Api('brands').create('Alomo').then((res) => {
    console.log("*******************************");
});*/

/*


new Api('brands').createdynamic("{name : 'AlomoWorker'}").then((res) => {

});
*/

//Fetching one item

/*new Api('brands').findOne(1).then((res) => {
    console.log(res.data);
    console.log("*******************************");
});*/


//Fetching all items with limit. Pass the limit value through index([value_goes_here])

/*new Api('brands').index(5).then((res) => {
    console.log(res.data);
    console.log("*******************************");
});*/


//Creating item

/*new Api('brands').create('Alomo').then((res) => {
    console.log("*******************************");
});*/

/*new Api('products').create("{name : 'Alomo Ginseng Pb 330ml'}").then((res) => {
    console.log("Product created");
    console.log("*******************************");
});*/

/*new Api('brands').create('Yam').then((res) => {
    console.log("Product created");
    console.log("*******************************");
});*/


//Fetching all items

/*new Api('brands').indexLimit(50).then((res) => {``````````````````````````````````````
    console.log(res.data);
    console.log("*******************************");
});*/

/*new Api('brands').indexLimit(50).then((res) => {
    console.log("************** ALL PRODUCTS *****************");
    console.log(res.data);
    console.log("*******************************");
});*/

export default Api;