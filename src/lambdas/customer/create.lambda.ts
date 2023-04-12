import { StatusCodes } from 'http-status-codes';

import {
  Body,
  Param,
  Response,
  Recaptcha,
} from '@abhishek-shaji/micro-common/decorators';
import { createLambda } from '@abhishek-shaji/micro-common/utils';

import { LambdaHandler } from '../../decorators/lambda-handler.decorator';
import { CustomerDTO } from '../../dto/customer.dto';
import { CustomerSchema } from '../../schemas/customer.schema';
import { CustomerService } from '../../services/customer.service';

@LambdaHandler()
class CreateCustomer {
  constructor(private readonly customerService: CustomerService) {}

  @Recaptcha('CreateCustomer')
  @Response(StatusCodes.CREATED)
  async handler(
    @Param('merchantId', { isBsonId: true }) merchantId: string,
    @Body(CustomerSchema) body: CustomerSchema
  ): Promise<any> {
    const { firstname, lastname, email, phoneNumber, address } = body;
    const customer = await this.customerService.createCustomer({
      firstname,
      lastname,
      address,
      email,
      phoneNumber,
      merchant: merchantId,
    });

    return {
      token: customer.token,
      customer: new CustomerDTO(customer),
    };
  }
}

export default createLambda(CreateCustomer, [CustomerService]);
