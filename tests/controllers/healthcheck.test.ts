/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
import supertest from 'supertest';
import { getConnection } from 'typeorm';

import { createApp } from 'src/app';

describe( 'Healthcheck Integration tests', ()=>{

  let server: Express.Application;

  beforeAll( async()=>{

    server = await createApp();

  } );

  afterAll( async()=>{

    await getConnection().close();

  } );

  describe( '/healthcheck/liveness', ()=>{

    it( 'returns 200', async()=>{

      const response = await supertest( server ).get( '/healthcheck/liveness' );

      expect( response.status ).toBe( 200 );

    } );

  } );

  describe( '/healthcheck/readiness', ()=>{

    it( 'returns 200', async()=>{

      const response = await supertest( server ).get( '/healthcheck/readiness' );

      expect( response.status ).toBe( 200 );

    } );

  } );

  describe( '/healthcheck/donotexist', ()=>{

    it( 'returns 404', async()=>{

      const response = await supertest( server ).get( '/healthcheck/donotexist' );

      expect( response.status ).toBe( 404 );

    } );

  } );

} );
