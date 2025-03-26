import { Module } from '@nestjs/common'
import { ConfigModules } from './modules/config.module';
import { UserModule } from './core/user/user.module';

@Module({
  imports: [ConfigModules, UserModule],
})
export class AppModule {}
