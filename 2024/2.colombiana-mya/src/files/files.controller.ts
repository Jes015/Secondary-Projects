import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { fileFilter } from './helpers';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { fileFilter }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (file == null)
      throw new BadRequestException(
        'You must upload a file in the format jpg/webp/png',
      );

    return { fileName: file.originalname };
  }
}
