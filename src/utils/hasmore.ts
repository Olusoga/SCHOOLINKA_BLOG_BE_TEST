/* eslint-disable linebreak-style */
export const hasNextPage = ( queryparams: any, count:number )=>{

  const { from = 0, limit = 10, } = queryparams;

  return from + limit < count;

};
