import * as yup from 'yup';

import { FormFieldType } from '../enum/FormFieldType';
import { generateValidationSchema } from '../index';

describe('generateValidationSchema', () => {
  it('should generate a validation schema for a form schema object', () => {
    const formSchema = {
      username: { type: FormFieldType.string, rules: { required: true } },
      age: { type: FormFieldType.number, rules: { min: 18 } },
    };

    const validationSchema = generateValidationSchema(formSchema);

    expect(validationSchema.describe()).toStrictEqual(
      yup
        .object()
        .shape({
          username: yup.string().required(),
          age: yup.number().min(18),
        })
        .describe(),
    );
  });

  it('should generate a nested validation schema for a form schema object with children', () => {
    const formSchema = {
      user: {
        type: FormFieldType.object,
        children: {
          username: { type: FormFieldType.string, rules: { required: true } },
          age: { type: FormFieldType.number, rules: { min: 18 } },
        },
      },
    };

    const validationSchema = generateValidationSchema(formSchema);
    expect(validationSchema.describe()).toEqual(
      yup
        .object()
        .shape({
          user: yup.object().shape({
            username: yup.string().required(),
            age: yup.number().min(18),
          }),
        })
        .describe(),
    );
  });

  it('should generate a nested validation schema for a form schema object with array children', () => {
    const formSchema = {
      users: {
        type: FormFieldType.array,
        children: { type: FormFieldType.string, rules: { required: true } },
      },
    };

    const validationSchema = generateValidationSchema(formSchema);

    expect(validationSchema.describe()).toEqual(
      yup
        .object()
        .shape({
          users: yup.array().of(yup.string().required()),
        })
        .describe(),
    );
  });

  it('should generate a nested validation schema for a form schema object with array of objects', () => {
    const formSchema = {
      users: {
        type: FormFieldType.array,
        children: {
          username: { type: FormFieldType.string, rules: { required: true } },
          nickNames: {
            type: FormFieldType.array,
            children: { type: FormFieldType.string, rules: { required: true } },
          },
        },
      },
    };

    const validationSchema = generateValidationSchema(formSchema);

    expect(validationSchema.describe()).toEqual(
      yup
        .object()
        .shape({
          users: yup.array().of(
            yup.object().shape({
              username: yup.string().required(),
              nickNames: yup.array().of(yup.string().required()),
            }),
          ),
        })
        .describe(),
    );
  });
});
