import { BadRequestException, Injectable } from '@nestjs/common';
import { QiniuService } from '../qiniu/qiniu.service';
import { v4 as uuidv4 } from 'uuid';
import { FILE_MAX_SIZE } from '../config/constant.config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CommonService {
  constructor(
    private qiniuService: QiniuService,
    private httpService: HttpService,
  ) {}
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

  async weatherInfo(): Promise<any> {
    const response = await this.httpService
      .get(
        'https://restapi.amap.com/v3/weather/weatherInfo?key=0df041ef3f2ae770bcf3ad0ead8eb6de&city=440000',
      )
      .toPromise();
    const { lives, status } = response.data;
    if (status) {
      console.log(1);
      return lives[0];
    } else {
      return {
        province: '广东',
        city: '广东省',
        adcode: '440000',
        weather: '阴',
        temperature: '23',
        winddirection: '东北',
        windpower: '≤3',
        humidity: '88',
        reporttime: '2024-04-18 23:00:18',
        temperature_float: '23.0',
        humidity_float: '88.0',
      };
    }
  }
}
