import { Content } from '../models/content.model';

class ContentDTO {
  id: string;
  data: any;
  author: string;
  publishedAt: Date;

  constructor(
    { _id, data, author, publishedAt }: Content,
    showContent?: boolean
  ) {
    this.id = _id;

    if (showContent) {
      this.data = data;
    } else {
      this.data = {
        title: data.title,
      };
    }

    this.author = author;
    this.publishedAt = publishedAt;
  }
}

export { ContentDTO };
