import { BadRequestException } from '@abhishek-shaji/micro-common/exceptions';

import { generateValidationSchema } from '../modules/validation-schema-generator';
import { ContentSchemaConfig } from '../types/content';

const getErrorMessages = ({ path, message, inner }) => {
  if (inner && inner.length) {
    return inner.reduce((acc, { path, message }) => {
      acc[path] = message;
      return acc;
    }, {});
  }
  return { [path]: message };
};

export const validateContent = async (
  config: ContentSchemaConfig,
  data: any
) => {
  try {
    const validationSchema = generateValidationSchema(config);

    validationSchema.validateSync(data);
  } catch (error) {
    console.log(error.errors);

    throw new BadRequestException('Validation Failed', getErrorMessages(error));
  }
};
