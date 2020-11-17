import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';

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
