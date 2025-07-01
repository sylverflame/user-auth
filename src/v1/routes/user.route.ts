import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
} from "../controllers/user.controller";
import { authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/",
  authorizeRoles(["User", "Employee", "Admin", "SuperAdmin"]),
  getAllUsers
);
router.get("/:id", authorizeRoles(["Admin", "SuperAdmin"]), getUser);
router.post("/", authorizeRoles(["Admin", "SuperAdmin"]), createUser);
router.delete("/:id", authorizeRoles(["SuperAdmin"]), deleteUser);

export default router;
