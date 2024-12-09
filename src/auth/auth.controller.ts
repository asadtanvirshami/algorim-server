import { JwtAuthGuard } from './strategies/auth/jwt.auth.guard';
import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
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

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
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
}
