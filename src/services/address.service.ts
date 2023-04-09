import { AddressDTO } from '@abhishek-shaji/micro-common/dto';
import { Address, AddressModel } from '@abhishek-shaji/micro-common/models';
import { AbstractModelBaseService } from '@abhishek-shaji/micro-common/services';

class AddressService extends AbstractModelBaseService<Address> {
  constructor() {
    super(AddressModel, AddressDTO, '');
  }
}

export { AddressService };
