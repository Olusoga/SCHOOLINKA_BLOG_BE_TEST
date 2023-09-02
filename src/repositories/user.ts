/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
import { EntityRepository } from 'typeorm';
import { User } from 'src/domain/users';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
}
@EntityRepository( User )
export class UserRepository extends BaseRepository<User>{

  public async findUser( email: string ): Promise<User>{

    const user = await this.findOne( { email } );

    return user;

  }

  public async findById( id: string ): Promise<User>{

    const user = await this.findOne( { id } );

    return user;

  }
  public async findAll(){

    const user = await this.find( { } );

    return user;

  }

  public async isEmailExist( email: string ): Promise<boolean>{

    const userCount = await this.count( { where: { email }  } );

    return userCount >= 1;

  }

  public async createUser( createdUserPayload: CreateUserPayload ): Promise<User>{

    return this.save(
      this.create( {
        username: createdUserPayload.username,
        email:    createdUserPayload.email,
        password: createdUserPayload.password,
      } )
    );

  }

}
