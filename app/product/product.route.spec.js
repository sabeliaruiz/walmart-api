const mockery = require('mockery');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

const spyRouterGet = sinon.spy();

const mdwMock = {
  getProductMiddleware: sinon.stub(),
  isPalindromoMiddleware: sinon.stub(),
  applyDiscountMiddleware: sinon.stub(),
  
};

describe('[product routes]', () => {
  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    const expressMock = {
      Router() {
        return {
          get: spyRouterGet
        };
      }
    };

    mockery.registerMock('express', expressMock);
    mockery.registerMock('./product.mdw', mdwMock);

    require('./product.route');
  });

  afterEach(() => {
    mockery.disable();
    mockery.deregisterAll();
  });
  describe('[GET /products]', () => {
    it('is called with getProductMiddleware, isPalindromoMiddleware, applyDiscountMiddleware', () => {
      expect(spyRouterGet).to.have.been.calledWith('/products',
        mdwMock.getProductMiddleware,
        mdwMock.isPalindromoMiddleware,
        mdwMock.applyDiscountMiddleware
        );
    });
  });
});
