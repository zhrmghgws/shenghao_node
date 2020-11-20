import { Request, Response, NextFunction } from 'express';

/**
 * 输出请求地址
 */
export const requestUrl = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log(request.url);
  next();
};

/**
 * 默认的异常处理器
 */
export const defaultErrorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (error.message) {
    console.log('服务错误信息：', error.message);
  }
  console.log(`message:::${error.message}`);
  let statusCode: number, message: String;
  switch (error.message) {
    case 'PHONE_IS_REQUIRED':
      statusCode = 400;
      message = '手机号不能为空';
      break;
    case 'PHONE_FORMAT_IS_NOT_CORRECT':
      statusCode = 400;
      message = '手机号码格式不正确';
      break;
    case 'CODE_IS_REQUIRED':
      statusCode = 400;
      message = '验证码不能为空';
      break;
    case 'CODE_FORMAT_IS_NOT_CORRECT':
      statusCode = 400;
      message = '验证码格式不正确';
      break;
    case 'CODE_IS_NOT_CORRECT':
      console.log('code不正确');
      statusCode = 400;
      message = '验证码不正确';
      break;
    case 'PASSWORD_IS_REQUIRED':
      statusCode = 400;
      message = '密码不能为空';
      break;
    case 'USER_ALREADY_EXIST':
      statusCode = 400;
      message = '用户名已存在';
      break;
    case 'USER_DOES_NOT_EXIST':
      statusCode = 400;
      message = '用户不存在';
      break;
    case 'PASSWORD_DOES_NOT_MATCH':
      statusCode = 400;
      message = '密码不正确';
      break;
    case 'UNAUTHORIZED':
      statusCode = 401;
      message = '请先登录';
      break;
    case 'USER_DOES_NOT_OWN_RESOURCE':
      statusCode = 400;
      message = '您不能处理这个内容';
      break;
    case 'FILE_NOT_FOUND':
      statusCode = 400;
      message = '文件不存在';
      break;
    default:
      statusCode = 500;
      message = '服务暂时出了点问题';
      break;
  }
  response.status(statusCode).send({ message });
};
