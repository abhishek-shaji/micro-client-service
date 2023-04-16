import { ModifierList } from '../models/modifier-list.model';
import { ModifierDTO } from './modifier.dto';

export class ModifierListDTO {
  id: string;
  selectMin: number;
  selectMax: number;
  modifiers: any[];
  name: string | undefined;
  description: string | undefined;

  constructor(modifierList: ModifierList, locale?: string) {
    const { _id, selectMin, selectMax, modifiers } = modifierList;

    this.id = _id;
    this.selectMin = selectMin;
    this.selectMax = selectMax;
    this.modifiers = modifiers?.length
      ? modifiers.map((modifier) => new ModifierDTO(modifier, locale))
      : [];

    if (locale) {
      this.name = modifierList.get(`name.${locale}`);
      this.description = modifierList.get(`description.${locale}`);
    } else {
      const { name, description } =
        typeof modifierList.toObject === 'function'
          ? modifierList.toObject()
          : modifierList;
      this.name = name;
      this.description = description;
    }
  }
}
