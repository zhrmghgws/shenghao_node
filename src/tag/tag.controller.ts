import { Request, Response, NextFunction } from 'express';
import * as tagServcie from './tag.service';

/**
 *  创建标签
 */
export const createTag = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { name } = request.body;
  try {
    const tag = await tagServcie.getTagByName(name);
    if (tag) throw new Error('TAG_ALREADY_EXISTS');
    const data = await tagServcie.createTag({ name });
    response.send(data);
  } catch (error) {
    next(error);
  }
};
