import { FormFieldType } from '../enums/form-field.enum';

export interface ValidationRulesType {
  min?: number;
  max?: number;
  email?: boolean;
  pattern?: RegExp;
  required?: boolean;
}

export interface FieldSchemaType {
  type: FormFieldType;
  rules?: ValidationRulesType;
  translatable?: boolean;
  resourceUrl?: string;
  multiple?: boolean;
  children?:
    | {
        [key: string]: FieldSchemaType;
      }
    | FieldSchemaType;
}

export interface ContentSchemaConfig {
  [key: string]: FieldSchemaType;
}
