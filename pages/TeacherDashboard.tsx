
import React, { useState } from 'react';
import { User, UserRole, Lesson, Grade, AccountStatus } from '../types';
import { UNITS } from '../constants';
import { generateQuizQuestions } from '../services/geminiService';

interface TeacherDashboardProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  lessons: Lesson[];
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
  grades: Grade[];
  setGrades: React.Dispatch<React.SetStateAction<Grade[]>>;
  currentUser: User;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ users, setUsers, lessons, setLessons, grades, setGrades, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'students' | 'content' | 'grades'>('students');
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Partial<Lesson> | null>(null);

  const students = users.filter(u => u.role === UserRole.STUDENT && u.status === AccountStatus.ACTIVE);

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson?.title || !editingLesson?.content) return;

    const newLesson: Lesson = {
      id: Math.random().toString(36).substr(2, 9),
      title: editingLesson.title,
      content: editingLesson.content,
      unit: Number(editingLesson.unit) || 1,
      category: (editingLesson.category as any) || 'Vocabulary',
      createdBy: currentUser.id
    };

    setLessons([...lessons, newLesson]);
    setEditingLesson(null);
  };

  const handleGenerateQuestions = async (lesson: Lesson) => {
    setIsGenerating(true);
    const questions = await generateQuizQuestions(lesson.title, lesson.content);
    if (questions) {
      alert(`Đã tạo thành công ${questions.length} câu hỏi AI cho bài: ${lesson.title}`);
    }
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Cổng Giáo viên</h1>
          <p className="text-slate-500">Quản lý lớp học và nội dung bài giảng</p>
        </div>
        <div className="flex bg-white rounded-xl shadow-sm p-1 border border-slate-200">
          <button onClick={() => setActiveTab('students')} className={`px-4 py-2 rounded-lg transition text-sm font-semibold ${activeTab === 'students' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}>Lớp học</button>
          <button onClick={() => setActiveTab('content')} className={`px-4 py-2 rounded-lg transition text-sm font-semibold ${activeTab === 'content' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}>Bài học</button>
          <button onClick={() => setActiveTab('grades')} className={`px-4 py-2 rounded-lg transition text-sm font-semibold ${activeTab === 'grades' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}>Điểm số</button>
        </div>
      </header>

      {activeTab === 'students' && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Danh sách học sinh</h2>
            <div className="flex gap-2">
               <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold">Tổng: {students.length} em</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map(student => (
              <div key={student.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl font-bold">
                  {student.fullName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{student.fullName}</h4>
                  <p className="text-xs text-slate-500">{student.username}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-6">Tạo bài học mới</h2>
            <form onSubmit={handleCreateLesson} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tiêu đề bài học</label>
                <input 
                  type="text" required className="w-full px-4 py-2 bg-slate-50 border rounded-xl"
                  onChange={e => setEditingLesson({...editingLesson, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Unit</label>
                  <select className="w-full px-4 py-2 bg-slate-50 border rounded-xl" onChange={e => setEditingLesson({...editingLesson, unit: Number(e.target.value)})}>
                    {UNITS.map(u => <option key={u} value={u}>Unit {u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Thể loại</label>
                  <select className="w-full px-4 py-2 bg-slate-50 border rounded-xl" onChange={e => setEditingLesson({...editingLesson, category: e.target.value as any})}>
                    <option value="Vocabulary">Vocabulary</option>
                    <option value="Grammar">Grammar</option>
                    <option value="Reading">Reading</option>
                    <option value="Listening">Listening</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nội dung (Markdown)</label>
                <textarea 
                  required rows={6} className="w-full px-4 py-2 bg-slate-50 border rounded-xl resize-none"
                  onChange={e => setEditingLesson({...editingLesson, content: e.target.value})}
                ></textarea>
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition">
                Lưu bài học
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold">Bài học đã đăng</h2>
            <div className="grid grid-cols-1 gap-4">
              {lessons.map(lesson => (
                <div key={lesson.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full uppercase">Unit {lesson.unit}</span>
                      <h3 className="text-lg font-bold mt-1">{lesson.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleGenerateQuestions(lesson)}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 disabled:opacity-50"
                      >
                        <i className={`fas ${isGenerating ? 'fa-spinner fa-spin' : 'fa-magic'}`}></i> 
                        Tạo Quiz bằng AI
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-500 transition"><i className="fas fa-trash"></i></button>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm line-clamp-2">{lesson.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'grades' && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-xl font-bold mb-6">Quản lý điểm số</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 text-sm font-bold uppercase">
                <tr>
                  <th className="px-6 py-4">Học sinh</th>
                  <th className="px-6 py-4">Bài kiểm tra</th>
                  <th className="px-6 py-4">Phân loại</th>
                  <th className="px-6 py-4">Điểm</th>
                  <th className="px-6 py-4">Ngày thực hiện</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {grades.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400 italic">Chưa có dữ liệu điểm số nào</td>
                  </tr>
                ) : (
                  grades.map(grade => (
                    <tr key={grade.id}>
                      <td className="px-6 py-4 font-medium">{users.find(u => u.id === grade.studentId)?.fullName}</td>
                      <td className="px-6 py-4">Quiz Bài {grade.quizId}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          grade.type === 'Final' ? 'bg-red-100 text-red-600' :
                          grade.type === 'Midterm' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {grade.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-indigo-600">{grade.score}/10</td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{grade.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default TeacherDashboard;
