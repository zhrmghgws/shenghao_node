import { signToken } from './auth.service';
import { Request, Response, NextFunction } from 'express';

export const login = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const {
    user: { id, phone },
  } = request.body;
  const payload = { id, phone };
  try {
    const token = signToken({ payload });
    response.send({ id, phone, token });
  } catch (error) {
    next(error);
  }
};

/**
 * 验证登录
 */
export const validate = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log(request.user);
  response.sendStatus(200);
};
