import React from 'react';
import { IoMdMic } from 'react-icons/io';
import { FaGithub, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-darkBorder bg-darkBg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-md shadow-brand-500/20">
              <IoMdMic className="text-white text-xl animate-pulse-slow" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-brand-400 bg-clip-text text-transparent">
                SpeechTranscribe
              </span>
              <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-brand-500/10 text-brand-400 rounded-full border border-brand-500/20">
                AI Powered
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Whisper Active
            </span>

            {isAuthenticated && user && (
              <>
                {/* User Badge */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/40 border border-slate-700/50">
                  <FaUserCircle className="text-brand-400 text-sm" />
                  <span className="text-xs font-medium text-slate-300 max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
                  title="Sign Out"
                >
                  <FaSignOutAlt className="text-sm" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            )}

            <a
              href="https://github.com/Manan03-o-o/SpeechtoText"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-700/50"
            >
              <FaGithub className="text-xl" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
