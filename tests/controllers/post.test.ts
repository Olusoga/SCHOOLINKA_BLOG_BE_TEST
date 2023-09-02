/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
import { createApp } from 'src/app';
import request from 'supertest';
import { getConnection } from 'typeorm';
import { validAccessToken } from '../token';
import { Post } from 'src/domain/posts';

describe( 'Post API', ()=>{

  let app: Express.Application;

  beforeAll( async()=>{

    app = await createApp();
    await getConnection().runMigrations();

  } );

  afterAll( async()=>{

    await getConnection().close();

  } );

  describe( 'GET v1/post', ()=>{

    test( 'returns a list of posts', async()=>{

      const response = await request( app ).get( '/v1/post' );

      expect( response.statusCode ).toBe( 200 );
      expect( response.body.posts ).toEqual( expect.any( Array ) );

    } );

    test( 'returns a paginated list of posts', async()=>{

      const response = await request( app ).get( '/v1/post/?search=assword1@' );

      expect( response.statusCode ).toBe( 200 );
      expect( response.body.posts.length ).toBeLessThanOrEqual( 10 );

    } );

    test( 'returns posts that match the search query', async()=>{

      const response = await request( app ).get( '/v1/post/?search=assword1@' );

      expect( response.statusCode ).toBe( 200 );
      expect( response.body.posts ).toContainEqual( { content: 'liaona@gmail.com', created_at: '2023-09-02T02:30:31.766Z', id: 'post-2d9aa5e7-3e37-4116-a4da-b852fbf16805', title: 'assword1@', updated_at: '2023-09-02T02:30:31.766Z' } );


    } );

  } );

  describe( 'GET v1/post/:postId', ()=>{

    test( 'returns a post and content', async()=>{

      const response = await request( app )
        .get( '/v1/post/post-4bcd818d-bc9c-4a80-9771-4eeb0b48ba57' )
        .set( 'Authorization', `Bearer ${ validAccessToken }` );

      expect( response.statusCode ).toBe( 201 );
      // Add your assertions for the response body here
      expect( response.body.title ).toBe( 'Tempting' );
      expect( response.body.content ).toBe( 'inversion ' );
      expect( response.body.created_at ).toBe( '2023-09-02T13:47:59.852Z' );
      expect( response.body.updated_at ).toBe( '2023-09-02T13:47:59.852Z' );

    } );

  } );

  describe( 'POST v1/post/create', ()=>{

    test( 'adds a new post to the database', async()=>{

      // Initialize the postRepository
      const postRepository = getConnection().getRepository( Post );

      const response = await request( app )
        .post( '/v1/post/create' )
        .set( 'Authorization', `Bearer ${ validAccessToken }` )
        .send( { title: 'Tempting', content: 'inversion ' } );

      expect( response.statusCode ).toBe( 201 );

      // Ensure the post was actually created in the database
      const createdPost = await postRepository.findOne( { title: 'Tempting' } );

      expect( createdPost ).not.toBeNull();

    } );

  } );

} );
