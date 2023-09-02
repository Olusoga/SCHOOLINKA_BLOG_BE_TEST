/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable valid-jsdoc */
import 'source-map-support/register';
import './module-alias';

import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

// This needs to be imported before everything else.

import { logger } from 'src/libs/logger';
import { createApp } from 'src/app';
import gracefulShutdown from 'http-graceful-shutdown';

/**
 * Helper function to log an exit code before exiting the process.
 */
const logAndExitProcess = ( exitCode: number )=>{

  logger.info(
    {
      exit_code_number: exitCode
    },
    'Exiting process'
  );
  // eslint-disable-next-line no-process-exit
  process.exit( exitCode );

};

/**
 * Sets up event listeners on unexpected errors and warnings. These should theoretically
 * never happen. If they do, we assume that the app is in a bad state. For errors, we
 * exit the process with code 1.
 */
const setupProcessEventListeners = ()=>{

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  process.on( 'unhandledRejection', ( reason: any )=>{

    logger.warn( { reason_object: reason }, 'encountered unhandled rejection' );
    logAndExitProcess( 1 );

  } );

  process.on( 'uncaughtException', ( err: Error )=>{

    logger.error( err, 'encountered uncaught exception' );
    logAndExitProcess( 1 );

  } );

  process.on( 'warning', ( warning: Error )=>{

    logger.warn(
      {
        warning_object: warning
      },
      'encountered warning'
    );

  } );

};

/**
 * Start an Express server and installs signal handlers on the
 * process for graceful shutdown.
 */
( async()=>{

  try{

    const app = await createApp();

    const server = app.listen( app.get( 'port' ), ()=>{

      console.log( {
        port_number: app.get( 'port' ),
        env_string:  app.get( 'env' )
      } );

      logger.info(
        {
          port_number: app.get( 'port' ),
          env_string:  app.get( 'env' )
        },
        'Started express server'
      );

    } );

    gracefulShutdown( server );
    setupProcessEventListeners();

  } catch( err ){

    logger.error( err, 'error caught in server.ts' );

  }

} )();
