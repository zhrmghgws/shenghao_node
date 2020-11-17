import { Request, Response, NextFunction } from 'express';
import { ResponseModle } from '../app/Response.Model';
import * as userService from './user.service';
import _ from 'lodash';

export const sendPhoneCode = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { phone } = request.body;
  console.log(`发送验证码成功::::::${phone}`);
  try {
    var responseModel = new ResponseModle();
    responseModel.code = 200;
    responseModel.message = 'succese';
    responseModel.data = { sendOk: 1 };
  } catch (error) {
    next(error);
  }

  response.send(responseModel);
};

export const verifyCode = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { phone } = request.body;
  var responseModel = new ResponseModle();
  responseModel.code = 200;
  responseModel.message = 'succese';
  const data = await userService.getUserByPhone(phone);
  if (data) {
    responseModel.data = { isExist: 1 };
  } else {
    responseModel.data = { isExist: 0 };
    await userService.creatUserService({
      name: phone,
      phone: phone,
      password: '',
    });
  }
  response.send(responseModel);
};

export const updataUser = async (
  request: Request,
  responst: Response,
  next: NextFunction,
) => {
  const user = _.pick(request.body, ['phone', 'password']);
  try {
    const data = await userService.upDataUserService(user);
    responst.send(data);
  } catch (error) {
    next(error);
  }
};
