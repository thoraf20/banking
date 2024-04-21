import * as express from "express";
import Controller from "../interfaces/controller.interface";
import validationMiddleware from "../middlewares/validation.middleware";
import { LoginDto, SignUpDto, VerifyAccountDto, forgotPasswordDto, updatePasswordDto } from "../customers/customer.dto";
import AuthenticationService from "./auth.service";

class AuthenticationController implements Controller {
  public path = "/auth/v1";
  public router = express.Router();
  private authenticationService = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(SignUpDto),
      this.registration
    );

    this.router.post(
      `${this.path}/verify/email`,
      validationMiddleware(VerifyAccountDto),
      this.verifyEmail
    );

    this.router.post(
      `${this.path}/password/update`,
      validationMiddleware(updatePasswordDto),
      this.updatePassword
    );

    this.router.post(
      `${this.path}/password/forgot`,
      validationMiddleware(forgotPasswordDto),
      this.forgotPassword
    );

    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LoginDto),
      this.login
    );
  }

  private registration = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: SignUpDto = request.body;
    try {
      const res = await this.authenticationService.signup(userData);

      response.status(201).json({ msg: res });
    } catch (error) {
      next(error);
    }
  };

  private verifyEmail = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: VerifyAccountDto = request.body;
    try {
      const res = await this.authenticationService.verifyPhoneOrEmail(userData);

      response.status(200).json({ msg: res });
    } catch (error) {
      next(error);
    }
  };

  private forgotPassword = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: forgotPasswordDto = request.body;
    try {
      const res = await this.authenticationService.forgotPassword(userData);

      response.status(200).json({ msg: res });
    } catch (error) {
      next(error);
    }
  };

  private updatePassword = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: updatePasswordDto = request.body;
    try {
      const res = await this.authenticationService.updatePassword(userData);

      response.status(200).json({ msg: res });
    } catch (error) {
      next(error);
    }
  };

  private login = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: LoginDto = request.body;
    try {
      const res = await this.authenticationService.login(userData);

      response.status(200).json({ ...res });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthenticationController;
