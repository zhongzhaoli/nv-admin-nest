import { User } from '../user/user.entity';

export interface UserReq extends ParameterDecorator {
  user: User;
}
