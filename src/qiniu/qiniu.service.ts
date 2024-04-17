import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as qiniu from 'qiniu';
import {
  QINIU_AK,
  QINIU_BUCKET,
  QINIU_RESOURCES_URL,
  QINIU_SK,
  QINIU_UPLOAD_URL,
} from '../config/constant.config';

interface QiniuResponse {
  hash: string;
  key: string;
}

@Injectable()
export class QiniuService {
  private mac: qiniu.auth.digest.Mac;
  private config: qiniu.conf.Config;
  private bucketManager: qiniu.rs.BucketManager;
  private uploadToken: string;
  private putPolicy: qiniu.rs.PutPolicy;

  constructor(private httpService: HttpService) {
    this.mac = new qiniu.auth.digest.Mac(QINIU_AK, QINIU_SK);
    this.config = new qiniu.conf.Config();
    this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);
    this.putPolicy = new qiniu.rs.PutPolicy({
      scope: QINIU_BUCKET,
    });
  }
  async upload(file: any, fileName: string): Promise<any> {
    const uploadToken = this.putPolicy.uploadToken(this.mac);
    const response = await this.httpService
      .post(
        QINIU_UPLOAD_URL,
        {
          file: file.buffer,
          token: uploadToken,
          key: fileName,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      .toPromise();
    const responseData = response.data as QiniuResponse;
    return QINIU_RESOURCES_URL + responseData.key;
  }
}
