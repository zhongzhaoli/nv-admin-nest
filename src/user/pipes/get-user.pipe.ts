import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { GetUserDto } from '../dto/get-user.dto';
import { excludeNullValue } from '../../utils/query.helper';

@Injectable()
export class GetUserPipe implements PipeTransform {
  transform(value: GetUserDto, metadata: ArgumentMetadata) {
    const screenData = excludeNullValue<GetUserDto>(value);
    delete screenData.page;
    delete screenData.pageSize;
    if (screenData.deptId) {
      if (screenData.deptId !== '0') {
        screenData['department'] = { id: screenData.deptId };
      }
      delete screenData.deptId;
    }
    const pageData = { page: +value.page, limit: +value.pageSize };
    return { pageData, screenData };
  }
}
