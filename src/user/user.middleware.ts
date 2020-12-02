import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import * as userService from './user.service';

export const verifyCode = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { code } = request.body;
  if (!code) {
    return next(new Error('CODE_IS_REQUIRED'));
  }
  if (String(code).length !== 6) {
    return next(new Error('CODE_FORMAT_IS_NOT_CORRECT'));
  }
  if (String(code) !== '888888') {
    console.log(`code:::${code}`);
    return next(new Error('CODE_IS_NOT_CORRECT'));
  }
  next();
};

export const verifyPhone = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { phone } = request.body;
  if (!phone) return new Error('PHONE_IS_REQUIRED');
  if (String(phone).length !== 11)
    return new Error('PHONE_FORMAT_IS_NOT_CORRECT');
  next();
};

/**
 * HASH 密码
 */
export const hashPassword = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { password } = request.body;
  if (!password) return next(new Error('PASSWORD_IS_REQUIRED'));
  request.body.password = await bcrypt.hash(password, 10);
  next();
};

/**
 *  验证更新用户数据
 */
export const validateUpdateUserData = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { validate, update } = request.body;
  const { id: userId } = request.user;
  try {
    if (!_.has(validate, 'password')) {
      return next(new Error('PASSWORD_IS_REQUIRED'));
    }
    const user = await userService.getUserById(userId, { password: true });
    const matched = await bcrypt.compare(validate.password, user.password);
    if (!matched) {
      return next(new Error('PASSWORD_DOES_NOT_MATCH'));
    }
    if (update.name) {
      const userbyname = await userService.getUserByName(update.name);
      if (userbyname) {
        return next(new Error('USER_NAME_ALREADY_EXIST'));
      }
    }
    if (update.password) {
      const pwdmatched = await bcrypt.compare(update.password, user.password);
      if (pwdmatched) {
        return next(new Error('PASSWORD_ID_THE_SAME'));
      }
      request.body.update.password = await bcrypt.hash(update.password, 10);
    }
  } catch (error) {
    return next(error);
  }
  next();
};
