import { FormFieldType } from '../enum/FormFieldType';
import { FieldSchemaType, ValidationRulesType } from '../types/main';

const applyImageValidationRules = (fieldSchema: any, rules: ValidationRulesType) => {
  if (rules.required) {
    return fieldSchema.required();
  }

  return fieldSchema.nullable().default(null);
};

const applyGeneralValidationRules = (fieldSchema: any, rules: ValidationRulesType) => {
  return Object.entries(rules).reduce((acc, [key, value]) => {
    switch (key) {
      case 'required':
        return acc.required('This field is required');
      case 'min':
        return acc.min(value);
      case 'max':
        return acc.max(value);
      case 'pattern':
        return acc.matches(value);
      default:
        return acc;
    }
  }, fieldSchema);
};

export const applyValidationRules = (
  fieldSchema: any,
  { rules = {}, type }: FieldSchemaType,
): any => {
  switch (type) {
    case FormFieldType.image:
      return applyImageValidationRules(fieldSchema, rules);
    default:
      return applyGeneralValidationRules(fieldSchema, rules);
  }
};
