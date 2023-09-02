/* eslint-disable linebreak-style */
import { Request, Response, NextFunction } from 'express';
import { createPostSchema,  userRegistrationSchema, userLoginSchema  } from 'src/schemas/validationSchema';


export const validateUserRegistration = ( req: Request, res: Response, next: NextFunction )=>{

  const { error } = userRegistrationSchema.validate( req.body );

  if( error ){

    return res.status( 400 ).json( { error: error.details[ 0 ].message } );

  }
  next();

};

export const validateUserLogin = ( req: Request, res: Response, next: NextFunction )=>{

  const { error } = userLoginSchema.validate( req.body );

  if( error ){

    return res.status( 400 ).json( { error: error.details[ 0 ].message } );

  }

  next();

};

export const validateCreatePost = ( req: Request, res: Response, next: NextFunction )=>{

  const { error } = createPostSchema.validate( req.body );
  if( error ){

    return res.status( 400 ).json( { error: error.details[ 0 ].message } );

  }
  next();

};
