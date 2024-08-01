import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from '../users/users.service';
import { Types } from 'mongoose';
import { Profile } from './entities/profile.entity';
import { AuthService } from '../auth/auth.service';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class ProfilesService {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  async findAll(): Promise<Profile[]> {
    const users = await this.userService.findAll();
    const profiles = users.map((user) => {
      user.password = undefined;
      user.role = undefined;
      return { user };
    });
    return profiles;
  }

  async findOne(username: string): Promise<Profile> {
    try {
      const user = await this.userService.findOneByUsername(username);
      user.password = undefined;
      user.role = undefined;
      return { user };
    } catch (error) {
      throw new BadRequestException('User not found');
    }
  }

  async update(
    id: Types.ObjectId,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    try {
      const user = await this.userService.update(id, updateProfileDto);
      delete user.password;
      return { user };
    } catch (error) {
      throw new BadRequestException('User not found');
    }
  }

  async delete(id: Types.ObjectId): Promise<Profile> {
    try {
      const user = await this.userService.delete(id);
      delete user.password;
      return { user };
    } catch (error) {
      throw new BadRequestException('User not found');
    }
  }

  async updatePassword(
    id: Types.ObjectId,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<Profile> {
    try {
      const user = await this.userService.findOne(id);
      console.log(user);
      const isPasswordValid = await this.authService.validateUser(
        user.username,
        updatePasswordDto.oldPassword,
      );
      if (!isPasswordValid) throw new BadRequestException('Invalid password');
      const hashedPassword = await this.authService.hashPassword(
        updatePasswordDto.newPassword,
      );
      console.log(hashedPassword);
      user.password = hashedPassword;
      const updatedUser = await this.userService.update(id, user);
      delete updatedUser.password;
      return { user: updatedUser };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
