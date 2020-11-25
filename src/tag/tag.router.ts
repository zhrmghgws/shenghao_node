import express from 'express';
import * as tagController from './tag.controller';
import { authGuard } from '../auth/auth.middleware';

const router = express.Router();
router.post('/tags', authGuard, tagController.createTag);

export default router;
