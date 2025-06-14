import { Router } from "express";
import { authenticateUser, loginUser } from "../controllers/login.controller";
const loginRouter = Router();

loginRouter.post("/", authenticateUser, loginUser);

export default loginRouter;
