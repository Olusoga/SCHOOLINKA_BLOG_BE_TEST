/* eslint-disable linebreak-style */
/* eslint-disable space-in-parens */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import { Connection, getConnection } from 'typeorm';
import { PostRepository } from 'src/repositories/post';
import { User } from 'src/domain/users';
import { StandardError } from 'src/domain/standard-error';
import { ErrorCodes } from 'src/domain/errors';
export interface CreatePostPayload {
    user:User;
    title: string;
    content: string;
  }

  export interface EditPostPayload {
    id:string;
    title: string;
    content: string;

  }

export interface CreateCommentPayload {
    user:User;
    content: string;
  }

interface PostServiceOptions {
    postRepository: PostRepository;
}

export class PostService{

  private readonly connection: Connection;

  constructor( private readonly options: PostServiceOptions ){

    this.connection = getConnection();

  }
  public async findAndCountPosts( queryparams: any ){

    return this.options.postRepository.findAndCountPosts( queryparams );

  }
  

  public async createPost( createPostPayload: CreatePostPayload ): Promise< CreatePostPayload >{

    const post =  this.options.postRepository.createPost(createPostPayload );
    if(!post){
      throw new StandardError( ErrorCodes.INTERNAL_SERVER_ERROR, 'internal server error' );
    }
    
    return post
  }

  public async getPostById( id: string ){

    const post = await this.options.postRepository.findPostById( id );
    if(!post){
      throw new StandardError( ErrorCodes.POST_NOT_FOUND, 'Post does not exist' );
    }

    return post

  }

  public async update( post: string, content:string, title:string){

    const existingPost = await this.options.postRepository.findPostById( post );

    if( !existingPost ){

      throw new StandardError( ErrorCodes.POST_NOT_FOUND, 'Post does not exist' );

    }
    existingPost.content = content;
    existingPost.title = title

    return this.options.postRepository.updatePost( existingPost );

  }

  public async delete( post: string ){

    const existingPost = await this.options.postRepository.findPostById( post );

    if( !existingPost ){

      throw new StandardError( ErrorCodes.POST_NOT_FOUND, 'Post does not exist' );

    }

    return this.options.postRepository.deletePost( existingPost );

  }

}
