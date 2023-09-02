/* eslint-disable linebreak-style */
import Joi from 'joi';

export const isValidEmail = ( email: string ): boolean=>{

  try{

    Joi.assert( email, Joi.string().email() );
    return true;

  } catch( error ){

    return false;

  }

};
