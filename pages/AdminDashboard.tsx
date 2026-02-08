
import React, { useState } from 'react';
import { User, UserRole, AccountStatus, Lesson } from '../types';
import { UNITS } from '../constants';

interface AdminDashboardProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  lessons: Lesson[];
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, setUsers, lessons, setLessons }) => {
  const [activeTab, setActiveTab] = useState<'teachers' | 'students' | 'content'>('teachers');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', fullName: '', role: UserRole.TEACHER });

  const teachers = users.filter(u => u.role === UserRole.TEACHER);
  const students = users.filter(u => u.role === UserRole.STUDENT);
  const pendingStudents = students.filter(s => s.status === AccountStatus.PENDING);

  const handleApprove = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: AccountStatus.ACTIVE } : u));
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleAddUser = () => {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...newUser,
      status: AccountStatus.ACTIVE
    };
    setUsers([...users, user]);
    setShowAddUserModal(false);
    setNewUser({ username: '', fullName: '', role: UserRole.TEACHER });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Bảng điều khiển Admin</h1>
          <p className="text-slate-500">Quản lý toàn bộ hệ thống EduPro</p>
        </div>
        <div className="flex bg-white rounded-xl shadow-sm p-1 border border-slate-200">
          <button 
            onClick={() => setActiveTab('teachers')}
            className={`px-4 py-2 rounded-lg transition text-sm font-semibold ${activeTab === 'teachers' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Giáo viên
          </button>
          <button 
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-lg transition text-sm font-semibold ${activeTab === 'students' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Học sinh {pendingStudents.length > 0 && <span className="ml-1 bg-red-400 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingStudents.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 rounded-lg transition text-sm font-semibold ${activeTab === 'content' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Nội dung
          </button>
        </div>
      </header>

      {activeTab === 'teachers' && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Quản lý Giáo viên</h2>
            <button 
              onClick={() => {
                setNewUser({...newUser, role: UserRole.TEACHER});
                setShowAddUserModal(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 text-sm"
            >
              <i className="fas fa-plus"></i> Thêm giáo viên
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 text-sm font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Họ và tên</th>
                  <th className="px-6 py-4">Tên đăng nhập</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.map(teacher => (
                  <tr key={teacher.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-800">{teacher.fullName}</td>
                    <td className="px-6 py-4 text-slate-600">{teacher.username}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Hoạt động</span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"><i className="fas fa-edit"></i></button>
                      <button onClick={() => handleDeleteUser(teacher.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'students' && (
        <div className="space-y-6">
          {pendingStudents.length > 0 && (
            <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="text-amber-800 font-bold mb-4 flex items-center gap-2">
                <i className="fas fa-user-clock"></i> 
                Yêu cầu đăng ký mới ({pendingStudents.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingStudents.map(student => (
                  <div key={student.id} className="bg-white p-4 rounded-xl border border-amber-100 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="font-bold text-slate-800">{student.fullName}</p>
                      <p className="text-xs text-slate-500">{student.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(student.id)} className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700">Duyệt</button>
                      <button onClick={() => handleDeleteUser(student.id)} className="px-3 py-1.5 bg-slate-200 text-slate-600 text-xs font-bold rounded-lg">Từ chối</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Tất cả Học sinh</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 text-sm font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Họ và tên</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.filter(s => s.status === AccountStatus.ACTIVE).map(student => (
                    <tr key={student.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-medium text-slate-800">{student.fullName}</td>
                      <td className="px-6 py-4 text-slate-600">{student.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Hoạt động</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeleteUser(student.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><i className="fas fa-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'content' && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold mb-4">Các bài học hiện có</h3>
              <div className="space-y-3">
                {lessons.map(lesson => (
                  <div key={lesson.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full mb-1 inline-block">Unit {lesson.unit}</span>
                      <h4 className="font-bold text-slate-800">{lesson.title}</h4>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-indigo-600 hover:bg-white rounded-lg transition"><i className="fas fa-edit"></i></button>
                      <button onClick={() => setLessons(lessons.filter(l => l.id !== lesson.id))} className="p-2 text-red-600 hover:bg-white rounded-lg transition"><i className="fas fa-trash"></i></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
             <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg">
                <h3 className="font-bold text-lg mb-2">Thêm bài học mới</h3>
                <p className="text-indigo-100 text-sm mb-4">Admin có quyền can thiệp vào toàn bộ chương trình học.</p>
                <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-md hover:bg-indigo-50 transition">
                  Mở trình soạn thảo
                </button>
             </div>
          </div>
        </section>
      )}

      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Tạo tài khoản {newUser.role === UserRole.TEACHER ? 'Giáo viên' : 'Học sinh'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Họ và tên</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newUser.fullName}
                  onChange={e => setNewUser({...newUser, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newUser.username}
                  onChange={e => setNewUser({...newUser, username: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddUserModal(false)} className="flex-1 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition">Hủy</button>
              <button onClick={handleAddUser} className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition">Tạo mới</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
