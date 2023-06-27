export default class BaseController {
  success(response, data) {
    response.send({
      code: 200,
      data,
    });
  }
  message(response, message) {
    response.send({
      code: 200,
      message,
    });
  }
  error(response, message, code = -1, errors = {}) {
    response.send({
      code,
      message,
      errors,
    });
  }
}