import { AbstractModelBaseService } from '@abhishek-shaji/micro-common/services/AbstractModelBaseService';
import { Address, AddressModel } from '@abhishek-shaji/micro-common/models/Address';

import { formatAddress } from '../formatters/formatAddress';

class AddressService extends AbstractModelBaseService<Address> {
  constructor() {
    super(AddressModel, formatAddress, '');
  }
}

export { AddressService };
