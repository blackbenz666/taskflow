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
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('medium');
  const [editDueDate, setEditDueDate] = useState('');

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

    dispatch(createTask({ title, description, priority, dueDate: dueDate || null }));
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('')
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
  };

  const handleStartEdit = (task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority || 'medium');
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
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
        priority: editPriority,
        dueDate: editDueDate || null,
      })
    );

    handleCancelEdit();
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[160px]" />
        <div className="absolute bottom-[-250px] right-[-150px] h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-5 border-b border-white/[0.06] pb-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.05] text-lg font-semibold shadow-inner shadow-white/[0.03]">
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                Workspace
              </p>

              <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {user?.name || 'Пользователь'}
              </h1>

              <p className="mt-1 text-sm text-zinc-500">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={() => dispatch(logout())}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-zinc-400 transition-all duration-200 hover:border-red-500/20 hover:bg-red-500/[0.08] hover:text-red-400"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 17l5-5-5-5" />
              <path d="M15 12H3" />
              <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
            </svg>
            Выйти
          </button>
        </header>

        {/* Dashboard heading */}
        <section className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
              Мои задачи
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
              Планируйте работу, отслеживайте дедлайны и держите важные задачи
              под контролем.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5">
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                Всего
              </p>
              <p className="mt-0.5 text-lg font-semibold text-white">
                {tasks.length}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5">
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                В работе
              </p>
              <p className="mt-0.5 text-lg font-semibold text-violet-400">
                {activeTasksCount}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5">
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                Готово
              </p>
              <p className="mt-0.5 text-lg font-semibold text-emerald-400">
                {tasks.length - activeTasksCount}
              </p>
            </div>
          </div>
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          {/* Create task */}
          <aside className="lg:sticky lg:top-6">
            <form
              onSubmit={handleCreateTask}
              className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111113] shadow-2xl shadow-black/20"
            >
              <div className="border-b border-white/[0.06] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Новая задача
                    </h3>
                    <p className="text-xs text-zinc-600">
                      Добавьте задачу в список
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-5">
                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/[0.07] px-3.5 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-xs font-medium text-zinc-500">
                    Название
                  </label>

                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Например, закончить презентацию"
                    required
                    className="w-full rounded-xl border border-white/[0.08] bg-[#09090b] px-3.5 py-3 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-700 focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/[0.07]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-zinc-500">
                    Описание
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Добавьте немного контекста..."
                    rows="4"
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#09090b] px-3.5 py-3 text-sm leading-6 text-zinc-100 outline-none transition-all placeholder:text-zinc-700 focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/[0.07]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-zinc-500">
                      Приоритет
                    </label>

                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full cursor-pointer rounded-xl border border-white/[0.08] bg-[#09090b] px-3 py-3 text-sm text-zinc-300 outline-none transition-all focus:border-violet-500/50"
                    >
                      <option value="low">Низкий</option>
                      <option value="medium">Средний</option>
                      <option value="high">Высокий</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-zinc-500">
                      Дедлайн
                    </label>

                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full rounded-xl border border-white/[0.08] bg-[#09090b] px-3 py-3 text-sm text-zinc-400 outline-none transition-all focus:border-violet-500/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-200 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>

                  Добавить задачу
                </button>
              </div>
            </form>
          </aside>

          {/* Tasks */}
          <main className="min-w-0">
            {/* Filters */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-zinc-300">
                  Задачи
                </h3>

                <span className="rounded-md bg-white/[0.05] px-2 py-0.5 text-xs font-medium text-zinc-500">
                  {filteredTasks.length}
                </span>
              </div>

              <div className="flex w-fit rounded-xl border border-white/[0.07] bg-[#111113] p-1">
                {[
                  {
                    key: 'all',
                    label: 'Все',
                    count: tasks.length,
                  },
                  {
                    key: 'active',
                    label: 'В работе',
                    count: activeTasksCount,
                  },
                  {
                    key: 'completed',
                    label: 'Готово',
                    count: tasks.length - activeTasksCount,
                  },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setFilter(item.key)}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${filter === item.key
                        ? 'bg-white/[0.08] text-white shadow-sm'
                        : 'text-zinc-600 hover:text-zinc-300'
                      }`}
                  >
                    {item.label}
                    <span
                      className={`ml-1.5 ${filter === item.key
                          ? 'text-zinc-400'
                          : 'text-zinc-700'
                        }`}
                    >
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            {isLoading && tasks.length === 0 ? (
              <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-white/[0.06] bg-[#111113]">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-500" />
                  <p className="text-sm text-zinc-600">
                    Загружаем задачи...
                  </p>
                </div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] px-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.04] text-zinc-500">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>

                <h3 className="text-sm font-semibold text-zinc-300">
                  Здесь пока пусто
                </h3>

                <p className="mt-1 max-w-xs text-sm leading-6 text-zinc-600">
                  Создайте первую задачу, чтобы начать планировать работу.
                </p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015]">
                <p className="text-sm text-zinc-600">
                  {filter === 'active' && 'Активных задач нет'}
                  {filter === 'completed' && 'Завершённых задач пока нет'}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredTasks.map((task) => {
                  const isEditing = editingTaskId === task._id;

                  const isOverdue =
                    task.dueDate &&
                    !task.completed &&
                    new Date(task.dueDate).setHours(23, 59, 59, 999) <
                    new Date().getTime();

                  const priorityConfig = {
                    high: {
                      label: 'Высокий',
                      dot: 'bg-red-400',
                      className:
                        'border-red-500/15 bg-red-500/[0.07] text-red-400',
                    },
                    medium: {
                      label: 'Средний',
                      dot: 'bg-amber-400',
                      className:
                        'border-amber-500/15 bg-amber-500/[0.07] text-amber-400',
                    },
                    low: {
                      label: 'Низкий',
                      dot: 'bg-emerald-400',
                      className:
                        'border-emerald-500/15 bg-emerald-500/[0.07] text-emerald-400',
                    },
                  };

                  const currentPriority =
                    priorityConfig[task.priority] || priorityConfig.medium;

                  return (
                    <article
                      key={task._id}
                      className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 ${task.completed
                          ? 'border-white/[0.04] bg-[#0e0e10] opacity-60'
                          : 'border-white/[0.07] bg-[#111113] hover:border-white/[0.12] hover:bg-[#131316]'
                        }`}
                    >
                      {isEditing ? (
                        <div className="space-y-4 p-5">
                          <div>
                            <label className="mb-2 block text-xs font-medium text-zinc-600">
                              Название
                            </label>

                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              placeholder="Название задачи"
                              autoFocus
                              className="w-full rounded-xl border border-white/[0.08] bg-[#09090b] px-3.5 py-2.5 text-sm font-medium text-white outline-none transition-all focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/[0.06]"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-xs font-medium text-zinc-600">
                              Описание
                            </label>

                            <textarea
                              value={editDescription}
                              onChange={(e) =>
                                setEditDescription(e.target.value)
                              }
                              placeholder="Описание задачи"
                              rows="3"
                              className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#09090b] px-3.5 py-2.5 text-sm leading-6 text-zinc-300 outline-none transition-all focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/[0.06]"
                            />
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <label className="mb-2 block text-xs font-medium text-zinc-600">
                                Приоритет
                              </label>

                              <select
                                value={editPriority}
                                onChange={(e) =>
                                  setEditPriority(e.target.value)
                                }
                                className="w-full rounded-xl border border-white/[0.08] bg-[#09090b] px-3 py-2.5 text-sm text-zinc-300 outline-none focus:border-violet-500/50"
                              >
                                <option value="low">Низкий</option>
                                <option value="medium">Средний</option>
                                <option value="high">Высокий</option>
                              </select>
                            </div>

                            <div>
                              <label className="mb-2 block text-xs font-medium text-zinc-600">
                                Дедлайн
                              </label>

                              <input
                                type="date"
                                value={editDueDate}
                                onChange={(e) =>
                                  setEditDueDate(e.target.value)
                                }
                                className="w-full rounded-xl border border-white/[0.08] bg-[#09090b] px-3 py-2.5 text-sm text-zinc-400 outline-none focus:border-violet-500/50"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 border-t border-white/[0.05] pt-4">
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(task._id)}
                              className="rounded-lg bg-white px-3.5 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
                            >
                              Сохранить
                            </button>

                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="rounded-lg px-3.5 py-2 text-xs font-medium text-zinc-500 transition-colors hover:bg-white/[0.05] hover:text-zinc-300"
                            >
                              Отмена
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-4 p-5">
                          {/* Checkbox */}
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                updateTask({
                                  id: task._id,
                                  completed: !task.completed,
                                })
                              )
                            }
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${task.completed
                                ? 'border-violet-500 bg-violet-500 text-white'
                                : 'border-zinc-700 bg-zinc-900 text-transparent hover:border-zinc-500'
                              }`}
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          </button>

                          {/* Information */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <h3
                                  className={`truncate text-sm font-semibold ${task.completed
                                      ? 'text-zinc-600 line-through'
                                      : 'text-zinc-200'
                                    }`}
                                >
                                  {task.title}
                                </h3>

                                {task.description && (
                                  <p
                                    className={`mt-1.5 text-sm leading-6 ${task.completed
                                        ? 'text-zinc-700'
                                        : 'text-zinc-500'
                                      }`}
                                  >
                                    {task.description}
                                  </p>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(task)}
                                  title="Редактировать"
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition-all hover:bg-white/[0.06] hover:text-zinc-300"
                                >
                                  <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                  </svg>
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteTask(task._id)
                                  }
                                  title="Удалить"
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition-all hover:bg-red-500/[0.08] hover:text-red-400"
                                >
                                  <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M3 6h18" />
                                    <path d="M8 6V4h8v2" />
                                    <path d="M19 6l-1 14H6L5 6" />
                                    <path d="M10 11v5M14 11v5" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Metadata */}
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium ${currentPriority.className}`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${currentPriority.dot}`}
                                />
                                {currentPriority.label}
                              </span>

                              {task.dueDate && (
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium ${isOverdue
                                      ? 'border-red-500/15 bg-red-500/[0.07] text-red-400'
                                      : 'border-white/[0.06] bg-white/[0.025] text-zinc-500'
                                    }`}
                                >
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                  >
                                    <rect
                                      x="3"
                                      y="5"
                                      width="18"
                                      height="16"
                                      rx="2"
                                    />
                                    <path d="M16 3v4M8 3v4M3 11h18" />
                                  </svg>

                                  {new Date(
                                    task.dueDate
                                  ).toLocaleDateString('ru-RU', {
                                    day: 'numeric',
                                    month: 'short',
                                  })}

                                  {isOverdue && ' · Просрочено'}
                                </span>
                              )}

                              {task.completed && (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-500/70">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                  Выполнено
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};