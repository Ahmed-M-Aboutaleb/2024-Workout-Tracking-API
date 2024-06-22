import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { SetsModule } from './sets/sets.module';

const ENV = process.env.NODE_ENV;

console.log('ENV', ENV);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
    AppModule.createMongooseModule(),
    ThrottlerModule.forRoot([{ limit: 10, ttl: 60 }]),
    UsersModule,
    AuthModule,
    SetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static createMongooseModule() {
    console.log('DB_URI', process.env.DB_URI);
    return MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: await configService.get<string>('DB_URI'),
      }),
      inject: [ConfigService],
    });
  }
}
