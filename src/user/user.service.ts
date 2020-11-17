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
export const getUserByPhone = async (
  phone: string,
  options: GetUserOptions = {},
) => {
  const { password } = options;
  const statement = `
    SELECT id,
    phone
    ${password ? ', password' : ''}
    FROM user
    WHERE phone=?
  `;
  const [data] = await connection.promise().query(statement, phone);
  return data[0];
};
