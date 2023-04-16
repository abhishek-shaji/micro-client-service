import { NotFoundException } from '@abhishek-shaji/micro-common/exceptions';
import { User } from '@abhishek-shaji/micro-common/models';

import '../models/content-schema.model';
import { Content, ContentModel } from '../models/content.model';

class ContentService {
  async get(merchantId: string, contentId: string): Promise<Content> {
    const content = await ContentModel.findOne({
      _id: contentId,
      merchant: merchantId,
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    return content;
  }

  async create(
    merchantId: string,
    contentSchemaId: string,
    author: string,
    data: any
  ) {
    const content = new ContentModel({
      data,
      author,
      contentSchema: contentSchemaId,
      merchant: merchantId,
    });

    await content.save();

    return content;
  }

  async update(merchantId: string, contentId: string, data: any) {
    const content = await this.get(merchantId, contentId);

    content.$set({
      data,
    });

    return content.save();
  }

  async publish(merchantId: string, contentId: string, user: User) {
    const content = await this.get(merchantId, contentId);

    content.$set({
      publishedAt: new Date(),
      publishedBy: user._id,
    });

    return content.save();
  }

  async unpublish(merchantId: string, contentId: string) {
    const content = await this.get(merchantId, contentId);

    content.$set({
      publishedAt: null,
      publishedBy: null,
    });

    return content.save();
  }

  async list(merchantId: string, contentSchemaId: string, { page, limit }) {
    return ContentModel.paginate(
      {
        merchant: merchantId,
        contentSchema: contentSchemaId,
      },
      {
        page,
        limit,
      }
    );
  }

  async delete(merchantId: string, contentSchemaId: string, contentId: string) {
    const content = await ContentModel.deleteOne({
      _id: contentId,
      merchant: merchantId,
      contentSchema: contentSchemaId,
    });

    if (content.deletedCount === 0) {
      throw new NotFoundException('Content not found');
    }

    return { success: true };
  }
}

export { ContentService };
