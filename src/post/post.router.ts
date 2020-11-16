import express from 'express';
import * as postController from './post.controller';
import { requestUrl } from '../app/app.middleware';
const router = express.Router();

/**
 * 内容列表
 */
router.get('/posts', requestUrl, postController.posts);
router.get('/', postController.index);

export default router;
