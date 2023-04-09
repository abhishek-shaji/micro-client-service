import { StatusCodes } from 'http-status-codes';

import {
  Param,
  Response,
  Query,
  IsGranted,
} from '@abhishek-shaji/micro-common/decorators';
import {
  AccessPermission,
  Namespace,
} from '@abhishek-shaji/micro-common/enums';
import {
  createLambda,
  createPaginatedResponse,
} from '@abhishek-shaji/micro-common/utils';

import { LambdaHandler } from '../../decorators/lambda-handler.decorator';
import { CustomerDTO } from '../../dto/customer.dto';
import { OrderService } from '../../services/order.service';

@LambdaHandler()
class CustomerList {
  constructor(private readonly orderService: OrderService) {}

  @IsGranted(Namespace.customer, AccessPermission.read)
  @Response(StatusCodes.OK, createPaginatedResponse)
  async handler(
    @Param('merchantId', { isBsonId: true }) merchantId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<any> {
    const result: any = await this.orderService.findCustomersByConfirmedOrders(
      merchantId,
      {
        page,
        limit,
      }
    );

    return {
      ...result,
      docs: result.docs.map((doc: any) => new CustomerDTO(doc)),
    };
  }
}

export default createLambda(CustomerList, [OrderService]);
