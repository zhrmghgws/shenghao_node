import { Request, Response, NextFunction } from 'express';
import * as commentService from './comment.service';

/**
 *  发表评论
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { id: userId } = request.user;
  const { content, postId } = request.body;
  const comment = {
    content,
    postId,
    userId,
  };
  try {
    const data = await commentService.createComment(comment);
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 *  回复评论
 */
export const reply = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { commentId } = request.params;
  const parentId = parseInt(commentId, 10);

  const { id: userId } = request.user;
  const { content, postId } = request.body;
  const comment = {
    content,
    postId,
    userId,
    parentId,
  };
  try {
    const isReply = await commentService.isReplayComment(parentId);
    if (isReply) next(new Error('UNABLE_TO_REPLE_THIS_COMMENT'));
  } catch (error) {
    next(error);
  }
  try {
    const data = await commentService.createComment(comment);
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 *  修改评论
 */
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { commentId } = request.params;
  const { content } = request.body;
  const comment = {
    id: parseInt(commentId, 10),
    content,
  };
  try {
    const data = await commentService.updateComment(comment);
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 *  删除评论
 */
export const destroy = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { commentId } = request.params;

  try {
    const data = await commentService.deleteComment(parseInt(commentId, 10));
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 *  评论列表
 */
export const index = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const totalCount = await commentService.getCommentsTotalCount({
      filter: request.filter,
    });
    response.header('X-Total-Count', totalCount);
  } catch (error) {
    next(error);
  }

  try {
    const comments = await commentService.getComments({
      filter: request.filter,
      pagination: request.pagination,
    });
    response.send(comments);
  } catch (error) {
    next(error);
  }
};

/**
 *  获取评论的回复列表
 */
export const indexReplies = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { commentId } = request.params;
  try {
    const replies = await commentService.getCommentReplies({
      commentId: parseInt(commentId, 10),
    });
    response.send(replies);
  } catch (error) {
    next(error);
  }
};
