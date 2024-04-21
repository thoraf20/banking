import CustomerService from "../customers/customer.service";
import { LoginDto, SignUpDto, VerifyAccountDto, VerifyPinDto, forgotPasswordDto, updatePasswordDto } from "../customers/customer.dto";
import { Customer } from "../customers/customer.entity";
import UserWithThatEmailAlreadyExistsException from "../exceptions/UserWithEmailExist";
import dbConfig from "../ormconfig";
import * as bcrypt from "bcryptjs";
import jwt, { JwtPayload } from 'jsonwebtoken'
import HttpException from "../exceptions/HttpExceptions";

class AuthService {
  private customerRepository = dbConfig.getRepository(Customer);
  private customerService = new CustomerService();

  public async signup(dto: SignUpDto) {
    const customer = await this.customerRepository.findOne({
      where: { email: dto.email },
    });
    if (customer) {
      throw new UserWithThatEmailAlreadyExistsException(dto.email);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.customerRepository.create({
      ...dto,
      password: passwordHash,
    });

    await this.customerRepository.save(user);

    return `verify your email with ${1234}`;
  }

  public async verifyPhoneOrEmail(dto: VerifyAccountDto) {
    const { email, phoneNumber, code } = dto;
    const customer = email
      ? await this.customerService.findByEmail(`${email}`)
      : await this.customerService.findByPhoneNumber(`${phoneNumber}`);

    if (code !== "1234") {
      throw new HttpException(400, "Invalid code '" + code + "'");
    }

    if (email) {
      await this.customerRepository.update(
        { id: customer.id },
        { isEmailVerified: true }
      );
    } else {
      await this.customerRepository.update(
        { id: customer.id },
        { isPhoneVerified: true }
      );
    }

    return "customer account verify successfully";
  }

  public async login(dto: LoginDto) {
    const dbCustomer = await this.customerService.findByEmail(dto.email);

    if (!dbCustomer.isEmailVerified) {
      throw new HttpException(
        401,
        "Email is yet to be verified, kindly verify your account with the code " +
          1234 +
          " "
      );
    }

    return await this.getAuthTokens(dbCustomer);
  }

  private async signToken(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      jwt.sign({ ...payload }, `${process.env.JWT_SECRET}`, {
        expiresIn: `${process.env.JWT_TOKEN_EXPIRATION}`,
      }),
      jwt.sign({ ...payload }, `${process.env.JWT_SECRET}`, {
        expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION}`,
      }),
    ]);
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  public async forgotPassword(dto: forgotPasswordDto) {
    const { email, phoneNumber } = dto;
    const dbUser = dto.email
      ? await this.customerService.findByEmail(email)
      : await this.customerService.findByPhoneNumber(phoneNumber);

    return `Verification code sent. Use 1234 as the code`;
  }

  public async updatePassword(dto: updatePasswordDto) {
    const { email, newPassword } = dto;
    const dbUser = await this.customerService.findByEmail(email);

    if (!dbUser) {
      throw new HttpException(404, "User does not exist");
    }

    if (dto.code === "1234") {
      const hash = await bcrypt.hash(newPassword, 10);
      await this.customerService.updateAccount(dbUser.id, { password: hash });

      return "password set successfully";
    } else {
      throw new HttpException(400, "Invalid code");
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.customerService.updateAccount(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async refreshTokens(userId: string) {
    const customerExist = await this.customerService.findById(userId);
    if (!customerExist) {
      throw new HttpException(403, "Access Denied");
    }

    if (customerExist.refreshToken !== customerExist.refreshToken) {
      throw new HttpException(403, "Access Denied");
    }

    const tokens = await this.signToken({
      id: customerExist.id,
      email: customerExist.email,
    });

    await this.updateRefreshToken(customerExist.id, customerExist.refreshToken);
    return {
      ...tokens,
    };
  }

  async getAuthTokens(customer: Customer) {
    const payload = {
      email: customer.email,
      id: customer.id,
    };
    const token = await this.signToken(payload);
    customer.password = "";

    await this.updateRefreshToken(customer.id, token.refresh_token);

    return {
      data: {
        ...customer,
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
      },
    };
  }
}

export default AuthService