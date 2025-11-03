import { Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ProfileAction } from "@repo/common";
import { User } from "@supabase/supabase-js";
import { Principal } from "decorators";
import { AuthGuard } from "modules/auth/auth.guard";
import { ProfilesService } from "./profiles.service";

@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
  ) {}

  @Get(':id')
  async getProfileById(
    @Param('id') id: string,
  ) {
    return await this.profilesService.getProfileById(id);
  }

  @Get('can/:action')
  @UseGuards(AuthGuard)
  async canProfilePerformAction(
    @Principal() user: User,
    @Param('action') action: ProfileAction,
    @Query('resourceId') resourceId?: string,
  ) {
    await this.profilesService.checkProfileCanPerformAction(user, action, resourceId);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createProfile(
    @Principal() user: User,
  ) {
    return await this.profilesService.createProfile(user);
  }

  @Post('get-or-create')
  @UseGuards(AuthGuard)
  async getOrCreateProfile(
    @Principal() user: User,
  ) {
    return await this.profilesService.getOrCreateProfile(user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteProfile(
    @Principal() user: User,
    @Param('id') id: string,
  ) {
    return await this.profilesService.deleteProfile(user, id);
  }
}
