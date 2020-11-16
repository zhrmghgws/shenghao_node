import { connection } from '../app/database/mysql';
import { PostModel } from './post.model';
/**
 * 获取内容列表
 */
export const getPosts = async () => {
  const statement = `
  SELECT 
  post.id,
  post.title,
  post.content,
  JSON_OBJECT(
    'id',user.id,
    'name',user.name
  ) as user
  FROM post
  LEFT JOIN user
    ON user.id =post.userId
  `;
  const [data] = await connection.promise().query(statement);
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
