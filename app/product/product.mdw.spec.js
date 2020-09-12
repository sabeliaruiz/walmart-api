/* eslint-disable global-require */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const mockery = require('mockery');
const { stub } = require('sinon');
const { response } = require('express');

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);

let productMdw;
let ProductController;
let CommonResponse;
describe('[Product Credit]', () => {
  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    sandbox = sinon.createSandbox();
    mockery.registerMock('./../shared/db/db', sinon.spy());
    mockery.registerMock('./../shared/db/models', sinon.spy());
    productMdw = require('./product.mdw');
    ProductController = require('./product.controller');
    CommonResponse = require('./../shared/common/common-response');
    responseOkStub = sandbox.stub(CommonResponse.prototype, 'setResponseWithOk');
    responseOkStub.returns({ statusCode: 200 });
    responseErrorStub = sandbox.stub(CommonResponse.prototype, 'setResponseWithError');
    responseErrorStub.returns('RESPONSE_ERROR');
  });
  afterEach(() => {
    sandbox.restore();
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('[Function getProductMiddleware]', () => {
    it('The locals products contains the product list',  async () => {
      const requestParams = {
        query: {
          value: 'something'
        }
      };
      sinon.stub(ProductController.prototype, 'getProductQuery').resolves([{
        id: 1234,
        brand: 'abba'
      },
      {
        id: 1235,
        brand: 'abba xxx'
      }]);
      const nextMock = sinon.spy();
      const getProductMiddw = require('./product.mdw').getProductMiddleware;
      const response =  { locals: {} };
      await getProductMiddw(requestParams, response, nextMock);
      expect(JSON.stringify(response.locals.products))
        .to.be.equals(JSON.stringify([ { id: 1234, brand: 'abba' }, { id: 1235, brand: 'abba xxx' } ]));
    });
    it('calls setResponseWithError when getProductQuery rejects', async () => {
      const requestParams = {
        query: {
          value: 'something'
        }
      };
      sinon.stub(ProductController.prototype, 'getProductQuery').rejects('ERROR');
      const nextMock = sinon.spy();
      const getProductMiddw = require('./product.mdw').getProductMiddleware;
      const resp = await getProductMiddw(requestParams, { locals: {} }, nextMock);
      expect(resp).to.be.equal('RESPONSE_ERROR');
    });
  });
  describe('[Function isPalindromoMiddleware]', () => {
    it('The locals.isPalindromo is true when value is a palindromo',  async () => {
      const requestParams = {
        query: {
          value: 'abba'
        }
      };
      const isPalindromoMddw = require('./product.mdw').isPalindromoMiddleware;
      const response =  { locals: {} };
      await isPalindromoMddw(requestParams, response, {});
      expect(response.locals.isPalindromo)
        .to.be.equals(true);
    });
    it('The locals.isPalindromo is false when value is not a palindromo',  async () => {
      const requestParams = {
        query: {
          value: 'pepe'
        }
      };
      const isPalindromoMddw = require('./product.mdw').isPalindromoMiddleware;
      const response =  { locals: {} };
      await isPalindromoMddw(requestParams, response, {});
      expect(response.locals.isPalindromo)
        .to.be.equals(false);
    });
    it('calls setResponseWithError when occurs a error', async () => {
      const requestParams = {};
      const nextMock = sinon.spy();
      const isPalindromoMddw = require('./product.mdw').isPalindromoMiddleware;
      const resp = await isPalindromoMddw(requestParams, { locals: {} }, nextMock);
      expect(resp).to.be.equal('RESPONSE_ERROR');
    });
  });
  describe('[Function applyDiscountMiddleware]', () => {
    it('Calls setResponseWithOk when applyDiscount resolves', () => {
      const requestParams =  {};
      const products = [{
        price: 4400,
        priceDis: 2100
      }];
      sinon.stub(ProductController.prototype, 'applyDiscount').returns(products);
      const nextMock = sinon.spy();
      const applyDiscountMdw = require('./product.mdw').applyDiscountMiddleware;
      const response =  { locals: {} };
      applyDiscountMdw(requestParams, response, nextMock);
      expect(responseOkStub).to.be.calledWith({ locals: {  } }, 200, [{ price: 4400, priceDis: 2100 }]);
    });
    it('calls setResponseWithError when applyDiscount rejects', async () => {
      const requestParams =  {};
      const products = [{
        price: 4400,
        priceDis: 2100
      }];
      sinon.stub(ProductController.prototype, 'applyDiscount').throws('ERROR');
      const nextMock = sinon.spy();
      const applyDiscountMdw = require('./product.mdw').applyDiscountMiddleware;
      const response =  { locals: {} };
      const resp = applyDiscountMdw(requestParams, response, nextMock);
      expect(resp).to.be.equal('RESPONSE_ERROR');
    });
  });
});
