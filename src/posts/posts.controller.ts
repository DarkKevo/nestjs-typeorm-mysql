import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePostDTO } from './dto/createPost.dto';
import { PostsService } from './posts.service';
import { Post as post } from 'src/post.entity';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas los Post' })
  @ApiOkResponse({ description: 'Lista de Posts' })
  getPost(): Promise<post[]> {
    return this.postService.getPosts();
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo Post' })
  @ApiBody({ type: CreatePostDTO, description: 'Datos del Post a Crear' })
  @ApiCreatedResponse({ description: 'Post creado exitosamente' })
  @ApiNotFoundResponse({ description: 'El Id del Autor no Existe' })
  createPost(@Body() post: CreatePostDTO) {
    return this.postService.createPost(post);
  }
}
