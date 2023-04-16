import { NotFoundException } from '@abhishek-shaji/micro-common/exceptions';
import { Merchant, MerchantModel } from '@abhishek-shaji/micro-common/models';

import { MerchantDTO } from '../dto/merchant.dto';

class MerchantService {
  async getMerchantById(merchantId: string): Promise<MerchantDTO> {
    const merchant = await MerchantModel.findById(merchantId).populate([
      {
        path: 'thumbnail',
      },
      {
        path: 'address',
      },
      {
        path: 'configuration',
      },
    ]);

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    return new MerchantDTO(merchant);
  }
}

export { MerchantService };
