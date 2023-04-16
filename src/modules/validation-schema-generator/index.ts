import * as yup from 'yup';

import { ContentSchemaConfig } from '../../types/content';
import { FormFieldType } from './enum/FormFieldType';
import { FieldSchemaType } from './types/main';
import { applyValidationRules } from './utils/applyValidationRules';
import { createFieldSchema } from './utils/createFieldSchema';

const i18n = ['en', 'pl'];

function isValidationConfigType(config: any): config is FieldSchemaType {
  return Object.values(FormFieldType).includes(config.type);
}

export function generateValidationSchema(
  schema: ContentSchemaConfig | FieldSchemaType
) {
  if (
    isValidationConfigType(schema) &&
    schema.type !== FormFieldType.array &&
    schema.type !== FormFieldType.object
  ) {
    return applyValidationRules(createFieldSchema(schema), schema);
  }

  const validationObj = Object.entries(schema).reduce(
    (acc: any, [name, config]) => {
      if (config.type === FormFieldType.heading) {
        return acc;
      }
      if (config.type === FormFieldType.object && config.children) {
        acc[name] = generateValidationSchema(config.children);

        return acc;
      }

      if (config.type === FormFieldType.array && config.children) {
        acc[name] = yup.array().of(generateValidationSchema(config.children));

        return acc;
      }

      if (config.translatable) {
        acc[name] = yup.object().shape(
          i18n.reduce((acc: any, locale) => {
            acc[locale] = applyValidationRules(
              createFieldSchema({ type: FormFieldType.string }),
              config
            );

            return acc;
          }, {})
        );

        return acc;
      }

      acc[name] = applyValidationRules(createFieldSchema(config), config);

      return acc;
    },
    {}
  );

  return yup.object().shape(validationObj);
}
