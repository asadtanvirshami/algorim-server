import { JwtAuthGuard } from './strategies/auth/jwt.auth.guard';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name); // Updated logger name to AuthController

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() data: any) {
    console.log(data, 'SADAATA');

    return this.authService.resetPassword(
      data.old_password,
      data.new_password,
      data.id,
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto);
  }

  @Put('update/:id')
  async updateInfo(@Param('id') id: string, @Body() userDto: any) {
    console.log(userDto);

    try {
      return await this.authService.update(userDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post('google-signin')
  async googleSignin(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify-session')
  verifySession(@Request() req) {
    // Log the req.user object
    this.logger.log('User info:', req.user);

    if (req.user) {
      return {
        valid: true,
        success: true,
      };
    } else {
      return {
        valid: false,
        success: false,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-user/:id')
  getUser(@Param('id') id: string, @Request() req) {
    this.logger.log('User info:', req);

    return this.authService.getUser(id);
  }
}
