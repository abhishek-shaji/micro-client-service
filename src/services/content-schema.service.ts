import { NotFoundException } from '@abhishek-shaji/micro-common/exceptions';

import {
  ContentSchema,
  ContentSchemaModel,
} from '../models/content-schema.model';
import { ContentSchemaSchema } from '../schemas/content-schema.schema';

class ContentSchemaService {
  public async get(
    merchantId: string,
    contentId: string
  ): Promise<ContentSchema> {
    const contentSchema = await ContentSchemaModel.findOne({
      _id: contentId,
      merchant: merchantId,
    });

    if (!contentSchema) {
      throw new NotFoundException();
    }

    return contentSchema;
  }

  public async list(merchantId: string, { page, limit }) {
    return ContentSchemaModel.paginate(
      {
        merchant: merchantId,
      },
      {
        page,
        limit,
      }
    );
  }

  public async create(contentSchema: any) {
    const contentSchemaDocument = new ContentSchemaModel(contentSchema);
    await contentSchemaDocument.save();

    return contentSchemaDocument;
  }

  public async update(
    merchantId: string,
    contentId: string,
    { title, config }: ContentSchemaSchema
  ) {
    const contentSchema = await this.get(merchantId, contentId);

    contentSchema.$set({
      title,
      config,
    });

    await contentSchema.save();

    return contentSchema;
  }

  public async delete(merchantId: string, contentId: string) {
    const contentSchema = await this.get(merchantId, contentId);

    await ContentSchemaModel.findByIdAndRemove(contentSchema._id);
  }
}

export { ContentSchemaService };
