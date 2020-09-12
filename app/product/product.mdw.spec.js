/* eslint-disable global-require */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const mockery = require('mockery');
const { stub } = require('sinon');

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);

let productMdw;
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
    mockery.registerMock('./../shared/db/models', sinon.spy());
    productMdw = require('./product.mdw');
    ProductController = require('./product.controller');
  });
  afterEach(() => {
    sandbox.restore();
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('[Function getCreditMiddleware]', () => {
    it('Calls next when getCreditQuery resolves', () => {
        // const nextMock = sinon.spy();
        const requestParams = {
          query: {
            value: 'something'
          }
        };
        sinon.stub(ProductController.prototype, 'getCreditQuery').resolves({});
        // productMdw.getProductMiddleware(requestParams, { locals: {} }, nextMock);
        // expect(nextMock).has.been.called;

        const nextMock = sinon.stub();
        // const requestParams = {
        //     params: {
        //     creditId: 'something'
        //     }
        // };
        productMdw.getProductMiddleware(requestParams, { locals: {} }, nextMock);
        expect(nextMock).to.have.been.called;
      });
  });
});
