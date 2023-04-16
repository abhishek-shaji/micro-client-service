import * as yup from 'yup';

import { FormFieldType } from '../enum/FormFieldType';
import { createFieldSchema } from '../utils/createFieldSchema';

describe('createFieldSchema', () => {
  it('should return a string validation schema for FormFieldType.string', () => {
    const fieldConfig = { type: FormFieldType.string };
    const schema = createFieldSchema(fieldConfig);

    expect(schema).toBeInstanceOf(yup.string);
  });

  it('should return a number validation schema for FormFieldType.number', () => {
    const fieldConfig = { type: FormFieldType.number };
    const schema = createFieldSchema(fieldConfig);

    expect(schema).toBeInstanceOf(yup.number);
  });

  it('should return a boolean validation schema for FormFieldType.boolean', () => {
    const fieldConfig = { type: FormFieldType.boolean };
    const schema = createFieldSchema(fieldConfig);

    expect(schema).toBeInstanceOf(yup.boolean);
  });

  it('should return a date validation schema for FormFieldType.date', () => {
    const fieldConfig = { type: FormFieldType.date };
    const schema = createFieldSchema(fieldConfig);

    expect(schema).toBeInstanceOf(yup.date);
  });

  it('should return an array validation schema for FormFieldType.array', () => {
    const fieldConfig = { type: FormFieldType.array };
    const schema = createFieldSchema(fieldConfig);

    expect(schema).toBeInstanceOf(yup.array);
  });

  it('should return an object validation schema for FormFieldType.object', () => {
    const fieldConfig = { type: FormFieldType.object };
    const schema = createFieldSchema(fieldConfig);

    expect(schema).toBeInstanceOf(yup.object);
  });

  it('should throw an error for an invalid field type', () => {
    const fieldConfig = { type: 'invalid' as FormFieldType };
    expect(() => createFieldSchema(fieldConfig)).toThrow();
  });
});
