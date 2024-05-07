class Response {
  async error(res, msg,  statusCode = 400) {
    let response = {
      code: 0,
      status: 'FAIL',
      message: msg
    }
    res.status(statusCode).json(response);
  }

  async success(res, msg, data, statusCode = 200) {
    let response = {
      code: 1,
      status: 'SUCCESS',
      message: msg,
      data: data ? data : {}
    }
    res.status(statusCode).json(response);
  }
}

module.exports = new Response()