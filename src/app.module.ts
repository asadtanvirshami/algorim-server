import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://asadworkemail:h5qjrZuhnwc1EoNz@cluster0.qy1ig6y.mongodb.net/',
    ),
    AuthModule,
  ],
})
export class AppModule {}
