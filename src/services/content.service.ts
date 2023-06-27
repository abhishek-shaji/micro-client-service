import {
  BadRequestException,
  NotFoundException,
} from '@abhishek-shaji/micro-common/exceptions';

import { ContentDTO } from '../dto/content.dto';
import {
  ContentSchema,
  ContentSchemaModel,
} from '../models/content-schema.model';
import { ContentModel } from '../models/content.model';

class ContentService {
  async getBlogsByMerchant(
    merchantId: string,
    showContent?: boolean
  ): Promise<ContentDTO[]> {
    const contentSchema = await ContentSchemaModel.findOne({
      title: 'Blog',
      merchant: merchantId,
    });

    if (!contentSchema) {
      return [];
    }

    const blogs = await ContentModel.find({
      merchant: merchantId,
      contentSchema: contentSchema._id,
    });

    return blogs.map((blog) => new ContentDTO(blog, showContent));
  }

  async getPromotionBannersByMerchant(
    merchantId: string,
    showContent?: boolean
  ): Promise<ContentDTO[]> {
    const contentSchema = await ContentSchemaModel.findOne({
      title: 'Promotion Banner',
      merchant: merchantId,
    });

    if (!contentSchema) {
      return [];
    }

    const blogs = await ContentModel.find({
      merchant: merchantId,
      contentSchema: contentSchema._id,
    });

    return blogs.map((blog) => new ContentDTO(blog, showContent));
  }

  private async getContentByApiIdentifier(
    merchantId: string,
    apiIdentifier: string,
    limit: number = 10
  ): Promise<ContentDTO[] | ContentDTO> {
    const contentSchema = await ContentSchemaModel.findOne({
      merchant: merchantId,
      apiIdentifier: apiIdentifier.toLowerCase(),
    });

    if (!contentSchema) {
      throw new NotFoundException(
        `Content Type with API Identifier ${apiIdentifier} not found`
      );
    }

    const contents = await ContentModel.find({
      merchant: merchantId,
      contentSchema: contentSchema._id,
    }).limit(limit);

    if (contents.length === 0) {
      return contentSchema.entryType === 'single' ? undefined : [];
    }

    if (contentSchema.entryType === 'single') {
      return new ContentDTO(contents[0], true);
    }

    return contents.map((content) => new ContentDTO(content, true));
  }

  async getContentByContentIds(
    merchantId: string,
    apiIdentifiers: string[],
    limit: number = 10
  ) {
    const response = {};

    await Promise.all(
      apiIdentifiers.map(async (id: string): Promise<void> => {
        response[id] = await this.getContentByApiIdentifier(
          merchantId,
          id,
          limit
        );
      })
    );

    return response;
  }
}

export { ContentService };
