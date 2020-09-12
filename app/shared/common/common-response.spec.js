const mockery = require('mockery');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
/* eslint-disable global-require */

const expect = chai.expect;
chai.use(sinonChai);

const standardResponseTimeSpy = sinon.spy();

describe('[common-response]', () => {
  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mockery.registerMock('./common-metrics', {
      standardResponseTime: standardResponseTimeSpy
    });
  });
  afterEach(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('[Function setResponseWithError]', () => {
    it('should send an error with the status receive ', (done) => {
      const CommonReponse = require('./common-response');
      const commonResponse = new CommonReponse();
      const responseMock = {
        status: (status) => {
          expect(status).to.be.equal(500);
          return {
            send: (objResponse) => {
              expect(objResponse.code).to.be.equal('error');
              expect(objResponse.message).to.be.equal('Ha ocurrido un error');
              done();
            }
          };
        }
      };
      sinon.stub(CommonReponse.prototype, 'logResponseTime');
      const errorResponseMock = 100;
      commonResponse.setResponseWithError(responseMock, errorResponseMock);
    });

    it('should send an error 500 with the default message when receive any status 500', (done) => {
      const CommonReponse = require('./common-response');
      const commonResponse = new CommonReponse();
      const responseMock = {
        status: (status) => {
          expect(status).to.be.equal(500);
          return {
            send: (objResponse) => {
              expect(objResponse.code).to.be.equal('error');
              expect(objResponse.message).to.be.equal('Ha ocurrido un error');
              done();
            }
          };
        }
      };
      sinon.stub(CommonReponse.prototype, 'logResponseTime');
      const errorResponseMock = 'some error no expected';
      commonResponse.setResponseWithError(responseMock, errorResponseMock);
    });
    it('catches an error', (done) => {
      const CommonReponse = require('./common-response');
      const commonResponse = new CommonReponse();
      sinon.stub(commonResponse, 'logResponseTime').throws(new Error('random'));
      const responseMock = {
        status: (status) => {
          expect(status).to.be.equal(500);
          return {
            send: (objResponse) => {
              expect(objResponse.code).to.be.equal('error');
              expect(objResponse.message).to.be.equal('Ha ocurrido un error');
              done();
            }
          };
        }
      };
      sinon.stub(CommonReponse.prototype, 'logResponseTime');
      const errorResponseMock = 'some error no expected';
      commonResponse.setResponseWithError(responseMock, errorResponseMock);
    });
  });

  describe('setResponseWithOk function', () => {
    it('should send an Ok message ', (done) => {
      const CommonReponse = require('./common-response');
      const commonResponse = new CommonReponse();
      const responseMock = {
        status: (status) => {
          expect(status).to.be.equal(200);
          return {
            send: (objResponse) => {
              expect(objResponse.code).to.be.equal('00');
              expect(objResponse.message).to.be.equal('ok message');
              done();
            }
          };
        }
      };
      sinon.stub(CommonReponse.prototype, 'logResponseTime');
      commonResponse.setResponseWithOk(responseMock, 200, { code: '00', message: 'ok message' });
    });
  });
});
