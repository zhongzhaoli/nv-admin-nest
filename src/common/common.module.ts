import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { QiniuService } from '../qiniu/qiniu.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [CommonController],
  providers: [CommonService, QiniuService],
})
export class CommonModule {}
