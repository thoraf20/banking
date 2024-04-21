import * as express from "express";
import Controller from "../interfaces/controller.interface";
import validationMiddleware from "../middlewares/validation.middleware";
import CustomerService from "./customer.service"
import { ChangePasswordDto, SetPinDto, UpdatePictureDto, UpdatePinDto, VerifyPinDto, updatePasswordDto } from "./customer.dto";

class CustomerController implements Controller {
  public path = "/v1/customer";
  public router = express.Router();
  private customerService = new CustomerService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/current`, this.loginUser);

    this.router.post(
      `${this.path}/pin/set`,
      validationMiddleware(SetPinDto),
      this.setPin
    );

    this.router.post(
      `${this.path}/pin/verify`,
      validationMiddleware(VerifyPinDto),
      this.verifyUserPin
    );

    this.router.post(
      `${this.path}/pin/update`,
      validationMiddleware(UpdatePinDto),
      this.updateUserPin
    );

    this.router.post(
      `${this.path}/password/change`,
      validationMiddleware(ChangePasswordDto),
      this.changePassword
    );

    this.router.post(
      `${this.path}/picture/change`,
      validationMiddleware(UpdatePictureDto),
      this.changeProfilePicture
    );
  }

  private loginUser = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userId = response.locals.user.id;
    try {
      const res = await this.customerService.fetchLoginCustomer(userId);

      response.status(200).json({ msg: res });
    } catch (error) {
      next(error);
    }
  };

  private setPin = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: SetPinDto = request.body;
    try {
      const res = await this.customerService.setUserPin(userData);

      response.status(200).json({ msg: res });
    } catch (error) {
      next(error);
    }
  };

  private verifyUserPin = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: VerifyPinDto = request.body;
    try {
      const res = await this.customerService.verifyUserPin(userData);

      response.status(200).json({ msg: res });
    } catch (error) {
      next(error);
    }
  };

  private updateUserPin = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: UpdatePinDto = request.body;
    const id = response.locals.user.id;
    try {
      const res = await this.customerService.updatePin(id, userData);

      response.status(200).json({ msg: res });
    } catch (error) {
      next(error);
    }
  };

  private changePassword = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: ChangePasswordDto = request.body;
    const id = response.locals.user.id;
    try {
      const res = await this.customerService.changePassword(id, userData);

      response.status(200).json({ msg: res });
    } catch (error) {
      next(error);
    }
  };

  private changeProfilePicture = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: UpdatePictureDto = request.body;
    const id = response.locals.user.id;
    try {
      const res = await this.customerService.updateProfilePicture(id, userData);

      response.status(200).json({ msg: res });
    } catch (error) {
      next(error);
    }
  };
}

export default CustomerController;