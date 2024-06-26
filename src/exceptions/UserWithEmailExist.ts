import HttpException from "./HttpExceptions";

class UserWithThatEmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(409, `User with email ${email} already exists`);
  }
}

export default UserWithThatEmailAlreadyExistsException;
