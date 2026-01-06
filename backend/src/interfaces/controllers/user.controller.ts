import {
    Controller,
    Post,
    Body,
    HttpStatus,
    HttpException
} from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';

@Controller('api/user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('updateProfile')
  async updateProfile(@Body() profileData: any): Promise<{ message: string }> {
    try {
      await this.authService.updateProfile(profileData);
      return { message: 'Profile updated successfully' };
    } catch (error) {
      throw new HttpException('Profile update failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
