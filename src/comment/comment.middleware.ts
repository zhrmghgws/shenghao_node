import { Request, Response, NextFunction } from 'express';

/**
 *  评论过滤器
 */
export const filter = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { post, user, action } = request.query;

  request.filter = {
    name: 'default',
    sql: 'comment.parentId IS NULL',
  };
  if (post && !user && !action) {
    request.filter = {
      name: 'postComments',
      sql: 'comment.parentId IS NULL AND comment.postId=?',
      param: post as string,
    };
  }
  if (user && action == 'published' && !post) {
    request.filter = {
      name: 'userPublished',
      sql: 'comment.parentId is null and comment.userId=?',
      param: user as string,
    };
  }
  if (user && action == 'replied' && !post) {
    request.filter = {
      name: 'userReplied',
      sql: 'comment.parentId is not null and comment.userId=?',
      param: user as string,
    };
  }

  next();
};
