import { Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'features/auth/auth.guard';
import { Principal } from 'decorators/principal.decorator';
import { User } from '@repo/models';
import { AuthTestRepository } from './auth-test.repository';

@Controller('auth-test')
export class AuthTestController {
  constructor(
    private readonly testRepo: AuthTestRepository
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Principal() user: User,
  ) {
    return await this.testRepo.createPost(user, {
      ownerId: user.id,
      title: 'Title: ' + Math.floor(Math.random() * 100),
      content: 'This is my post'
    });
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async read(
    @Principal() user: User,
    @Param('id') id: string,
  ) {
    return await this.testRepo.getPostById(user, id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Principal() user: User,
    @Param('id') id: string,
  ) {
    return await this.testRepo.updatePost(user, id, {
      title: 'A new title: ' + Math.floor(Math.random() * 100),
    })
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(
    @Principal() user: User,
    @Param('id') id: string,
  ) {
    await this.testRepo.deletePost(user, id);
  }
}
