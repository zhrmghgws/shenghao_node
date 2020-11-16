import express from 'express';
import * as postController from './post.controller';
import { requestUrl } from '../app/app.middleware';
const router = express.Router();

/**
 * 测试
 */
router.get('/', postController.index);

/**
 * 内容列表
 */
router.get('/posts', requestUrl, postController.posts);

/**
 * 创建内容
 */
router.post('/posts', requestUrl, postController.store);

/**
 * 更新内容
 */
router.patch('/posts/:postId', postController.updataPost);

/**
 * 删除内容
 */
router.delete('/posts/:postId', postController.deletePost);

export default router;
