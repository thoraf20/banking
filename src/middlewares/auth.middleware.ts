// import { NextFunction, Response } from "express";
// import jwt from "jsonwebtoken";
// import { DataSource, getRepository } from "typeorm";
// import AuthenticationTokenMissingException from "../exceptions/AuthTokenMissing";
// import WrongAuthenticationTokenException from "../exceptions/WrongAuthToken";
// import DataStoredInToken from "../interfaces/dataStoredInToken";
// import RequestWithUser from "../interfaces/requestWithUser";
// // import User from "../user/user.entity";
// import config from "ormconfig";

// async function authMiddleware(
//   request: RequestWithUser,
//   response: Response,
//   next: NextFunction
// ) {

//   const cookies = request.cookies;
//   const connection = new DataSource(config);
//   const userRepository = connection.getRepository(User);

//   if (cookies && cookies.Authorization) {
//     const secret = process.env.JWT_SECRET;
//     try {
//       const verificationResponse = jwt.verify(
//         cookies.Authorization,
//         secret
//       ) as DataStoredInToken;
//       const id = verificationResponse.id;
//       const user = await userRepository.findOne({ where: { id }});
//       if (user) {
//         request.user = user;
//         next();
//       } else {
//         next(new WrongAuthenticationTokenException());
//       }
//     } catch (error) {
//       next(new WrongAuthenticationTokenException());
//     }
//   } else {
//     next(new AuthenticationTokenMissingException());
//   }
// }

// export default authMiddleware;
