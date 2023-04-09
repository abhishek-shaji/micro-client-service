import { IsOptional, IsString } from 'class-validator';

export class AddressSchema {
  @IsString()
  addressLineOne: string;

  @IsOptional()
  @IsString()
  doorNumber?: string;

  @IsOptional()
  @IsString()
  addressLineTwo?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  placeId?: string;

  @IsOptional()
  @IsString()
  deliveryInstructions?: string;

  @IsString()
  city: string;

  @IsString()
  country: string;
}
