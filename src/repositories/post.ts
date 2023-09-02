/* eslint-disable linebreak-style */
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { Post } from 'src/domain/posts';
import { User } from 'src/domain/users';

export interface CreatePostPayload {
    user:User
    title: string;
    content: string;
    comments?: CreateCommentPayload[]; // Optional array of comments
  }

export interface CreateCommentPayload {
    user:User
    content: string;
  }

  @EntityRepository( Post )
export class PostRepository extends BaseRepository<Post>{

  public async findAndCountPosts( queryparams: any ): Promise<[Post[], number]>{

    const { from = 0, limit = 10, search = '', category = '' } = queryparams;

    const queryBuilder = this.createQueryBuilder( 'posts' );

    queryBuilder.where( 'posts.title ILIKE :search', { search: `%${ search || '' }%` } );

    // Apply filters based on the "category" parameter
    if( category ){

      queryBuilder.andWhere( 'posts.category = :category', { category } );

    }

    const [ posts, count ] = await queryBuilder
      .orderBy( 'posts.title' )
      .skip( from )
      .take( limit )
      .getManyAndCount();

    return [ posts, count ];

  }
  public async createPost( createdPostPayload: CreatePostPayload ): Promise<Post>{

    return this.save(
      this.create( createdPostPayload )
    );

  }

  public async findPostById( id: string ): Promise<Post>{

    const post = await this.findOne( id  );

    return post;

  }


  public async updatePost( existingPost:Post ): Promise<Post>{

    return this.save( existingPost );

  }

  public async deletePost( existingPost: Post ){

    return this.delete( existingPost.id );

  }

}
