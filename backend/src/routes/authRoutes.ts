import { Router } from 'express';
import { loginWithWallet } from '../controllers/authController';

const router = Router();

// Ensure loginWithWallet is treated as an Express middleware
router.post('/login', loginWithWallet);

export default router;