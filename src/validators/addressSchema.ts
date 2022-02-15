import * as yup from 'yup';

export const customerSchema = yup.object().shape({
  firstname: yup.string().required(),
  lastname: yup.string().required()
  address: address
});
