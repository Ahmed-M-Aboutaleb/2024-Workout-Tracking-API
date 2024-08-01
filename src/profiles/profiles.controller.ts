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
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Profiles')
@Controller({
  version: '1',
  path: 'profiles',
})
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Profiles found successfully',
  })
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':username')
  @ApiResponse({
    status: 200,
    description: 'Profile found successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Profile not found',
  })
  findOne(@Param('username') username: string) {
    return this.profilesService.findOne(username);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN, Roles.USER)
  @Patch()
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Profile not found or invalid input',
  })
  update(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const id = req.user.userID;
    return this.profilesService.update(id, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN, Roles.USER)
  @Delete()
  remove(@Request() req) {
    const id = req.user.userID;
    return this.profilesService.delete(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN, Roles.USER)
  @Patch('/change-password')
  updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
    const id = req.user.userID;
    return this.profilesService.updatePassword(id, updatePasswordDto);
  }
}
