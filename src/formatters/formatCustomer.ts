import { formatAddress } from './formatAddress';

export const formatCustomer = ({
  _id,
  firstname,
  lastname,
  email,
  phoneNumber,
  address,
  totalSpend,
  orderCount,
}: any) => ({
  id: _id,
  firstname,
  lastname,
  email,
  phoneNumber,
  address: formatAddress(address),
  totalSpend,
  orderCount,
});
