import { Module } from '@nestjs/common'
import { ConfigModules } from './modules/config.module'
import { ControllersModule } from './modules/controllers.module'


@Module({
  imports: [
    ConfigModules, 
    ControllersModule,],
})
export class AppModule {}
