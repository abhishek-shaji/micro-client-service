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
  createdAt,
  lastOrderedAt,
  paymentMethodUsage,
}: any) => ({
  id: _id,
  firstname,
  lastname,
  email,
  phoneNumber,
  address: address ? formatAddress(address) : undefined,
  totalSpend,
  orderCount,
  createdAt,
  lastOrderedAt,
  paymentMethodUsage,
});
