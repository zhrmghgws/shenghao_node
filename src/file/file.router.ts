import express from 'express';
import { authGuard } from '../auth/auth.middleware';
import * as fileController from './file.controller';
import { fileInterceptor } from './file.middleware';

const router = express.Router();

router.post('/files', authGuard, fileInterceptor, fileController.store);
router.get('/files/:fileId/serve', fileController.serve);
export default router;
