import { Address } from '@abhishek-shaji/micro-common/models/Address';

export const formatAddress = ({
  _id,
  addressLineOne,
  addressLineTwo,
  city,
  country,
  placeId,
}: Address) => ({
  id: _id,
  addressLineOne,
  addressLineTwo,
  city,
  country,
  placeId,
});
