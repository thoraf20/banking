import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import AuthenticationTokenMissingException from "../exceptions/AuthTokenMissing";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthToken";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import RequestWithUser from "../interfaces/requestWithUser";
import { Customer } from "../customers/customer.entity";
import dbConfig from "../ormconfig";


export const checkJwt = expressjwt({
  secret: `${process.env.JWT_SECRET}`,
  algorithms: ["HS256"],
});
export async function authMiddleware(
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) {

  const connection = dbConfig;
  const userRepository = connection.getRepository(Customer);

  const authorization = request.header("Authorization");
  const accessToken = authorization?.split(" ")[1] as string;

  if (accessToken) {
    try {
      const verificationResponse = jwt.decode(accessToken) as DataStoredInToken;
      const id = verificationResponse.id;
      const user = await userRepository.findOne({ where: { id } });
      if (user) {
        request.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export const routesExcludedFromJwtAuthentication = ['/auth/v1/register', '/auth/v1/login', '/auth/v1/verify/email'];

export const unless = (path: string[], middleware: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (path.includes(req.path)) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
};