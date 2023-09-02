/* eslint-disable linebreak-style */
import Joi from 'joi';

export const userRegistrationSchema = Joi.object( {
  email: Joi.string()
    .email( { tlds: { allow: false } } ) // disallow top-level domains in email
    .required()
    .description( 'Email address for registration' )
    .example( 'foobar@example.com' ),
  username: Joi.string()
    .required()
    .description( 'Unique identifier for the user' )
    .example( 'username' ),
  password: Joi.string()
    .required()
    .description( 'Secret key for authentication that users must supply' )
    .example( 'password' ),
} ).label( 'User Registration' );

export const userLoginSchema = Joi.object( {
  email: Joi.string()
    .email( { tlds: { allow: false } } ) // disallow top-level domains in email
    .required()
    .description( 'Email address for login' )
    .example( 'foobar@example.com' ),
  password: Joi.string()
    .required()
    .description( 'Secret key for authentication that users must supply' )
    .example( 'password' ),
} ).label( 'User Login' );

export const createPostSchema = Joi.object( {
  title:   Joi.string().min( 3 ).max( 255 ).required(),
  content: Joi.string().min( 10 ).required(),
} );
