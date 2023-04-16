import * as yup from 'yup';

import { ValidationRulesType } from '../types/main';
import { applyValidationRules } from '../utils/applyValidationRules';

describe('applyValidationRules', () => {
  it('should apply a required rule to the field schema', () => {
    const fieldSchema = yup.string();
    const rules = { required: true };
    const schema = applyValidationRules(fieldSchema, rules);

    expect(schema.describe().tests[0]).toStrictEqual({
      name: 'required',
      params: undefined,
    });
  });

  it('should apply a min rule to the field schema', () => {
    const fieldSchema = yup.number();
    const rules = { min: 10 };
    const schema = applyValidationRules(fieldSchema, rules);

    expect(schema.describe().tests[0]).toStrictEqual({
      name: 'min',
      params: { min: 10 },
    });
  });

  it('should apply a max rule to the field schema', () => {
    const fieldSchema = yup.number();
    const rules = { max: 100 };
    const schema = applyValidationRules(fieldSchema, rules);

    expect(schema.describe().tests[0]).toStrictEqual({
      name: 'max',
      params: { max: 100 },
    });
  });

  it('should apply a pattern rule to the field schema', () => {
    const fieldSchema = yup.string();
    const rules = { pattern: /^[a-zA-Z0-9]*$/ };
    const schema = applyValidationRules(fieldSchema, rules);

    expect(schema.describe().tests[0]).toStrictEqual({
      name: 'matches',
      params: { regex: /^[a-zA-Z0-9]*$/ },
    });
  });

  it('should not apply any rules if no rules are provided', () => {
    const fieldSchema = yup.string();
    const schema = applyValidationRules(fieldSchema);

    expect(schema.describe().tests).toHaveLength(0);
  });

  it('should not apply any rules if an invalid rule is provided', () => {
    const fieldSchema = yup.string();
    const rules = { invalid: true } as ValidationRulesType;
    const schema = applyValidationRules(fieldSchema, rules);

    expect(schema.describe().tests).toHaveLength(0);
  });
});
