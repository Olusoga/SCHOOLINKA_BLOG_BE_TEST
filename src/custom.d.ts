/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace 'any' with the actual user data type
    }
  }
}
