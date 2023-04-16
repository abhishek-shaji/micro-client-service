import { OptionType } from '../../../src/types/common';
import { FormFieldType } from '../enum/FormFieldType';

export interface ValidationRulesType {
  min?: number;
  max?: number;
  email?: boolean;
  pattern?: RegExp;
  required?: boolean;
}

export interface FieldSchemaType {
  type: FormFieldType;
  locale?: string;
  rules?: ValidationRulesType;
  translatable?: boolean;
  options?: OptionType[];
  resourceUrl?: string;
  multiple?: boolean;
  children?:
    | {
        [key: string]: FieldSchemaType;
      }
    | FieldSchemaType;
}

export interface FormGeneratorConfigType {
  namespace: string;
  schema: {
    [key: string]: FieldSchemaType;
  };
}

const config = {
  title: 'Blog',
  formConfig: {
    field1: {
      type: FormFieldType.string,
      rules: {
        required: true,
      },
    },
    field2: {
      type: FormFieldType.object,
      children: {
        nestedField1: {
          type: FormFieldType.number,
          rules: {
            min: 3,
          },
        },
        nestedField2: {
          type: FormFieldType.array,
          children: {
            type: FormFieldType.string,
            rules: {
              max: 5,
            },
          },
        },
      },
    },
    field3: {
      type: FormFieldType.boolean,
    },
    field3: {
      type: FormFieldType.array,
      children: {
        type: FormFieldType.string,
      },
    },
  },
};
