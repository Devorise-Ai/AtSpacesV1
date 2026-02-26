import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PresentationModule } from './presentation/presentation.module';
import { AuthModule } from './application/auth.module';

@Module({
  imports: [PresentationModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
