import { ContentSchema } from '../models/content-schema.model';

class ContentSchemaDTO {
  id: string;
  title: string;
  config: any;

  constructor({ _id, title, config }: ContentSchema) {
    this.id = _id;
    this.title = title;
    this.config = config;
  }
}

export { ContentSchemaDTO };
