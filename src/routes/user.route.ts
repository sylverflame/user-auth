import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
} from "../controllers/user.controller";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.post("/", createUser);
router.delete("/:id", deleteUser);

export default router;
