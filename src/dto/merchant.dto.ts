import { AddressDTO, FileDTO } from '@abhishek-shaji/micro-common/dto';
import { Merchant } from '@abhishek-shaji/micro-common/models';

class MerchantDTO {
  private id: any;
  private name: string;
  private phoneNumber: number;
  private thumbnail: FileDTO;
  private address: AddressDTO;
  private configuration: { isAcceptingOrders: boolean };

  constructor(merchant: Merchant) {
    this.id = merchant._id;
    this.name = merchant.name;
    this.phoneNumber = merchant.phoneNumber;
    this.thumbnail = new FileDTO(merchant.thumbnail);
    this.address = new AddressDTO(merchant.address);
    this.configuration = {
      isAcceptingOrders: merchant.configuration.isAcceptingOrders,
    };
  }
}

export { MerchantDTO };
