
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ users, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username);
    
    // In a real app, we would hash passwords
    if (user) {
      onLogin(user);
      navigate('/');
    } else {
      setError('Sai tên đăng nhập hoặc mật khẩu!');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            <i className="fas fa-lock"></i>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800">Chào mừng trở lại</h2>
          <p className="text-slate-500 mt-2">Hệ thống học tiếng Anh lớp 6</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tên đăng nhập</label>
            <div className="relative">
              <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none"
                placeholder="Ví dụ: admin, teacher1..."
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <i className="fas fa-key absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
          >
            Đăng nhập
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-600">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-indigo-600 font-bold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
        <h4 className="text-indigo-800 font-bold text-sm mb-2 uppercase tracking-wider">Demo Accounts:</h4>
        <div className="grid grid-cols-2 gap-4 text-xs text-indigo-700">
          <div>
            <p className="font-semibold">Admin:</p>
            <code className="bg-white px-1 rounded">admin</code>
          </div>
          <div>
            <p className="font-semibold">Teacher:</p>
            <code className="bg-white px-1 rounded">teacher1</code>
          </div>
          <div>
            <p className="font-semibold">Student:</p>
            <code className="bg-white px-1 rounded">student1</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
