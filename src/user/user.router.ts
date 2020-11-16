import express from 'express';
import * as userController from './user.controller';
import { validateUserData, hashPassword } from './user.middleware';

const router = express.Router();

router.post(
  '/users',
  validateUserData,
  hashPassword,
  userController.createUser,
);

export default router;
