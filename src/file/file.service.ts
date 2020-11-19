import { FileModel } from './file.model';
import { connection } from '../app/database/mysql';

/**
 *  存储文件信息
 */
export const createFile = async (file: FileModel) => {
  const statement = `
    INSERT INTO file
    SET ?
  `;
  const [data] = await connection.promise().query(statement, file);
  return data;
};

/**
 *  按id查找文件
 */
export const findFileById = async (fileId: number) => {
  const statement = `
    SELECT * FROM file
    WHERE id = ?
  `;
  const [data] = await connection.promise().query(statement, fileId);
  return data[0];
};
