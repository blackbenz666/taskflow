import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { getTasks, createTask, deleteTask, updateTask } from '../redux/slices/taskSlice';

export const HomePage = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { tasks, isLoading, error } = useSelector((state) => state.tasks);

  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter == 'active') return !task.completed;
      if (filter == 'completed') return task.completed;
      return true;
    })
  }, [tasks, filter]);

  const activeTasksCount = useMemo(() => {
    return tasks.filter((task) => !task.completed).length;
  }, [tasks]);

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    dispatch(createTask({ title, description }));
    setTitle('');
    setDescription('');
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
  };

  const handleStartEdit = (task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleSaveEdit = (id) => {
    if (!editTitle.trim()) return;

    dispatch(
      updateTask({
        id,
        title: editTitle,
        description: editDescription,
      })
    );

    handleCancelEdit();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* --- ШАПКА ПРОФИЛЯ --- */}
      <header className="mb-8 flex items-center justify-between rounded-xl bg-slate-800 p-6 shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Привет, {user?.name || 'Пользователь'}! 👋
          </h1>
          <p className="text-sm text-slate-400">{user?.email}</p>
        </div>
        <button
          onClick={() => dispatch(logout())}
          className="rounded-lg bg-red-500/10 px-4 py-2 font-medium text-red-400 hover:bg-red-500/20 transition-colors"
        >
          Выйти
        </button>
      </header>

      <div className="grid gap-8 md:grid-cols-3">
        {/* --- ФОРМА СОЗДАНИЯ ЗАДАЧИ --- */}
        <div className="md:col-span-1">
          <form
            onSubmit={handleCreateTask}
            className="rounded-xl bg-slate-800 p-6 shadow-lg"
          >
            <h2 className="mb-4 text-lg font-semibold text-white">Новая задача</h2>

            {error && (
              <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Название
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Что нужно сделать?"
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div className="mb-6">
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Описание
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Детали задачи..."
                rows="3"
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              Добавить задачу
            </button>
          </form>
        </div>

        {/* --- СПИСОК ЗАДАЧ --- */}
        <div className="md:col-span-2">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-white">
              Ваши задачи ({tasks.length})
            </h2>

            {/* Табы фильтрации */}
            <div className="flex rounded-lg border border-slate-700 bg-slate-900 p-1">
              <button
                onClick={() => setFilter('all')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${filter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                Все ({tasks.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${filter === 'active'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                В работе ({activeTasksCount})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${filter === 'completed'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                Завершённые ({tasks.length - activeTasksCount})
              </button>
            </div>
          </div>

          {isLoading && tasks.length === 0 ? (
            <div className="py-8 text-center text-slate-400">Загрузка задач...</div>
          ) : tasks.length === 0 ? (
            <div className="rounded-xl bg-slate-800/50 p-8 text-center text-slate-400">
              Задач пока нет. Создайте первую слева! 🚀
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="rounded-xl bg-slate-800/50 p-8 text-center text-slate-400">
              {filter === 'active' && 'Нет активных задач 🎉'}
              {filter === 'completed' && 'Нет завершённых задач 📌'}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => {
                const isEditing = editingTaskId === task._id;

                return (
                  <div
                    key={task._id}
                    className="flex items-start justify-between rounded-xl border border-slate-700/50 bg-slate-800 p-5 shadow-lg transition-colors hover:border-slate-600"
                  >
                    {isEditing ? (
                      /* --- РЕЖИМ РЕДАКТИРОВАНИЯ --- */
                      <div className="w-full space-y-3 pr-4">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-white focus:border-indigo-500 focus:outline-none"
                          placeholder="Название задачи"
                          autoFocus
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                          placeholder="Описание задачи"
                          rows="2"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(task._id)}
                            className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-indigo-500"
                          >
                            Сохранить
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="rounded-lg bg-slate-700 px-3 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-600"
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* --- ОБЫЧНЫЙ РЕЖИМ ОТОБРАЖЕНИЯ --- */
                      <>
                        <div className="flex items-start gap-3 pr-4">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() =>
                              dispatch(
                                updateTask({ id: task._id, completed: !task.completed })
                              )
                            }
                            className="mt-1 h-5 w-5 cursor-pointer rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                          />

                          <div className="space-y-1">
                            <h3
                              className={`font-semibold ${task.completed ? 'line-through text-slate-500' : 'text-white'
                                }`}
                            >
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-sm text-slate-400">{task.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Кнопка Редактировать */}
                          <button
                            onClick={() => handleStartEdit(task)}
                            className="p-1 text-slate-500 transition-colors hover:text-indigo-400"
                            title="Редактировать"
                          >
                            ✏️
                          </button>
                          {/* Кнопка Удалить */}
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="p-1 text-slate-500 transition-colors hover:text-red-400"
                            title="Удалить"
                          >
                            🗑️
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};