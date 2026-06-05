import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Posts - E2E', () => {
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

  it('GET /posts - debe devolver un array', async () => {
    const response = await request(app.getHttpServer()).get('/posts');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /posts - debe crear un post devolviendo 201', async () => {
    // Usar username único para evitar conflictos entre ejecuciones
    const uniqueUsername = `postAuth_${Date.now()}`;

    const userRes = await request(app.getHttpServer())
      .post('/users')
      .send({ username: uniqueUsername, password: '123456' });

    const user = userRes.body as { id: number; username: string };
    expect(user.id).toBeDefined();

    const postData = {
      title: 'Comprar Papaya',
      content: 'Tengo que ir al super a comprar papayas',
      autorId: user.id,
    };

    const postRes = await request(app.getHttpServer())
      .post('/posts')
      .send(postData);

    const postBody = postRes.body as {
      id: number;
      title: string;
      content: string;
      author: { id: number; username: string };
    };

    expect(postRes.status).toBe(201);
    expect(postBody.id).toBeDefined();
    expect(postBody.title).toBe('Comprar Papaya');
    expect(postBody.content).toBe('Tengo que ir al super a comprar papayas');
    expect(postBody.author).toHaveProperty('id', user.id);
  });

  it('POST /posts - debe devolver 404 si el autor no existe', async () => {
    const postData = {
      title: 'Comprar Papaya',
      content: 'Tengo que ir al super a comprar papayas',
      autorId: 99999,
    };

    const response = await request(app.getHttpServer())
      .post('/posts')
      .send(postData);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'User not found');
  });

  afterAll(async () => {
    await app.close();
  });
});
