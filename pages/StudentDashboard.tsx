
import React, { useState, useEffect } from 'react';
import { Lesson, Grade, User } from '../types';
import { getLearningTip } from '../services/geminiService';

interface StudentDashboardProps {
  lessons: Lesson[];
  grades: Grade[];
  currentUser: User;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ lessons, grades, currentUser }) => {
  const [learningTip, setLearningTip] = useState<string>('');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    const fetchTip = async () => {
      const studentGrades = grades.filter(g => g.studentId === currentUser.id);
      const avgScore = studentGrades.length > 0 
        ? studentGrades.reduce((acc, curr) => acc + curr.score, 0) / studentGrades.length 
        : 0;
      
      const tip = await getLearningTip(`Học sinh ${currentUser.fullName} có điểm trung bình ${avgScore.toFixed(1)}/10 sau ${studentGrades.length} bài kiểm tra.`);
      setLearningTip(tip || 'Hãy luôn cố gắng học tập nhé!');
    };
    fetchTip();
  }, [currentUser.id, grades, currentUser.fullName]);

  const studentGrades = grades.filter(g => g.studentId === currentUser.id);

  return (
    <div className="space-y-8">
      <header className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-extrabold mb-2">Chào {currentUser.fullName}! 👋</h1>
            <p className="text-indigo-100 text-lg">Hôm nay bạn muốn học gì nào?</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 flex gap-8">
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Bài học</p>
              <p className="text-2xl font-black">{lessons.length}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Điểm trung bình</p>
              <p className="text-2xl font-black">
                {studentGrades.length > 0 
                  ? (studentGrades.reduce((a, b) => a + b.score, 0) / studentGrades.length).toFixed(1) 
                  : '-'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {learningTip && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex-shrink-0 flex items-center justify-center text-xl">
            <i className="fas fa-lightbulb"></i>
          </div>
          <div>
            <p className="font-bold text-amber-800 text-sm">Lời khuyên AI dành cho bạn:</p>
            <p className="text-slate-700 italic">{learningTip}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <i className="fas fa-book-reader text-indigo-600"></i>
            Hành trình học tập
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lessons.map(lesson => (
              <div 
                key={lesson.id} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition cursor-pointer group"
                onClick={() => setSelectedLesson(lesson)}
              >
                <div className="flex justify-between items-start mb-4">
                   <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded uppercase">Unit {lesson.unit}</span>
                   <span className="text-slate-300 group-hover:text-indigo-600 transition"><i className="fas fa-arrow-right"></i></span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition">{lesson.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-3 mb-4">{lesson.content}</p>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1"><i className="fas fa-tag"></i> {lesson.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <i className="fas fa-chart-line text-emerald-600"></i>
            Tiến độ của tôi
          </h2>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            {studentGrades.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-tasks text-4xl text-slate-200 mb-3"></i>
                <p className="text-slate-400 text-sm">Bạn chưa tham gia bài kiểm tra nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {studentGrades.map(grade => (
                  <div key={grade.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="font-bold text-sm">Quiz Bài {grade.quizId}</p>
                      <p className="text-[10px] text-slate-400">{grade.date}</p>
                    </div>
                    <div className={`text-lg font-black ${grade.score >= 8 ? 'text-emerald-500' : grade.score >= 5 ? 'text-amber-500' : 'text-red-500'}`}>
                      {grade.score}/10
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg text-white">
            <h3 className="font-bold text-lg mb-2">Thách thức hôm nay</h3>
            <p className="text-indigo-100 text-sm mb-4">Hoàn thành bài đọc để nhận thêm 50 điểm tích lũy!</p>
            <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-md hover:bg-indigo-50 transition">
              Bắt đầu ngay
            </button>
          </div>
        </div>
      </div>

      {selectedLesson && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase">Unit {selectedLesson.unit}</span>
                <h2 className="text-2xl font-bold">{selectedLesson.title}</h2>
              </div>
              <button onClick={() => setSelectedLesson(null)} className="w-10 h-10 bg-slate-200 text-slate-600 rounded-full hover:bg-red-100 hover:text-red-600 transition">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-8 overflow-y-auto flex-grow prose prose-indigo max-w-none">
              <div className="bg-indigo-50 p-6 rounded-2xl mb-6">
                <h4 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
                   <i className="fas fa-star"></i> Nội dung chính
                </h4>
                <p className="text-indigo-900">{selectedLesson.content}</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Bài tập vận dụng</h3>
                <p className="text-slate-600">Hãy đọc kỹ nội dung trên và chuẩn bị cho bài kiểm tra 15 phút sau bài học này.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 border rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><i className="fas fa-pen"></i></div>
                    <div><p className="font-bold text-sm">Ghi chép từ vựng</p><p className="text-xs text-slate-400">10 từ mới</p></div>
                  </div>
                  <div className="p-4 border rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center"><i className="fas fa-play"></i></div>
                    <div><p className="font-bold text-sm">Video bổ trợ</p><p className="text-xs text-slate-400">5 phút</p></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
               <button onClick={() => setSelectedLesson(null)} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition">Đóng</button>
               <button className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition">Làm Quiz</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
