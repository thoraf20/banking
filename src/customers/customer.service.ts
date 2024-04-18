import dbConfig from "../ormconfig";
import { Customer } from "./customer.entity";
import HttpException from "../exceptions/HttpExceptions";


class CustomerService {
  private userRepository = dbConfig.getRepository(Customer);

  public async checkEmailAvailability(email: string): Promise<boolean> {
    const isAvailable = await this.userRepository.findOne({ where: { email } });

    if (!isAvailable) return false;

    return true;
  }

  public async findByEmail(email: string): Promise<Customer> {
    const customer = await this.userRepository.findOne({ where: { email } });

    if (!customer) {
      throw new HttpException(404, `Customer with email ${email} not found`);
    }

    return customer;
  }

  public async findByPhoneNumber(phoneNumber: string): Promise<Customer> {
    const customer = await this.userRepository.findOne({
      where: { phoneNumber },
    });

    if (!customer) {
      throw new HttpException(404, `Invalid phone number: ${phoneNumber}.`);
    }

    return customer;
  }

  public async findById(id: string): Promise<Customer | null> {
    const customer = await this.userRepository.findOne({ where: { id } });

    return customer;
  }

  public async updateAccount(id: string, data: any) {
    const customer = await this.findById(id);

    if (!customer) {
      throw new HttpException(404, `Customer account not found`);
    }

    await this.userRepository.update({ id: customer?.id }, { ...data });

    return "customer data updated successfully";
  }
}

export default CustomerService;