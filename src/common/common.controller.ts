import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { CommonService } from './common.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('/fileUpload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard('jwt'))
  fileUpload(@UploadedFile() file: any): any {
    return this.commonService.fileUpload(file);
  }
}
