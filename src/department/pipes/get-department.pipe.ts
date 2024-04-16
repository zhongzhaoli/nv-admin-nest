import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { GetDepartmentDto } from '../dto/get-department.dto';
import { excludeNullValue } from '../../utils/query.helper';

@Injectable()
export class GetDepartmentPipe implements PipeTransform {
  transform(value: GetDepartmentDto, metadata: ArgumentMetadata) {
    return excludeNullValue<GetDepartmentDto>(value);
  }
}
