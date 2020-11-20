import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import Jimp from 'jimp';
import { imageResizer } from './file.service';

/**
 * 创建一个Multer
 */
const fileUpload = multer({
  dest: 'uploads/',
});

/**
 * 文件拦截器
 */
export const fileInterceptor = fileUpload.single('file');

/**
 *  文件处理器
 */
export const fileProcessor = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //这个中间件要放在fileInterceptor之后使用，才能获取到文件信息
  const { path } = request.file;
  let image: Jimp;
  try {
    image = await Jimp.read(path);
  } catch (error) {
    return next(error);
  }
  const { imageSize, tags } = image['_exif'];

  request.fileMetaData = {
    width: imageSize.width,
    height: imageSize.height,
    metadata: JSON.stringify(tags),
  };

  imageResizer(image, request.file);

  next();
};
