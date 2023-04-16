import { validateOrReject } from 'class-validator';

import { BadRequestException } from '@abhishek-shaji/micro-common/exceptions';

import { FormFieldType } from '../enums/form-field.enum';
import { FieldSchema } from '../schemas/field.schema';
import { ContentSchemaConfig } from '../types/content';

export const validateConfig = async (config: ContentSchemaConfig) => {
  try {
    if (!config) {
      throw new Error('Config cannot be undefined');
    }

    for (const key of Object.keys(config)) {
      const field = config[key];

      if (field.type === FormFieldType.object) {
        await validateConfig(field.children as ContentSchemaConfig);
      }

      if (field.type === FormFieldType.array) {
        if (!field.children) {
          throw new Error('Array field must have children');
        }

        const childFieldSchema = new FieldSchema();
        Object.assign(childFieldSchema, field.children);

        await validateOrReject(childFieldSchema);
      }

      const fieldSchema = new FieldSchema();
      Object.assign(fieldSchema, field);

      await validateOrReject(fieldSchema);
    }
  } catch (e) {
    throw new BadRequestException(e.message, e);
  }
};
