import { Injectable } from '@nestjs/common';
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
    users.forEach((user) => {
      delete user.password;
    });
    return users;
  }

  async findOne(username: string): Promise<Profile> {
    const user = await this.userService.findOneByUsername(username);
    delete user.password;
    return user;
  }

  async update(
    id: Types.ObjectId,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const user = await this.userService.update(id, updateProfileDto);
    delete user.password;
    return user;
  }

  async delete(id: Types.ObjectId): Promise<Profile> {
    const user = await this.userService.delete(id);
    delete user.password;
    return user;
  }

  async updatePassword(
    id: Types.ObjectId,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<Profile> {
    const user = await this.userService.findOne(id);
    const isPasswordValid = await this.authService.validateUser(
      user.username,
      updatePasswordDto.oldPassword,
    );
    if (!isPasswordValid) throw new Error('Invalid password');
    const hashedPassword = await this.authService.hashPassword(
      updatePasswordDto.newPassword,
    );
    const updatedUser = await this.userService.update(id, {
      ...user,
      password: hashedPassword,
    });
    delete updatedUser.password;
    return updatedUser;
  }
}
