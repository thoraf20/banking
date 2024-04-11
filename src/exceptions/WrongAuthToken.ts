import HttpException from "./HttpExceptions";

class WrongAuthenticationTokenException extends HttpException {
  constructor() {
    super(401, "Wrong authentication token");
  }
}

export default WrongAuthenticationTokenException;
