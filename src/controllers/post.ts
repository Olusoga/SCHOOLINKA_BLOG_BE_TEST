/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable object-curly-spacing */
/* eslint-disable linebreak-style */
import { NextFunction, Request, Response, Router } from 'express';
import { PostService } from 'src/services/post';
import { get } from 'lodash';
import { UserService } from 'src/services/user';
import  AuthMiddleware   from '../middlewares/handle-Token-authorization';
import { ErrorCodes } from 'src/domain/errors';
import { hasNextPage } from 'src/utils/hasmore'
import { validateCreatePost } from 'src/middlewares/validation';

interface PostControllerOptions {
    postService: PostService;
    userService: UserService
}

export class PostController{

  private router: Router;

  // eslint-disable-next-line no-unused-vars
  constructor( private readonly options: PostControllerOptions ){

    this.router = Router();
    this.router.post( '/create', validateCreatePost,  AuthMiddleware.protect , this.createPost.bind( this ) )
    this.router.get('/', this.find.bind( this ) );
    this.router.get( '/:postId', AuthMiddleware.protect, this.getPostById.bind( this ) );
    this.router.put( '/:postId', validateCreatePost, AuthMiddleware.protect, this.updatePost.bind( this ) );
    this.router.delete( '/:postId', AuthMiddleware.protect, this.deletePost.bind( this ) );

  }

  getRouter(): Router{

    return this.router;

  }

  public async find(req: Request, res: Response, next: NextFunction ): Promise<Response | void>{

    try{

      const queryparams = req.query;
      const [ posts, count] = await this.options.postService.findAndCountPosts(queryparams);

      const hasNext = hasNextPage(queryparams, count);

      res.setHeader('X-Has-Next-Page', hasNext.toString());
      return res.status(200).json({ posts, hasNext });

    } catch( error ){

      return next( error );

    }

  }
  public async createPost( req: Request, res: Response, next: NextFunction ){

    try{

      const userId = get( req, 'User._id' );
      if( !userId ){

        // Handle the case where the user ID is missing or invalid.
        return res.status( 401 ).json( {
          error_code: ErrorCodes.UNAUTHORIZED_REQUEST,
          message:    'Invalid user ID or user not authenticated'
        } );

      }

      // Your logic to fetch user information and create a post
      const user = await this.options.userService.getUserById( userId );
      if( !user ){

        // Handle the case where the user does not exist.
        return res.status( 404 ).json( {
          error_code: ErrorCodes.USER_NOT_FOUND,
          message:    'User not found'
        } );

      }
      const post = await this.options.postService.createPost( { ...req.body, user: user.id } );

      return res.status( 201 ).json( post );


    } catch( error ){

      return next( error );

    }

  }

  public async getPostById( req: Request, res: Response, next: NextFunction ): Promise<Response | void>{

    try{

      const postId = req.params.postId;
      const userId = get( req , 'User._id' );
      if( !userId ){

        // Handle the case where the user does not exist.
        return res.status( 404 ).json( {
          error_code: ErrorCodes.USER_NOT_FOUND,
          message:    'User not found'
        } );

      }

      const postResponse = await this.options.postService.getPostById( postId );

      return res.status( 201 ).json( postResponse );

    } catch( error ){

      return next( error );

    }

  }


  public async updatePost(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

    try {

      const { postId } = req.params;
      const { content, title } = req.body;
      const userId = get( req , 'User._id' );
      if( !userId ){
        return res.status( 404 ).json( {
          error_code: ErrorCodes.USER_NOT_FOUND,
          message:    'User not found'
        } );

      }

      const postData = await this.options.postService.update( postId, content, title );

      return res.status(200).json(postData);

    } catch (error) {

      return next(error);

    }

  }

  public async deletePost(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

    try {

      const { postId } = req.params;
      const userId = get( req , 'User._id' );
      if( !userId ){

        // Handle the case where the user does not exist.
        return res.status( 404 ).json( {
          error_code: ErrorCodes.USER_NOT_FOUND,
          message:    'User not found'
        } );

      }

      const postData = await this.options.postService.delete(postId);

      return res.status(200).json(postData);

    } catch (error) {

      return next(error);

    }

  }

}
