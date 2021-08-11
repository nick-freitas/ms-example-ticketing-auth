import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from './root-mongoose-test.module';
import { UserSchema } from '../src/schema/user.schema';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../src/strategy/local.strategy';
import { JwtStrategy } from '../src/strategy/jwt.strategy';

describe('Auth Service (e2e)', () => {
  describe('/api/users/signin', () => {
    let app: INestApplication;
    const signupRoute = '/api/users/signup';
    const route = '/api/users/signin';

    beforeEach(async () => {
      process.env.JWT_SECRET_KEY = 'TESTINGKEY';

      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
          rootMongooseTestModule(),
          MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
          PassportModule,
          JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: '5m' },
          }),
        ],
        controllers: [AppController],
        providers: [AppService, LocalStrategy, JwtStrategy],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    });

    it('Signs in with a valid user', async () => {
      await request(app.getHttpServer())
        .post(signupRoute)
        .send({
          email: 'test@test.com',
          password: 'password',
        })
        .expect(201);

      return request(app.getHttpServer())
        .post(route)
        .send({
          email: 'test@test.com',
          password: 'password',
        })
        .expect(201);
    });

    it('Fails to sign in w/ a new user', () => {
      return request(app.getHttpServer())
        .post(route)
        .send({
          email: 'test@test',
          password: 'password',
        })
        .expect(401);
    });

    it('Sets a cookie after signin', async () => {
      await request(app.getHttpServer())
        .post(signupRoute)
        .send({
          email: 'test@test.com',
          password: 'password',
        })
        .expect(201);

      const res = await request(app.getHttpServer())
        .post(route)
        .send({
          email: 'test@test.com',
          password: 'password',
        })
        .expect(201);

      expect(res.get('Set-Cookie')).toBeDefined();
    });

    afterAll(async () => {
      await closeInMongodConnection();
      await app.close();
    });
  });
});
