import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
} from "../controllers/user.controller";
import { authorizeRoles, validateToken } from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/",
  validateToken,
  authorizeRoles(["User", "Employee", "Admin", "SuperAdmin"]),
  getAllUsers
);
router.get(
  "/:id",
  validateToken,
  authorizeRoles(["Admin", "SuperAdmin"]),
  getUser
);
router.post(
  "/",
  validateToken,
  authorizeRoles(["Admin", "SuperAdmin"]),
  createUser
);
router.delete(
  "/:id",
  validateToken,
  authorizeRoles(["SuperAdmin"]),
  deleteUser
);

export default router;
