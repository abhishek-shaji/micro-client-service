import { Content } from '../models/content.model';

class ContentDTO {
  id: string;
  data: any;
  author: string;
  publishedAt: Date;

  constructor({ _id, data, author, publishedAt }: Content) {
    this.id = _id;
    this.data = data;
    this.author = author;
    this.publishedAt = publishedAt;
  }
}

export { ContentDTO };
