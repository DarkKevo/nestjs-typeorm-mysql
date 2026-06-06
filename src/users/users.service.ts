import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { CreateProfileDTO } from './dto/create-profile.dto';
import { Profile } from 'src/profile.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  getUsers() {
    return this.userRepository.find({
      relations: { posts: true },
    });
  }

  async getUser(id: number) {
    const userFound = await this.userRepository.findOneBy({ id });
    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return userFound;
  }

  async findByUsername(username: string) {
    const userFound = await this.userRepository.findOne({
      where: { username },
    });

    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return userFound;
  }

  async createUser(user: CreateUserDTO) {
    const userFound = await this.userRepository.findOne({
      where: { username: user.username },
    });

    if (userFound) {
      throw new HttpException('User Already Exists', HttpStatus.CONFLICT);
    }

    const hashed = await bcrypt.hash(user.password, 10);
    const newUser = this.userRepository.create({ ...user, password: hashed });
    return this.userRepository.save(newUser);
  }

  async deleteUser(id: number) {
    const result = await this.userRepository.delete({ id });
    if (result.affected === 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async updateUser(id: number, data: UpdateUserDTO) {
    const userFound = await this.userRepository.findOneBy({ id });
    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const newData = Object.assign(userFound, data);
    return this.userRepository.save(newData);
  }

  async createProfile(id: number, userProfile: CreateProfileDTO) {
    const userFound = await this.userRepository.findOneBy({ id });
    if (!userFound) {
      throw new HttpException('User Not found', HttpStatus.NOT_FOUND);
    }

    const newProfile = this.profileRepository.create(userProfile);
    const savedProfile = await this.profileRepository.save(newProfile);

    userFound.profile = savedProfile;

    return this.userRepository.save(userFound);
  }
}
