import { StatusCodes } from 'http-status-codes';

import {
  Body,
  Param,
  Response,
  Header,
} from '@abhishek-shaji/micro-common/decorators';
import { UnauthorizedException } from '@abhishek-shaji/micro-common/exceptions';
import { createLambda } from '@abhishek-shaji/micro-common/utils';

import { LambdaHandler } from '../../decorators/lambda-handler.decorator';
import { CustomerDTO } from '../../dto/customer.dto';
import { CustomerSchema } from '../../schemas/customer.schema';
import { CustomerService } from '../../services/customer.service';

@LambdaHandler()
class UpdateCustomer {
  constructor(private readonly customerService: CustomerService) {}

  @Response(StatusCodes.OK)
  async handler(
    @Param('merchantId', { isBsonId: true }) merchantId: string,
    @Param('customerId', { isBsonId: true }) customerId: string,
    @Body(CustomerSchema) body: CustomerSchema,
    @Header('x-customer-secret') secret?: string
  ): Promise<any> {
    const { firstname, lastname, email, phoneNumber, address } = body;

    if (!secret) {
      throw new UnauthorizedException();
    }

    const customer = await this.customerService.findCustomerById(customerId);

    if (secret !== customer.token) {
      throw new UnauthorizedException('Invalid secret');
    }

    const updated = await this.customerService.updateCustomer(customer, {
      firstname,
      lastname,
      email,
      phoneNumber,
      address,
    });

    return new CustomerDTO(updated);
  }
}

export default createLambda(UpdateCustomer, [CustomerService]);
