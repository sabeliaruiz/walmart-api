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

let ProductController;
describe('[Product Credit]', () => {
  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    sandbox = sinon.createSandbox();
    mockery.registerMock('./../shared/db/db', sinon.spy());
    const findAllStub = sinon.stub();
    findAllStub.withArgs({ $or: [ { brand: new RegExp(undefined) },  { description: new RegExp(undefined) } ] } ).rejects('ERROR');
    findAllStub.withArgs({ id: 123 }).resolves([{ id: 123}]);
    findAllStub.withArgs({ $or: [ { brand: new RegExp('adda') },  { description: new RegExp('adda') } ] } )
    .resolves([{ id: 1234, brand: 'xx addav'}, { id: 12345, description: 'xx addav'}]);
    const ProductMock = {
        Product: {
            find: (filter) => {
                return findAllStub(filter);
            }
        }
      };
    mockery.registerMock('./../shared/db/models', ProductMock);
    ProductController = require('./product.controller');    
  });
  afterEach(() => {
    sandbox.restore();
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('[Function getProductQuery]', () => {
    it('Returns one product when the value is only number',  async () => {
      const params = {
          value: 123
        };
      const productController = new ProductController();
      return productController
        .getProductQuery(params)
        .then((resp) => {
          expect(resp.length).to.deep.equal(1);
        });
    });
    it('Returns products when the value is not only number',  async () => {
        const params = {
            value: 'adda'
          };
        const productController = new ProductController();
        return productController
          .getProductQuery(params)
          .then((resp) => {
            expect(resp.length).to.deep.equal(2);
          });
      });
    it('Reject when occurs a error', async () => {
        const params = {
            value: undefined
        };
        const productController = new ProductController();
        return productController
          .getProductQuery(params)
          .catch((error) => {
            expect(error.name).to.deep.equals('ERROR');
          });
    });
  });
  describe('[Function applyDiscount]', () => {
    it('Returns the products with priceDis!=price when isPalindromo true',  async () => {
      const products = [{ id: 1234, brand: 'xxx', description: 'yyyy', image: '/./xxx', price: 400}];
      const productController = new ProductController();
      const result = productController.applyDiscount(products, true);
      expect(result).to.deep.equal([{ id: 1234, brand: 'xxx', description: 'yyyy', image: '/./xxx', price: 400, priceDis: 200, isPalindromo: true }]);
    });
    it('Returns the products with priceDis==price when isPalindromo true',  async () => {
        const products = [{ id: 1234, brand: 'xxx', description: 'yyyy', image: '/./xxx', price: 400}];
        const productController = new ProductController();
        const result = productController.applyDiscount(products, false);
        expect(result).to.deep.equal([{ id: 1234, brand: 'xxx', description: 'yyyy', image: '/./xxx', price: 400, priceDis: 400, isPalindromo: false }]);
      });
  });
});
