import { useMemo } from 'react';

import { generateValidationSchema } from '../index';
import { FieldSchemaType } from '../types/main';

export const useValidationSchemaGenerator = (schema: { [key: string]: FieldSchemaType }) => {
  return useMemo(() => generateValidationSchema(schema), [schema]);
};
