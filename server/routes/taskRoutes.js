import express from "express";
import {
  createTask,
  getTasks,
  deleteTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getTasks).post(createTask);
router.route("/:id").delete(deleteTask);

export default router;
