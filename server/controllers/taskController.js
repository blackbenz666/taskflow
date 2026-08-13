import { Task } from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      res.status(400).json({ message: "Название задачи обязательно" });
    }

    const task = await Task.create({
      user: req.user.id,
      title,
      description,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при создании задачи" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении списка задач" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Задача не найдена" });
    }

    if (task.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "У вас нет прав на удаление этой задачи" });
    }

    await task.deleteOne();
    res.status(200).json({ id: req.params.id, message: "Задача удалена" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении задачи" });
  }
};
