import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeORM module
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../schemas/user/user.schema'; // Adjust the import path
import { JwtStrategy } from './strategies/auth/jwt.strategy'; // Adjust the import path
import { JwtAuthGuard } from './strategies/auth/jwt.auth.guard'; // Adjust the import path

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Use TypeORM to manage User entity
    PassportModule,
    JwtModule.register({
      secret:
        '8f2a3e2c7b0d5c4e827fcd11d273fb021c973d9e42baff5f8309dcba2e9e7587', // Replace with your secret key
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
