import { json, Router } from "express";
import {
  createUser,
  getAllUsers,
  getUser,
} from "../controllers/userController";

const router = Router();
router.use(json());

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.post("/", createUser);

export default router;
