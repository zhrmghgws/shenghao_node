import { connection } from '../app/database/mysql';
import { UserModel } from './user.model';

export const upDataUserService = async (user: UserModel) => {
  const statement = `
    UPDATE user
    SET ?
    WHERE phone=?
  `;
  const [data] = await connection
    .promise()
    .query(statement, [user, user.phone]);
  return data;
};

/**
 * 创建用户
 */
export const creatUserService = async (user: UserModel) => {
  const statement = `
    INSERT INTO user
    SET ?
  `;
  const [data] = await connection.promise().query(statement, user);
  return data;
};

interface GetUserOptions {
  password?: boolean;
}

/**
 * 按用户名查找用户
 */
export const getUser = (condition: string) => {
  return async (param: string | number, options: GetUserOptions = {}) => {
    const { password } = options;
    const statement = `
    SELECT user.id,
    user.name,
    user.phone,
    if(
      count(avatar.id),1,null
    ) as avatar
    ${password ? ', password' : ''}
    FROM user
    left join avatar on avatar.userId=user.id
    where ${condition}=?
  `;
    const [data] = await connection.promise().query(statement, param);
    return data[0].id ? data[0] : null;
  };
};

/**
 *  按手机号获取用户
 */
export const getUserByName = getUser('user.name');
/**
 * 按用户id获取用户数据
 */
export const getUserById = getUser('user.id');
export const getUserByPhone = getUser('user.phone');

/**
 *  更新用户数据
 */
export const updateUser = async (userId: number, userData: UserModel) => {
  const statement = `
    update user 
    set ?
    where user.id = ?
  `;
  const params = [userData, userId];
  const [data] = await connection.promise().query(statement, params);
  return data;
};
