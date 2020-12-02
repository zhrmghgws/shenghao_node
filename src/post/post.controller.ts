import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import {
  createPost,
  deletePostService,
  getPosts,
  updataPostService,
  createPostTag,
  postHasTag,
  deletePostTag,
  getPostsTotalCount,
  getPostById,
} from './post.service';
import { TagModel } from '../tag/tag.model';
import { getTagByName, createTag } from '../tag/tag.service';

export const index = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  response.send('你好！');
};

/**
 * 获取内容列表
 * @param request
 * @param response
 * @param next
 */
export const posts = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const totalCount = await getPostsTotalCount({ filter: request.filter });
    response.header('X-Total-Count', totalCount);
  } catch (error) {
    next(error);
  }
  try {
    const data = await getPosts({
      sort: request.sort,
      filter: request.filter,
      pagination: request.pagination,
    });
    response.send(JSON.stringify(data));
  } catch (error) {
    next(error);
  }
};

/**
 * 创建内容
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { title, content } = request.body;
  const { id: userId } = request.user;
  try {
    const data = await createPost({ title, content, userId });
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新内容
 */
export const updataPost = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { postId } = request.params;
  //const {title,content}=request.body,使用此方法，
  //如果请求中只有title那么会覆盖数据库中的content,如果请求中只有content那么会报错，提示必须要有title
  //使用lodash的pick方法上面的方法，body里如果只有title属性就只会提取title属性
  //只有content属性就只会提取content属性,可以单独的更新某一个属性
  const post = _.pick(request.body, ['title', 'content']);
  try {
    const data = await updataPostService(parseInt(postId, 10), post);
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除内容
 */
export const deletePost = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { postId } = request.params;
  try {
    const data = await deletePostService(parseInt(postId, 10));
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 *  保存内容标签
 */
export const storePostTag = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { postId } = request.params;
  const { name } = request.body;
  let tag: TagModel;

  try {
    tag = await getTagByName(name);
  } catch (error) {
    return next(error);
  }
  if (tag) {
    try {
      const postTag = await postHasTag(parseInt(postId), tag.id);
      if (postTag) return next(new Error('POST_ALREADY_HAS_THIS_TAG'));
    } catch (error) {
      return next(error);
    }
  }
  if (!tag) {
    try {
      const data = await createTag({ name });
      tag = { id: data.insertId };
    } catch (error) {
      return next(error);
    }
  }

  try {
    await createPostTag(parseInt(postId, 10), tag.id);
    response.sendStatus(201);
  } catch (error) {
    next(error);
  }
};
/**
 *  移除内容标签
 */
export const destroyPostTag = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { postId } = request.params;
  const { tagId } = request.body;
  try {
    const data = await deletePostTag(parseInt(postId, 10), tagId);
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 *  单个内容
 */
export const show = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { postId } = request.params;
  try {
    const post = await getPostById(parseInt(postId, 10));
    response.send(post);
  } catch (error) {
    next(error);
  }
};
