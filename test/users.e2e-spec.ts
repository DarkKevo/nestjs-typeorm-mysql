import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Users - E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  it('GET /users - debe devolver un array', async () => {
    const response = await request(app.getHttpServer()).get('/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /users/:id - Debe devolver el Usuario de ese ID', async () => {
    const newUser = { username: 'darkkevo', password: '123456' };
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(newUser);

    const body = response.body as {
      id: number;
      username: string;
      password: string;
    };

    expect(response.status).toBe(201);
    expect(body.id).toBeDefined();
    expect(body.username).toBe('darkkevo');

    const getUser = await request(app.getHttpServer()).get(`/users/${body.id}`);
    expect(getUser.status).toBe(200);
    expect(getUser.body).toHaveProperty('username', 'darkkevo');
    await request(app.getHttpServer()).delete(`/users/${body.id}`);
  });

  it('GET /users/:id - Debe devolver 404 si el usuario no existe', async () => {
    const response = await request(app.getHttpServer()).get('/users/9999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'User not found');
  });

  it('POST /users - Debe devolver un 201 si el usuario se Creo', async () => {
    const newUser = { username: 'testUser', password: '123456' };
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(newUser);

    const body = response.body as {
      id: number;
      username: string;
      password: string;
    };

    expect(response.status).toBe(201);
    expect(body.id).toBeDefined();
    expect(body.username).toBe('testUser');
    await request(app.getHttpServer()).delete(`/users/${body.id}`);
  });

  it('POST /users - Debe devolver un 409 si el usuario ya existe', async () => {
    const newUser = { username: 'testUser', password: '123456' };
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(newUser);

    const body = response.body as {
      id: number;
      username: string;
      password: string;
    };

    expect(body.id).toBeDefined();
    expect(body.username).toBe('testUser');

    const repeatUser = await request(app.getHttpServer())
      .post('/users')
      .send(newUser);

    expect(repeatUser.status).toBe(409);
    expect(repeatUser.body).toHaveProperty('message', 'User Already Exists');
    await request(app.getHttpServer()).delete(`/users/${body.id}`);
  });

  it('DELETE /users - Debe Eliminar un usuario devolviendo 200 al borrar', async () => {
    const newUser = { username: 'testUser', password: '123456' };
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(newUser);

    const body = response.body as {
      id: number;
      username: string;
      password: string;
    };

    expect(body.id).toBeDefined();
    expect(body.username).toBe('testUser');

    const deleteUser = await request(app.getHttpServer()).delete(
      `/users/${body.id}`,
    );
    expect(deleteUser.status).toBe(200);
  });

  it('DELETE /users - Debe falla al eliminar un usuario devolviendo 404 al no existir el id', async () => {
    const deleteUser = await request(app.getHttpServer()).delete(`/users/999`);
    expect(deleteUser.status).toBe(404);
    expect(deleteUser.body).toHaveProperty('message', 'User not found');
  });

  it('UPDATE /users - Debe actualizar el usuario devolviendo estado 200', async () => {
    const newUser = { username: 'testUser', password: '123456' };
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(newUser);

    const body = response.body as {
      id: number;
      username: string;
      password: string;
    };

    expect(body.id).toBeDefined();
    expect(body.username).toBe('testUser');

    const newData = { username: 'editado', password: '123456789' };

    const updateUser = await request(app.getHttpServer())
      .put(`/users/${body.id}`)
      .send(newData);

    const UpdateBody = updateUser.body as {
      id: number;
      username: string;
      password: string;
    };

    expect(updateUser.status).toBe(200);
    expect(UpdateBody.username).toBe('editado');
    expect(UpdateBody.password).toBe('123456789');
    await request(app.getHttpServer()).delete(`/users/${body.id}`);
  });

  it('UPDATE /users - Debe fallar al actualizar el usuario devolviendo estado 404', async () => {
    const newData = { username: 'editado', password: '123456789' };

    const updateUser = await request(app.getHttpServer())
      .put('/users/9999')
      .send(newData);

    expect(updateUser.status).toBe(404);
    expect(updateUser.body).toHaveProperty('message', 'User not found');
  });

  it('POST /users/:id/profile - Debe crear un perfil y devolver 201', async () => {
    const userRes = await request(app.getHttpServer())
      .post('/users')
      .send({ username: 'perfilUser', password: '123456' });

    const user = userRes.body as { id: number; username: string };
    expect(user.id).toBeDefined();

    const profileData = {
      firstName: 'Kevin',
      documentId: 30259086,
      phoneNumber: 4464566,
    };

    const profileRes = await request(app.getHttpServer())
      .post(`/users/${user.id}/profile`)
      .send(profileData);

    const profileBody = profileRes.body as {
      id: number;
      username: string;
      profile: { id: number; firstName: string; documentId: number };
    };

    expect(profileRes.status).toBe(201);
    expect(profileBody).toHaveProperty('profile');
    expect(profileBody.profile.firstName).toBe('Kevin');
    expect(profileBody.profile.documentId).toBe(30259086);

    await request(app.getHttpServer()).delete(`/users/${user.id}`);
  });

  afterAll(async () => {
    await app.close();
  });
});
