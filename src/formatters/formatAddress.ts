import { Address, AddressModel } from '@abhishek-shaji/micro-common/models/Address';

export const formatAddress = ({ _id, addressLineOne, addressLineTwo, city, country }: Address) => ({
  id: _id,
  addressLineOne,
  addressLineTwo,
  city,
  country,
});
