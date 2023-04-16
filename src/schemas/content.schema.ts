import { IsString, IsDefined } from 'class-validator';

class ContentSchema {
  @IsString()
  @IsDefined()
  title: string;
}

export { ContentSchema };
