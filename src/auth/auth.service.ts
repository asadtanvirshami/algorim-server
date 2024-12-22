import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../schemas/user/user.schema'; // Adjust the path to your TypeORM User entity
import { SignUpDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ message: string }> {
    const { firstName, lastName, profile_picture, email, password } = signUpDto;

    // Check if the user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      profile_picture,
      lastName,
      firstName,
    });
    this.userRepository.save(newUser);

    let response = {
      message: 'success',
    };

    return response;
  }

  async signIn(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    // Check if the user exists by email
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials'); // User not found
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials'); // Password mismatch
    }

    // Generate JWT token with user's email and id as the payload
    const payload = {
      email: user.email,
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret:
        '8f2a3e2c7b0d5c4e827fcd11d273fb021c973d9e42baff5f8309dcba2e9e7587',
      algorithm: 'HS256',
    });

    // Return the generated token
    let response = {
      accessToken,
      message: 'success',
    };
    return response;
  }

  async update(user): Promise<{ user: User; token: string }> {
    console.log(user, 'ISERR');

    const existingUser = await this.userRepository.findOne({
      where: { id: user?.id },
    });
    if (!existingUser) {
      throw new UnauthorizedException('Invalid id');
    }

    const updatedUserData = {
      ...existingUser,
      ...user,
    };

    await this.userRepository.save(updatedUserData);

    let payload = {
      email: updatedUserData.email,
      sub: updatedUserData.id,
      firstName: updatedUserData.firstName,
      lastName: updatedUserData.lastName,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret:
        '8f2a3e2c7b0d5c4e827fcd11d273fb021c973d9e42baff5f8309dcba2e9e7587',
      algorithm: 'HS256',
    });

    return {
      user: updatedUserData,
      token: accessToken,
    };
  }

  async getUser(id: string): Promise<{ user: User; message: string }> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new UnauthorizedException('Invalid id');
    }
    let response = {
      user,
      message: 'user found',
    };
    return response;
  }

  async resetPassword(
    oldPassword: string,
    newPassword: string,
    id: string,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!user) {
      throw new UnauthorizedException('Invalid id');
    }
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials'); // Password mismatch
    }
    if (isPasswordValid) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      this.userRepository.save(user);
    }
    let response = {
      message: 'password changed',
    };
    return response;
  }
}
