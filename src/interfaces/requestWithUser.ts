import { Request } from "express";
import { Customer } from "../customers/customer.entity";

interface RequestWithUser extends Request {
  user: Customer;
}

export default RequestWithUser;
