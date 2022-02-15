import { formatAddress } from './formatAddress';
import { Customer } from '../models/Customer';

export const formatCustomer = ({
  _id,
  firstname,
  lastname,
  email,
  phoneNumber,
  address,
}: Customer) => ({
  id: _id,
  firstname,
  lastname,
  email,
  phoneNumber,
  address: formatAddress(address),
});
