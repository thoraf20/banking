import * as express from "express";
import Controller from "../interfaces/controller.interface";
import validationMiddleware from "../middlewares/validation.middleware";
import CustomerService from "./customer.service"
import { SetPinDto, VerifyPinDto, updatePasswordDto } from "./customer.dto";

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
}

export default CustomerController;