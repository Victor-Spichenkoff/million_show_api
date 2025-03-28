import { Module } from '@nestjs/common'
import { ConfigModules } from './modules/config.module';
import { UserModule } from './core/user/user.module';
import { AuthModule } from './core/auth/auth.module';
import { ControllersModule } from './modules/controllers.module';
import { SeedingModule } from './seeding/seeding.module';

@Module({
  imports: [ConfigModules, ControllersModule, SeedingModule],
})
export class AppModule {}
