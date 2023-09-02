/* eslint-disable linebreak-style */
import * as jwt from 'jsonwebtoken';


export const validAccessToken  = jwt.sign(
  {
    _id:   'eu-fd2b8177-0d3b-4f6b-a246-05233ca6a06d',
    email: 'olusgaolamileksy@gmail.com',
  },
  // eslint-disable-next-line no-process-env
  process.env.JWT_TOKEN_SECRET,
  {
    expiresIn: 8640000
  }
);


