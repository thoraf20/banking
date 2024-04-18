import HttpException from "./HttpExceptions";

class WrongCredentialsException extends HttpException {
  constructor() {
    super(401, "Invalid credentials provided");
  }
}

export default WrongCredentialsException;
