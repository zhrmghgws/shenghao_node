import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { createFile, findFileById } from './file.service';

/**
 *  上传文件
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //mutler框架的中间件会在request中添加file属性，文件相关的信息都在这里面
  const { id: userId } = request.user;
  const { post } = request.query;
  const postId = parseInt(post as string);
  const fileInfo = _.pick(request.file, [
    'originalname',
    'mimetype',
    'filename',
    'size',
  ]);
  try {
    const data = await createFile({
      ...fileInfo,
      userId,
      postId,
    });
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 *  文件服务
 */
export const serve = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { fileId } = request.params;
  try {
    const file = await findFileById(parseInt(fileId, 10));
    response.sendFile(file.filename, {
      root: 'uploads',
      headers: {
        'Content-Type': file.mimetype,
      },
    });
  } catch (error) {
    next(error);
  }
};
