import * as yup from 'yup';

export const addressSchema = yup
  .object()
  .shape({
    addressLineOne: yup.string().required(),
    doorNumber: yup.string(),
    addressLineTwo: yup.string(),
    postalCode: yup.string(),
    placeId: yup.string(),
    deliveryInstructions: yup.string(),
    city: yup.string().required(),
    country: yup.string().required(),
  })
  .noUnknown(true)
  .strict();
