import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { userPreSave } from './schema/user.pre-save';
import { User, UserSchema } from './schema/user.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', userPreSave);
          return schema;
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware);
  }
}
