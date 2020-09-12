const config = require("config");

class CommonResponse {
  setResponseWithError(res, error) {
    try {
      this.logResponseTime(res);
      return res.status(500).send({ code: 'error', message: 'Ha ocurrido un error' });
    } catch (error2) {
      return res.status(500).send({ code: 'error', message: 'Ha ocurrido un error' });
    }
  }

  setResponseWithOk(res, status, success) {
    this.logResponseTime(res);
    return res.status(status).send(success);
  }

  logResponseTime(res) {
    const initTime = res.locals.responseTimeVars.initTime;
    const currentTime = new Date();
    const responseTime = currentTime - initTime;
  }

  isOnlyNumber(value) {
    if (value) {
      return /^[0-9]*$/.test(value);
    }
    return false;
  }
}

module.exports = CommonResponse;
