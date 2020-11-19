import { Request, Response, NextFunction } from 'express';
import * as userService from '../user/user.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PUBLIC_KEY } from '../app/app.config';
import { TokenPayload } from './auth.interface';
import { possess } from './auth.service';

export const authGuard = (
  request: Request,
  resoponse: Response,
  next: NextFunction,
) => {
  console.log('验证用户身份');
  try {
    const authorization = request.header('Authorization');
    if (!authorization) throw new Error();

    const token = authorization.replace('Bearer ', '');
    if (!token) throw new Error();

    const decoded = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256'],
    });

    request.user = decoded as TokenPayload;
    console.log('用户身份验证成功');
    next();
  } catch (error) {
    next(new Error('UNAUTHORIZED'));
  }
};

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
  request.body.user = user;

  next();
};

interface AccessControlOptions {
  possession?: boolean;
}
export const accessControl = (options: AccessControlOptions) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    console.log('验证用户访问权');
    const { possession } = options;
    //这个中间件要放在authGuard的后面，因为要使用user
    const { id: userId } = request.user;
    //放行管理员
    if (userId == 1) return next();
    //准备资源

    const resourceIdParam = Object.keys(request.params)[0];
    console.log(`resourceIdParam:::${resourceIdParam}`);
    const resourceType = resourceIdParam.replace('Id', '');
    console.log(`resourceType:::${resourceType}`);
    const resourceId = parseInt(request.params[resourceIdParam], 10);
    console.log(`resourceId:::${resourceId}`);

    if (possession) {
      try {
        const ownResource = await possess({ resourceId, resourceType, userId });
        if (!ownResource) {
          return next(new Error('USER_DOES_NOT_OWN_RESOURCE'));
        }
      } catch (error) {
        return next(error);
      }
    }
    console.log('用户拥有访问权');
    next();
  };
};
