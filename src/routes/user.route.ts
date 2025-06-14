import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
} from "../controllers/user.controller";
import { validateToken } from "../controllers/login.controller";

const router = Router();

router.get("/", validateToken, getAllUsers);
router.get("/:id", validateToken, getUser);
router.post("/", createUser);
router.delete("/:id", validateToken, deleteUser);

export default router;
