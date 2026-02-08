
import React from 'react';
import { User, UserRole } from '../types';
import { useNavigate, Link } from 'react-router-dom';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-indigo-600">
          <i className="fas fa-graduation-cap"></i>
          <span>EduPro</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">{user.fullName}</p>
            <p className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</p>
          </div>
          <button 
            onClick={handleLogoutClick}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
