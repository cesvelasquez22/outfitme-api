import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesModule } from './profiles/profiles.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards';

import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const isProduction = config.get<boolean>('production');
        const productionStage = config.get<string>('stage') === 'production';
        return {
          type: 'postgres',
          ssl: productionStage,
          extra: {
            ssl: productionStage ? { rejectUnauthorized: false } : null,
          },
          url: config.get<string>('database.url'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: !isProduction,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    ProfilesModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
