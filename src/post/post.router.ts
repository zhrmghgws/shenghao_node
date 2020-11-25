import express from 'express';
import * as postController from './post.controller';
import { requestUrl } from '../app/app.middleware';
import { authGuard, accessControl } from '../auth/auth.middleware';
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
router.post('/posts', requestUrl, authGuard, postController.store);

/**
 * 更新内容
 */
router.patch(
  '/posts/:postId',
  authGuard,
  accessControl({ possession: true }),
  postController.updataPost,
);

/**
 * 删除内容
 */
router.delete(
  '/posts/:postId',
  authGuard,
  accessControl({ possession: true }),
  postController.deletePost,
);

router.post(
  '/posts/:postId/tag',
  authGuard,
  accessControl({ possession: true }),
  postController.storePostTag,
);

router.delete(
  '/posts/:postId/tag',
  authGuard,
  accessControl({ possession: true }),
  postController.destroyPostTag,
);

export default router;
