import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-white">
      <div className="w-full max-w-lg rounded-xl bg-slate-800 p-8 shadow-lg text-center">
        <h1 className="mb-4 text-3xl font-bold">Главная страница</h1>

        {user ? (
          <div>
            <p className="mb-2 text-lg text-slate-300">
              Привет, <span className="font-semibold text-indigo-400">{user.name}</span>! 👋
            </p>
            <p className="mb-6 text-sm text-slate-400">Email: {user.email}</p>

            <button
              onClick={() => dispatch(logout())}
              className="rounded bg-red-600 px-5 py-2 font-medium text-white transition-colors hover:bg-red-500"
            >
              Выйти из аккаунта
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-6 text-slate-300">
              Вы не авторизованы. Войдите или зарегистрируйтесь, чтобы продолжить.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/login"
                className="rounded bg-indigo-600 px-5 py-2 font-medium text-white transition-colors hover:bg-indigo-500"
              >
                Войти
              </Link>
              <Link
                to="/register"
                className="rounded bg-slate-700 px-5 py-2 font-medium text-white transition-colors hover:bg-slate-600"
              >
                Регистрация
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};