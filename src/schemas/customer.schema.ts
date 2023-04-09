import { Type } from 'class-transformer';
import { IsString, IsEmail, IsPhoneNumber } from 'class-validator';

import { AddressSchema } from './address.schema';

export class CustomerSchema {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  phoneNumber: string;

  @Type(() => AddressSchema)
  address: AddressSchema;
}
