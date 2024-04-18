import HttpException from "./HttpExceptions";

class WrongAuthenticationTokenException extends HttpException {
  constructor() {
    super(401, "Invalid authentication token");
  }
}

export default WrongAuthenticationTokenException;
