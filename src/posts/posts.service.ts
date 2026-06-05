import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/post.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreatePostDTO } from './dto/createPost.dto';

@Injectable()
export class PostsService {
  constructor(
    private userService: UsersService,
    @InjectRepository(Post) private PostRepository: Repository<Post>,
  ) {}

  getPosts() {
    return this.PostRepository.find({
      relations: { author: true },
    });
  }

  async createPost(post: CreatePostDTO) {
    const userFound = await this.userService.getUser(post.autorId);

    if (!userFound) {
      throw new HttpException('User not Found', HttpStatus.NOT_FOUND);
    }

    const newPost = this.PostRepository.create({ ...post, author: userFound });
    return this.PostRepository.save(newPost);
  }
}
