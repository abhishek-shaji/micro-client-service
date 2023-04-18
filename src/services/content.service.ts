import { ContentDTO } from '../dto/content.dto';
import { ContentSchemaModel } from '../models/content-schema.model';
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
}

export { ContentService };
