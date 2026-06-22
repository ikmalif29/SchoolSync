/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, User, LayoutDashboard, Calendar, Bell, Sparkles } from "lucide-react";
import Cookies from "js-cookie";

const TeacherHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("Guru");

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) setUsername(savedUsername.split("@")[0]);
  }, []);

  const navigation = [
    { name: "Dashboard", path: "/teacher/dashboard", icon: LayoutDashboard },
    { name: "Schedule", path: "/teacher/schedules", icon: Calendar },
    { name: "Grades", path: "/teacher/grades", icon: Bell },
    { name: "Profile", path: "/teacher/profile", icon: User },
  ];

  const handleLogout = () => {
    localStorage.clear();
    Cookies.remove("role");
    navigate("/", { replace: true });
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* BRAND LOGO (SCHOOLSYNC) */}
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate("/teacher/dashboard")}>
            <div className="bg-linear-to-tr from-indigo-600 to-purple-600 text-white p-2 rounded-xl shadow-md group-hover:rotate-6 transition-transform duration-300">
              <Sparkles size={18} className="animate-pulse" />
            </div>
            <span className="text-base font-black text-slate-900 tracking-tight">
              School<span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600">Sync</span>
            </span>
          </div>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isActive 
                      ? "bg-indigo-50 text-indigo-600 border border-indigo-100/30" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={14} strokeWidth={2.5} />
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* RIGHT CONTROLS */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-slate-50 transition-colors relative cursor-pointer group">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white group-hover:scale-125 transition-transform" />
            </button>
            
            <div className="flex items-center gap-3 pl-3 border-l border-slate-100">
              <div className="text-right">
                <p className="text-xs font-black text-slate-800 truncate max-w-30">{username}</p>
                <p className="text-[9px] font-black text-indigo-500/80 uppercase tracking-widest">Educator</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-100 rounded-xl transition-all cursor-pointer hover:shadow-xs active:scale-95"
                title="Keluar Aplikasi"
              >
                <LogOut size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* MOBILE HAMBURGER */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white ${isOpen ? "max-h-64 opacity-100 border-t border-slate-100" : "max-h-0 opacity-0"}`}>
        <div className="px-3 py-3 space-y-1 shadow-xs">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => { navigate(item.path); setIsOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                  isActive ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon size={16} />
                {item.name}
              </button>
            );
          })}
          <div className="pt-2 mt-2 border-t border-slate-100">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-black text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
              <LogOut size={16} /> Keluar Sistem
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TeacherHeader;