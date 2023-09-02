/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import { UserRepository } from 'src/repositories/user';
import { ErrorCodes } from 'src/domain/errors';
import { StandardError } from 'src/libs/standard-error';
import { logger } from 'src/libs/logger';
import { Connection, getConnection } from 'typeorm';
import { User } from 'src/domain/users';

interface AuthServiceOptions {
    userRepository: UserRepository;
}

export class UserService{

  private readonly connection: Connection;

  constructor( private readonly options: AuthServiceOptions ){

    this.connection = getConnection();

  }
  public async getUserById( id: string ){

    return await this.options.userRepository.findById( id );

  }

  public async findAll(){

    return await this.options.userRepository.findAll();

  }

}
