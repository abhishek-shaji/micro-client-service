import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsUrl,
  IsBoolean,
  ValidateNested,
  IsString,
  IsDefined,
} from 'class-validator';

import { FormFieldType } from '../enums/form-field.enum';

class ValidationRules {
  @IsOptional()
  @IsBoolean()
  min?: string;

  @IsOptional()
  @IsBoolean()
  max?: string;

  @IsOptional()
  @IsBoolean()
  email?: string;

  @IsOptional()
  @IsBoolean()
  pattern?: string;

  @IsOptional()
  @IsBoolean()
  required?: string;
}

class FieldSchema {
  @IsEnum(FormFieldType)
  type: FormFieldType;

  @IsString()
  @IsDefined()
  label: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ValidationRules)
  rules?: ValidationRules;

  @IsOptional()
  translatable?: boolean;

  @IsOptional()
  @IsUrl()
  resourceUrl?: string;

  @IsOptional()
  @IsBoolean()
  multiple?: boolean;
}

export { FieldSchema };
