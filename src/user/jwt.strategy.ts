import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { getEnvConfig } from '../utils/dotenv.helper';
import { ConfigEnum } from '../enum/config.enum';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    const config = getEnvConfig();
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config[ConfigEnum.JWT_SECRET],
    });
  }

  async validate(payload: { sub: string }): Promise<User> {
    return this.userService.findOne(payload.sub);
  }
}
