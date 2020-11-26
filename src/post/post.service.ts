import { sqlFragment } from '../user/user.provider';
import { connection } from '../app/database/mysql';
import { PostModel } from './post.model';

/**
 *  统计内容数量
 */
export const getPostsTotalCount = async (options: GetPostsOptions) => {
  const { filter } = options;
  let params = [filter.param];
  const statement = `
    SELECT COUNT(DISTINCT post.id) AS total
    FROM post
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.leftJoinOneFile}
    ${sqlFragment.leftJoinTag}
    WHERE ${filter.sql}
  `;
  const [data] = await connection.promise().query(statement, params);
  return data[0].total;
};
/**
 * 获取内容列表
 */
export interface GetpostsOptionsPagination {
  limit: number;
  offset: number;
}

export interface GetPostsOptionsFilter {
  name: string;
  sql?: string;
  param?: string;
}

interface GetPostsOptions {
  sort?: string;
  filter: GetPostsOptionsFilter;
  pagination?: GetpostsOptionsPagination;
}

export const getPosts = async (options: GetPostsOptions) => {
  const {
    sort,
    filter,
    pagination: { limit, offset },
  } = options;
  let params: Array<any> = [limit, offset];
  if (filter.param) {
    params = [filter.param, ...params];
  }

  const statement = `
  SELECT 
  post.id,
  post.title,
  post.content,
  ${sqlFragment.user},
  ${sqlFragment.totalComments},
  ${sqlFragment.file},
  ${sqlFragment.tags}
  FROM post
  ${sqlFragment.leftJoinUser}
  ${sqlFragment.leftJoinOneFile}
  ${sqlFragment.leftJoinTag}
  WHERE ${filter.sql}
  GROUP BY post.id 
  ORDER BY ${sort}
  LIMIT ?
  OFFSET ?
  `;
  const [data] = await connection.promise().query(statement, params);
  return data;
};

/**
 * 创建内容
 */

export const createPost = async (post: PostModel) => {
  const statement = `
      INSERT INTO post
      SET ?
   `;
  const [data] = await connection.promise().query(statement, post);
  return data;
};

/**
 * 更新内容
 */
export const updataPostService = async (postId: number, post: PostModel) => {
  const statement = `
    UPDATE post
    SET ?
    WHERE id=?
  `;
  const [data] = await connection.promise().query(statement, [post, postId]);
  return data;
};

/**
 * 删除内容
 */
export const deletePostService = async (postId: number) => {
  const statement = `
    DELETE FROM post
    WHERE id=?
  `;
  const [data] = await connection.promise().query(statement, postId);
  return data;
};

/**
 *  保存内容标签
 */
export const createPostTag = async (postId: number, tagId: number) => {
  const statement = `
    INSERT INTO post_tag (postId,tagId)
      VALUES(?,?)
  `;
  const [data] = await connection.promise().query(statement, [postId, tagId]);
  return data;
};

/**
 *  检测内容标签
 */
export const postHasTag = async (postId: number, tagId: number) => {
  const statement = `
    SELECT * FROM post_tag
    WHERE postId=? AND tagId=?
  `;
  const [data] = await connection.promise().query(statement, [postId, tagId]);
  return data[0] ? true : false;
};

/**
 *  删除内容标签
 */
export const deletePostTag = async (postId: number, tagId: number) => {
  const statement = `
    DELETE FROM post_tag
    WHERE postId =? AND tagId=?
  `;
  const [data] = await connection.promise().query(statement, [postId, tagId]);
  return data;
};
