import { Request, Response, NextFunction } from 'express';
import { getPosts } from './post.service';
export const index = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  response.send('你好！');
};

export const posts = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (request.headers.authorization !== 'SERRET') {
    return next(new Error());
  }

  const data = getPosts();
  response.send(JSON.stringify(data));
};
