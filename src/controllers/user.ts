/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import { NextFunction, Request, Response, Router } from 'express';
import { UserService } from 'src/services/user';

interface AuthControllerOptions {
    userService: UserService;
}

export class UserController{

  private router: Router;

  // eslint-disable-next-line no-unused-vars
  constructor( private readonly options: AuthControllerOptions ){

    this.router = Router();
    this.router.get( '/:id', this.getUserById.bind( this ) );
    this.router.get( '/', this.findAllUsers.bind( this ) );
  }

  getRouter(): Router{

    return this.router;

  }

  public async getUserById( req: Request, res: Response, next: NextFunction ): Promise<Response | void>{

    try{

      const userId = req.params.id;

      const registerResponse = await this.options.userService.getUserById( userId );

      return res.status( 201 ).json( registerResponse );

    } catch( error ){

      return next( error );

    }

  }

  public async findAllUsers( req: Request, res: Response, next: NextFunction ): Promise<Response | void>{

    try{

      const registerResponse = await this.options.userService.findAll();

      return res.status( 201 ).json( registerResponse );

    } catch( error ){

      return next( error );

    }

  }

}
