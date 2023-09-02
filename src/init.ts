/* eslint-disable linebreak-style */
import 'reflect-metadata'; // for TypeORM
import { getConnection, getCustomRepository } from 'typeorm';
import { connect } from 'src/db-connect';
import { HealthcheckController } from 'src/controllers/healthcheck';
import { UserRepository } from 'src/repositories/user';
import { PostRepository } from 'src/repositories/post';
import { AuthService } from 'src/services/auth';
import { UserService } from 'src/services/user';
import { PostService } from 'src/services/post';
import { HealthcheckService } from 'src/services/healthcheck';
import { AuthController } from 'src/controllers/auth';
import { UserController } from 'src/controllers/user';
import { PostController } from 'src/controllers/post';

/**
 * Initialize all ENV values and dependencies here so that they are re-usable across web servers, queue runners and crons
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function init(): Promise<Record<string, any>>{

  // repositories
  await connect();

  const userRepository = getCustomRepository( UserRepository );
  const postRepository = getCustomRepository( PostRepository );

  // services
  const healthcheckService = new HealthcheckService( getConnection() );
  const authService = new AuthService( { userRepository } );
  const userService = new UserService( { userRepository } );
  const postService = new PostService( { postRepository } );

  // controllers
  const healthcheckController = new HealthcheckController( healthcheckService );
  const authController = new AuthController( { authService } );
  const userController = new UserController( { userService } );
  const postController = new PostController( { postService, userService } );

  return {
    healthcheckController,
    authController,
    userController,
    userRepository,
    postController
  };

}
