import { Module } from '@nestjs/common'
import { ConfigModules } from './modules/config.module'
import { ControllersModule } from './modules/controllers.module'
import { AppController } from './app.controller';
import { GeneralModule } from './modules/general.module';
import { PointsModule } from './core/points/points.module';


@Module({
  imports: [
    ConfigModules, 
    ControllersModule, 
    GeneralModule, PointsModule
  ],
  controllers: [AppController],
})
export class AppModule {}
