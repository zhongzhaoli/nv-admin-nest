import { BadRequestException, Injectable } from '@nestjs/common';
import { QiniuService } from '../qiniu/qiniu.service';
import { v4 as uuidv4 } from 'uuid';
import { FILE_MAX_SIZE } from '../config/constant.config';

@Injectable()
export class CommonService {
  constructor(private qiniuService: QiniuService) {}
  fileUpload(file: any): any {
    if (!file) throw new BadRequestException('请上传图片');
    const fileName: string = uuidv4();
    const size: number = file.size;
    if (size > FILE_MAX_SIZE) {
      throw new BadRequestException(
        `图片大小不能超过${FILE_MAX_SIZE / 1024 / 1024}M`,
      );
    }
    return this.qiniuService.upload(file, fileName);
  }
}
