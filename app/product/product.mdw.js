const CommonResponse = require('./../shared/common/common-response');
const ProductController = require('./product.controller');
const _ = require('lodash');
const HttpStatus = require('http-status-codes');

const commonResponse = new CommonResponse();


async function getProductMiddleware(request, response, next) {
    try {
        let products;
        if (!_.isEmpty(request.query)) {
            const productController = new ProductController();
            products = await productController.getCreditQuery(request.query);
        }
        response.locals.products = products;
        next();
    } catch (error) {
        return commonResponse.setResponseWithError(response, error);
    }
}

function isPalindromoMiddleware(request, response, next){
    try {
        let value = request.query.value;
        value = value.toLowerCase().replace(/\s/g,"");
        let valueReverse = value.split("").reverse().toString();
        for (var i = 0; i < ((valueReverse.length)-1); i++) {
            valueReverse = valueReverse.replace(",","");
        };
        response.locals.isPalindromo = (value === valueReverse);
        next();
    } catch (error){
        return commonResponse.setResponseWithError(response, error);
    }
}

function applyDiscountMiddleware(request, response){
    try {
        let products = response.locals.products;
        const isPalindromo = response.locals.isPalindromo;
        const productController = new ProductController();
        products = productController.applyDiscount(products, isPalindromo);
        return commonResponse.setResponseWithOk(response, HttpStatus.OK, products);
    } catch (error) {
        return commonResponse.setResponseWithError(response, error);
    }
}

module.exports = {
    getProductMiddleware,
    isPalindromoMiddleware,
    applyDiscountMiddleware
};
