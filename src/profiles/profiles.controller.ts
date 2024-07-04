import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Role } from '../roles/roles.decorator';
import { Roles } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';

@Controller({
  version: '1',
  path: 'profiles',
})
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.profilesService.findOne(username);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Role(Roles.ADMIN, Roles.USER)
  @Patch()
  update(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const id = req.user.userID;
    return this.profilesService.update(id, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Role(Roles.ADMIN, Roles.USER)
  @Delete()
  remove(@Request() req) {
    const id = req.user.userID;
    return this.profilesService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Role(Roles.ADMIN, Roles.USER)
  @Patch('/change-password')
  updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
    const id = req.user.userID;
    return this.profilesService.updatePassword(id, updatePasswordDto);
  }
}
