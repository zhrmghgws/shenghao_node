import express from 'express';
import { authGuard } from '../auth/auth.middleware';
import * as likeController from './like.controller';

const router = express.Router();
router.post('/posts/:postId/like', authGuard, likeController.storeUserLikePost);
router.delete(
  '/posts/:postId/like',
  authGuard,
  likeController.cancleUserLikePost,
);
export default router;
