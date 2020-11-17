import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import * as userService from '../user/user.service';
import bcrypt from 'bcrypt';

export const validateLoginData = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log('验证用户登录数据');

  const { phone, password } = request.body;
  if (!phone) return next(new Error('PHONE_IS_REQUIRED'));
  if (!password) return next(new Error('PASSWORD_IS_REQUIRED'));

  const user = await userService.getUserByPhone(phone, { password: true });
  if (!user) return next(new Error('USER_DOES_NOT_EXIST'));
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) return next(new Error('PASSWORD_DOES_NOT_MATCH'));
  next();
};
