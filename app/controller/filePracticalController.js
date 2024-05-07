const fileService = require('./../service/filePracticalService');
const response = require('./../../utils/response');
const statusCode = require('./../../utils/statusCode');

class FileController {
  async uploadFile(req, res) {
    try {
      let data = await fileService.upload(req.body, req.file);
      response.success(res, 'SUCCESS', data, statusCode.success);
    } catch (error) {
      console.log(`file upload controller catch error ->> ${error}`);

      if (error.message)
        response.error(
          res,
          error.message,
          error.statusCode ? error.statusCode : 403
        );
      else response.error(res, error, '', statusCode.error);
    }
  }

  async listFile(req, res) {
    try {
      let data = await fileService.listFile(req.query);
      response.success(res, 'SUCCESS', data, statusCode.success);
    } catch (error) {
      console.log(`list file controller catch error ->> ${error}`);

      if (error.message)
        response.error(
          res,
          error.message,
          error.statusCode ? error.statusCode : 403
        );
      else response.error(res, error, '', statusCode.error);
    }
  }

  async deleteFile(req, res) {
    try {
      let data = await fileService.deleteFile(req.params);
      response.success(res, 'SUCCESS', data, statusCode.success);
    } catch (error) {
      console.log(`list file controller catch error ->> ${error}`);

      if (error.message)
        response.error(
          res,
          error.message,
          error.statusCode ? error.statusCode : 403
        );
      else response.error(res, error, '', statusCode.error);
    }
  }

  async retrieveFile(req, res) {
    try {
      let data = await fileService.retrieveFile(req.params);
      response.success(res, 'SUCCESS', data, statusCode.success);
    } catch (error) {
      console.log(`list file controller catch error ->> ${error}`);

      if (error.message)
        response.error(
          res,
          error.message,
          error.statusCode ? error.statusCode : 403
        );
      else response.error(res, error, '', statusCode.error);
    }
  }
}

module.exports = new FileController();