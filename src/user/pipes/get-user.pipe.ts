import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { GetUserDto } from '../dto/get-user.dto';
import { excludeNullValue } from '../../utils/query.helper';

@Injectable()
export class GetUserPipe implements PipeTransform {
  transform(value: GetUserDto, metadata: ArgumentMetadata) {
    return excludeNullValue<GetUserDto>(value);
  }
}
