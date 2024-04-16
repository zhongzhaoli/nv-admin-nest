import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { GetRouteDto } from '../dto/get-route.dto';
import { excludeNullValue } from '../../utils/query.helper';

@Injectable()
export class GetRoutePipe implements PipeTransform {
  transform(value: GetRouteDto, metadata: ArgumentMetadata) {
    return excludeNullValue<GetRouteDto>(value);
  }
}
