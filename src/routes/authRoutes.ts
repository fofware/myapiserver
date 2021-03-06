import { Router } from "express";
import { signUp, signIn } from "../controlers/userController";

const router = Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
export default router;