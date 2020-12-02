import express from 'express';
import { authGuard } from '../auth/auth.middleware';
import * as userController from './user.controller';
import { hashPassword } from './user.middleware';
import {
  verifyPhone,
  verifyCode,
  validateUpdateUserData,
} from './user.middleware';

const router = express.Router();

router.post('/users/phone/sendCode', verifyPhone, userController.sendPhoneCode);

router.post('/users/phone/verifyCode', verifyCode, userController.verifyCode);

/**
 * 创建账号
 */
router.post('/users/setPwd', hashPassword, userController.updataUser);
router.get('/users/:userId', userController.show);
router.patch(
  '/users',
  authGuard,
  validateUpdateUserData,
  userController.update,
);
export default router;
