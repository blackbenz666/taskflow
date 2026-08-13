import express from "express";
import {
  createTask,
  getTasks,
  deleteTask,
} from "../controllers/taskController";
import { protect } from "../middleware/authMiddleware.js";

router.use(protect);

const router = express.Router();

router.route("/").get(getTasks).post(createTask);
router.route("/:id").delete(deleteTask);

export default router;
