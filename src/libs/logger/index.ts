/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-var-requires */
const winston = require( 'winston' );

import { IS_TEST } from 'src/configs/app';

const createLogger = ( level: string )=>{

  const transports = [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File( { filename: 'error.log', level: 'error' } ),
    new winston.transports.File( { filename: 'combined.log' } )
  ];

  const logger = winston.createLogger( {
    level,
    format:      winston.format.json(),
    transports,
    exitOnError: false
  } );

  logger.add(
    new winston.transports.Console( {
      format: winston.format.simple()
    } )
  );
  logger.stream = {
    write( message: string ){

      // use the 'info' log level so the output will be picked up by both transports (file and console)
      logger.info( `${ new Date() } - ${ message }` );

    }
  };

  return logger;

};

export const logger = createLogger( IS_TEST ? 'silent' : 'info' );
