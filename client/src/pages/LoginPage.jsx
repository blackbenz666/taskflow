import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/slices/authSlice';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));

    if (!result.error) {
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-slate-800 p-8 shadow-lg text-white"
      >
        <h2 className="mb-6 text-center text-2xl font-bold">Вход в аккаунт</h2>

        {error && (
          <div className="mb-4 rounded bg-red-500/20 p-3 text-center text-sm text-red-400 border border-red-500/50">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-slate-300">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
            className="w-full rounded bg-slate-700 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-slate-300">Пароль</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded bg-slate-700 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-indigo-600 py-2.5 font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Загрузка...' : 'Войти'}
        </button>

        <p className="mt-4 text-center text-sm text-slate-400">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-indigo-400 hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </form>
    </div>
  );
};