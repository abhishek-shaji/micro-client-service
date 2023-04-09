import { AddressDTO } from '@abhishek-shaji/micro-common/dto';

class CustomerDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: AddressDTO;
  totalSpend: number;
  orderCount: number;
  createdAt: Date;
  lastOrderedAt: Date;
  paymentMethodUsage: string[];

  constructor({
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
  }: any) {
    this.id = _id;
    this.firstName = firstname;
    this.lastName = lastname;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address ? new AddressDTO(address) : undefined;
    this.totalSpend = totalSpend;
    this.orderCount = orderCount;
    this.createdAt = new Date(createdAt);
    this.lastOrderedAt = new Date(lastOrderedAt);
    this.paymentMethodUsage = paymentMethodUsage;
  }
}

export { CustomerDTO };
