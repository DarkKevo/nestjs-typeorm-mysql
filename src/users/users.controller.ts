import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from 'src/user.entity';
import { UpdateUserDTO } from './dto/update-user.dto';
import { CreateProfileDTO } from './dto/create-profile.dto';
import {
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiOkResponse({ description: 'Lista de usuarios obtenida correctamente' })
  getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  @ApiOkResponse({ description: 'Usuario encontrado' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUser(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({ type: CreateUserDTO, description: 'Datos del usuario a crear' })
  @ApiCreatedResponse({ description: 'Usuario creado exitosamente' })
  @ApiConflictResponse({ description: 'El username ya existe' })
  createUser(@Body() newUser: CreateUserDTO): Promise<User> {
    return this.usersService.createUser(newUser);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del usuario a eliminar',
  })
  @ApiOkResponse({ description: 'Usuario eliminado correctamente' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    console.log(id);
    console.log(id + 1);
    return this.usersService.deleteUser(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un usuario por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del usuario a actualizar',
  })
  @ApiBody({ type: UpdateUserDTO, description: 'Datos a actualizar' })
  @ApiOkResponse({ description: 'Usuario actualizado correctamente' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() editUser: UpdateUserDTO,
  ) {
    return this.usersService.updateUser(id, editUser);
  }

  @Post(':id/profile')
  @ApiOperation({ summary: 'Crear un perfil para un usuario' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  @ApiBody({ type: CreateProfileDTO, description: 'Datos del perfil' })
  @ApiCreatedResponse({ description: 'Perfil creado y vinculado al usuario' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  createProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() profile: CreateProfileDTO,
  ) {
    return this.usersService.createProfile(id, profile);
  }
}
