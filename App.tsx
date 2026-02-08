
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { User, UserRole, AccountStatus, Lesson, Grade } from './types';
import { INITIAL_USERS, INITIAL_LESSONS } from './constants';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem('lessons');
    return saved ? JSON.parse(saved) : INITIAL_LESSONS;
  });

  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('lessons', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const ProtectedRoute: React.FC<{ children: React.ReactElement; allowedRoles: UserRole[] }> = ({ children, allowedRoles }) => {
    if (!currentUser) return <Navigate to="/login" replace />;
    if (!allowedRoles.includes(currentUser.role)) return <Navigate to="/" replace />;
    if (currentUser.status !== AccountStatus.ACTIVE) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
            <i className="fas fa-user-clock text-5xl text-amber-500 mb-4"></i>
            <h1 className="text-2xl font-bold mb-2">Tài khoản chưa được duyệt</h1>
            <p className="text-slate-600 mb-6">Chào {currentUser.fullName}, tài khoản của bạn đang chờ quản trị viên phê duyệt. Vui lòng quay lại sau.</p>
            <button onClick={handleLogout} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Đăng xuất
            </button>
          </div>
        </div>
      );
    }
    return children;
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col font-sans">
        {currentUser && <Navbar user={currentUser} onLogout={handleLogout} />}
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login users={users} onLogin={setCurrentUser} />} />
            <Route path="/register" element={<Register onRegister={(u) => setUsers([...users, u])} />} />
            
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <AdminDashboard users={users} setUsers={setUsers} lessons={lessons} setLessons={setLessons} />
              </ProtectedRoute>
            } />

            <Route path="/teacher/*" element={
              <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
                <TeacherDashboard users={users} setUsers={setUsers} lessons={lessons} setLessons={setLessons} grades={grades} setGrades={setGrades} currentUser={currentUser!} />
              </ProtectedRoute>
            } />

            <Route path="/student/*" element={
              <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                <StudentDashboard lessons={lessons} grades={grades} currentUser={currentUser!} />
              </ProtectedRoute>
            } />

            <Route path="/" element={
              currentUser ? (
                currentUser.role === UserRole.ADMIN ? <Navigate to="/admin" /> :
                currentUser.role === UserRole.TEACHER ? <Navigate to="/teacher" /> :
                <Navigate to="/student" />
              ) : <Navigate to="/login" />
            } />
          </Routes>
        </main>
        <footer className="bg-white border-t py-6 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} EduPro Grade 6 English. All rights reserved.
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
