import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { getTasks, createTask, deleteTask, updateTask } from '../redux/slices/taskSlice';

export const HomePage = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { tasks, isLoading, error } = useSelector((state) => state.tasks);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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
          <h2 className="mb-4 text-lg font-semibold text-white">
            Ваши задачи ({tasks.length})
          </h2>

          {isLoading && tasks.length === 0 ? (
            <div className="text-center py-8 text-slate-400">Загрузка задач...</div>
          ) : tasks.length === 0 ? (
            <div className="rounded-xl bg-slate-800/50 p-8 text-center text-slate-400">
              Задач пока нет. Создайте первую слева! 🚀
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-start justify-between rounded-xl bg-slate-800 p-5 shadow-lg border border-slate-700/50 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start gap-3 pr-4">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() =>
                        dispatch(
                          updateTask({ id: task._id, completed: !task.completed })
                        )
                      }
                      className="mt-1 h-5 w-5 cursor-pointer rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
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

                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};