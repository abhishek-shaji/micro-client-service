import { StatusCodes } from 'http-status-codes';

import {
  Body,
  Param,
  Response,
  Query,
} from '@abhishek-shaji/micro-common/decorators';
import { createLambda } from '@abhishek-shaji/micro-common/utils';

import { LambdaHandler } from '../../decorators/lambda-handler.decorator';
import { CustomerDTO } from '../../dto/customer.dto';
import { CustomerSchema } from '../../schemas/customer.schema';
import { CustomerService } from '../../services/customer.service';
import { OrderService } from '../../services/order.service';

@LambdaHandler()
class UpdateCustomer {
  constructor(
    private readonly customerService: CustomerService,
    private readonly orderService: OrderService
  ) {}

  @Response(StatusCodes.OK)
  async handler(
    @Param('merchantId', { isBsonId: true }) merchantId: string,
    @Param('customerId', { isBsonId: true }) customerId: string,
    @Query('token') token: string,
    @Body(CustomerSchema) body: CustomerSchema
  ): Promise<any> {
    const { firstname, lastname, email, phoneNumber, address } = body;

    await this.orderService.validateToken(customerId, token);

    const customer = await this.customerService.findCustomerById(customerId);

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

export default createLambda(UpdateCustomer, [CustomerService, OrderService]);
