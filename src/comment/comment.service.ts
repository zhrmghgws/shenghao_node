import {
  GetPostsOptionsFilter,
  GetpostsOptionsPagination,
} from 'src/post/post.service';
import { connection } from '../app/database/mysql';
import { CommentModel } from './comment.model';
import { sqlFragment } from './comment.provider';

/**
 *  创建评论
 */
export const createComment = async (comment: CommentModel) => {
  const statement = `
    INSERT INTO comment
    SET ?
  `;
  const [data] = await connection.promise().query(statement, comment);
  return data;
};

/**
 *  检查评论是否为回复评论
 */
export const isReplayComment = async (commentId: number) => {
  const statement = `
    SELECT parentId FROM comment
    WHERE id=?
  `;
  const [data] = await connection.promise().query(statement, commentId);
  return data[0].parentId ? true : false;
};
/**
 *  修改评论//会报错，提示sql语句不对
 */
export const updateComment = async (comment: CommentModel) => {
  const { id, content } = comment;
  const statement = `
    UPDATE comment
    SET content=？
    WHERE id=？
  `;
  const [data] = await connection.promise().query(statement, [content, id]);
  return data;
};

/**
 *  删除评论//会报错，提示有外键无法删除
 */
export const deleteComment = async (commentId: number) => {
  const statement = `
    DELETE FROM comment
    WHERE id =?
  `;
  const [data] = await connection.promise().query(statement, commentId);
  return data;
};

/**
 *  获取评论列表
 */
interface GetCommentOptions {
  filter?: GetPostsOptionsFilter;
  pagination?: GetpostsOptionsPagination;
}
export const getComments = async (options: GetCommentOptions) => {
  const {
    filter,
    pagination: { limit, offset },
  } = options;
  let params: Array<any> = [limit, offset];
  if (filter.param) {
    params = [filter.param, ...params];
  }
  const statement = `
    SELECT 
      comment.id,
      comment.content,
      ${sqlFragment.user},
      ${sqlFragment.post}
      ${filter.name == 'userReplied' ? `,${sqlFragment.repliedComment}` : ''}
      ${filter.name !== 'userReplied' ? `,${sqlFragment.totalReplies}` : ''}
    FROM
      comment
    ${sqlFragment.leftJoinPost}
    ${sqlFragment.leftJoinUser}
    WHERE ${filter.sql}
    GROUP BY
      comment.id
    ORDER BY
    comment.id DESC
    limit ?
    offset ?
  `;
  const [data] = await connection.promise().query(statement, params);

  return data;
};

/**
 *  统计评论总数
 */
export const getCommentsTotalCount = async (options: GetCommentOptions) => {
  const { filter } = options;
  let params: Array<any> = [];
  if (filter.param) {
    params = [filter.param, ...params];
  }
  const statement = `
    select count(
      distinct comment.id
    ) as total
    from comment
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.leftJoinPost}
    where ${filter.sql}
  `;
  const [data] = await connection.promise().query(statement, params);
  return data[0].total;
};

/**
 *  评论回复列表
 */
interface GetCommentRepliesOptions {
  commentId: number;
}
export const getCommentReplies = async (options: GetCommentRepliesOptions) => {
  const { commentId } = options;
  const statement = `
    select comment.id,comment.content,${sqlFragment.user}
    from comment 
    ${sqlFragment.leftJoinUser}
    where comment.parentId=?
    group by comment.id
  `;
  const [data] = await connection.promise().query(statement, commentId);
  return data;
};
