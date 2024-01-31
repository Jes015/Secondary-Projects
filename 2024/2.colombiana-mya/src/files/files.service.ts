import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  create(file: string) {
    return 'This action adds a new file';
  }
}
