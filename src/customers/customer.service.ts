import dbConfig from "../ormconfig";
import { Customer } from "./customer.entity";
import HttpException from "../exceptions/HttpExceptions";
import { ChangePasswordDto, SetPinDto, UpdatePictureDto, UpdatePinDto, VerifyPinDto, updatePasswordDto } from "./customer.dto";
import * as bcrypt from "bcryptjs";

class CustomerService {
  private customerRepository = dbConfig.getRepository(Customer);

  public async checkEmailAvailability(email: string): Promise<boolean> {
    const isAvailable = await this.customerRepository.findOne({
      where: { email },
    });

    if (!isAvailable) return false;

    return true;
  }

  public async findByEmail(email: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { email },
    });

    if (!customer) {
      throw new HttpException(404, `Customer with email ${email} not found`);
    }

    return customer;
  }

  public async findByPhoneNumber(phoneNumber: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { phoneNumber },
    });

    if (!customer) {
      throw new HttpException(404, `Invalid phone number: ${phoneNumber}.`);
    }

    return customer;
  }

  public async findById(id: string): Promise<Customer | null> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    return customer;
  }

  public async fetchLoginCustomer(id: string): Promise<Customer | null> {
    const customer = await this.findById(id);
    return customer;
  }

  public async updateAccount(id: string, data: any) {
    const customer = await this.findById(id);

    if (!customer) {
      throw new HttpException(404, `Customer account not found`);
    }

    await this.customerRepository.update({ id: customer?.id }, { ...data });

    return "customer data updated successfully";
  }

  public async setUserPin(data: SetPinDto) {
    const customerExist = await this.findByEmail(data.email);

    const hash = await bcrypt.hash(data.pin, 10);

    await this.customerRepository.update(customerExist.id, { pin: hash });

    return "pin set successfully";
  }

  public async verifyUserPin(dto: VerifyPinDto) {
    const customerExist = await this.findByEmail(dto.email);

    const isMatch = await customerExist.validatePin(dto.pin);

    if (!isMatch) {
      throw new HttpException(400, "Invalid pin");
    }

    return "pin verify successfully";
  }

  public async changePassword(id: string, dto: ChangePasswordDto) {
    const { currentPassword, newPassword } = dto;
    const dbCustomer = await this.findById(id);

    if (!dbCustomer) {
      throw new HttpException(404, "customer not found");
    }

    const isCorrectPin = dbCustomer.validatePassword(currentPassword);

    if (!isCorrectPin) {
      throw new HttpException(400, "Incorrect current pin");
    }

    const hashPin = await bcrypt.hash(newPassword, 10);

    await this.updateAccount(dbCustomer.id, { password: hashPin });

    return "password successfully changed";
  }

  public async updatePin(id: string, dto: UpdatePinDto) {
    const { currentPin, newPin } = dto;
    const dbCustomer = await this.findById(id);

    if (!dbCustomer) {
      throw new HttpException(404, "customer not found");
    }

    const isMatch = await dbCustomer.validatePin(currentPin);

    if (!isMatch) {
      throw new HttpException(400, "Incorrect current pin");
    }

    const hash = await bcrypt.hash(newPin, 10);

    await this.updateAccount(dbCustomer.id, { pin: hash });

    return "pin successfully updated";
  }

  public async updateProfilePicture(userId: string, dto: UpdatePictureDto) {
    const dbCustomer = await this.findById(userId);

    if (!dbCustomer) {
      throw new HttpException(404, "customer not found");
    }

    await this.updateAccount(userId, { profilePicture: dto.imageString });

    return "profile picture updated successfully";
  }
}

export default CustomerService;