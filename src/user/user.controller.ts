import { Request, Response, NextFunction } from 'express';
import { UserModel } from './user.model';
import * as userService from './user.service';

export const createUser = async (
  request: Request,
  responst: Response,
  next: NextFunction,
) => {
  const { name, password } = request.body;
  try {
    const data = await userService.creatUserService({ name, password });
    responst.status(201).send(data);
  } catch (error) {
    next(error);
  }
};
