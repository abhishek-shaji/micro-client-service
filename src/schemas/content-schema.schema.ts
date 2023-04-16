import { IsString, IsObject, IsDefined } from 'class-validator';

import { FieldSchemaType } from '../types/content';

class ContentSchemaSchema {
  @IsString()
  @IsDefined()
  title: string;

  @IsObject()
  @IsDefined()
  config: {
    [key: string]: FieldSchemaType;
  };
}

export { ContentSchemaSchema };
