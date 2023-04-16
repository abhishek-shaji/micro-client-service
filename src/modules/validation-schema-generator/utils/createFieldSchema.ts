import * as yup from 'yup';

import { FormFieldType } from '../enum/FormFieldType';
import { FieldSchemaType } from '../types/main';

const createFieldSchema = (fieldConfig: FieldSchemaType): any => {
  switch (fieldConfig.type) {
    case FormFieldType.string:
    case FormFieldType.richText:
      return yup.string();
    case FormFieldType.number:
      return yup.number();
    case FormFieldType.boolean:
      return yup.boolean();
    case FormFieldType.date:
      return yup.date();
    case FormFieldType.array:
      return yup.array();
    case FormFieldType.object:
      return yup.object();
    case FormFieldType.image: {
      return yup.object().shape({
        id: yup.string().required(),
        filename: yup.string().required(),
        url: yup.string().required(),
      });
    }
    case FormFieldType.radio:
      return yup.string();
    case FormFieldType.select:
      return yup.array().of(yup.string().required());
    default:
      throw new Error(`Unknown field type: ${fieldConfig.type}`);
  }
};

export { createFieldSchema };
