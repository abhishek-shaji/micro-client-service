import * as yup from 'yup';
import { addressSchema } from './addressSchema';

export const customerSchema = yup
  .object()
  .shape({
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    email: yup.string().email().required(),
    phoneNumber: yup.string().required(),
    address: addressSchema.required(),
  })
  .noUnknown(true)
  .strict();
