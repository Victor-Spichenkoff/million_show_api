import { Module } from '@nestjs/common'
import { ConfigModules } from './modules/config.module'
import { ControllersModule } from './modules/controllers.module'
import { AppController } from './app.controller';


@Module({
  imports: [
    ConfigModules, 
    ControllersModule,],
  controllers: [AppController],
})
export class AppModule {}
