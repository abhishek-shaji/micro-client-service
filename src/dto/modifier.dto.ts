import { FileDTO } from '@abhishek-shaji/micro-common/dto';

import { Modifier } from '../models/modifier.model';

export class ModifierDTO {
  id: string;
  sku: string | undefined;
  availableQuantity: number;
  price: number;
  currency: string;
  images: FileDTO[];
  name: string | undefined;
  description: string | undefined;

  constructor(modifier: Modifier, locale?: string) {
    const { _id, sku, availableQuantity, images, price, currency } =
      modifier as any;
    this.id = _id;
    this.sku = sku;
    this.availableQuantity = availableQuantity;
    this.price = price;
    this.currency = currency || 'PLN';
    this.images = images?.length
      ? images.map((image) => new FileDTO(image))
      : [];

    if (locale) {
      this.name = modifier.get(`name.${locale}`);
      this.description = modifier.get(`description.${locale}`);
    } else {
      const { name, description } =
        typeof modifier.toObject === 'function'
          ? modifier.toObject()
          : modifier;
      this.name = name;
      this.description = description;
    }
  }
}
