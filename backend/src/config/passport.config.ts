import * as passport from 'passport';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class PassportConfig {
  constructor() {
    this.init();
  }

  init() {
    passport.serializeUser((user: User, done) => {
      done(null, user.snowflake);
    });

    passport.deserializeUser((snowflake: number, done) => {
      // Note: Dans un cas réel, vous devriez récupérer l'utilisateur depuis la base de données
      const user = { snowflake } as User;
      done(null, user);
    });
  }
} 