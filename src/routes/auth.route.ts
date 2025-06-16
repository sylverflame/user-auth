import { Router } from "express";
import { loginUser } from "../controllers/login.controller";
import { registerUser } from "../controllers/user.controller";
import { authenticateUser } from "../middlewares/auth.middleware";
const authRouter = Router();

authRouter.post("/login", authenticateUser, loginUser);
authRouter.post("/register", registerUser);

export default authRouter;
