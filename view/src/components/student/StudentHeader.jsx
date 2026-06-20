import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    GraduationCap, Home, FileText, User, Calendar,
    LogOut, Menu, X, Bell
} from "lucide-react";

const StudentHeader = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    // Navigasi tetap sesuai kode awal Anda (Home, Raport, Schedule, Profile)
    const navItems = [
        { name: "Home", path: "/student/dashboard", icon: Home },
        { name: "Raport", path: "/student/raport", icon: FileText },
        { name: "Schedule", path: "/student/schedules", icon: Calendar },
        { name: "Profile", path: "/student/profile", icon: User },
    ];

    return (
        <nav className="bg-slate-950 border-b border-slate-900 text-white sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* BRAND WEBSITE: SCHOOLSYNC */}
                    <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/student/dashboard")}>
                        <div className="p-2 bg-indigo-600 rounded-xl shadow-xs">
                            <GraduationCap size={18} className="text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                            <span className="font-black tracking-wider text-xs sm:text-sm bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                                SchoolSync
                            </span>
                            <p className="text-[9px] font-black tracking-widest text-indigo-400 uppercase leading-none mt-0.5">STUDENT PORTAL</p>
                        </div>
                    </div>

                    {/* DESKTOP NAVIGATION */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all duration-300 ${isActive
                                            ? "bg-indigo-600 text-white shadow-xs"
                                            : "text-slate-400 hover:text-white hover:bg-slate-900"
                                        }`}
                                >
                                    <Icon size={13} strokeWidth={2.5} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* RIGHT CONTROLS */}
                    <div className="hidden md:flex items-center gap-4 border-l border-slate-900 pl-4">
                        <button className="text-slate-400 hover:text-white relative p-1.5 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer">
                            <Bell size={15} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-rose-950/30 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-950 rounded-xl text-xs font-black cursor-pointer transition-all active:scale-95"
                        >
                            <LogOut size={12} strokeWidth={2.5} />
                            Keluar
                        </button>
                    </div>

                    {/* MOBILE MENU BUTTON */}
                    <div className="md:hidden flex items-center gap-3">
                        <button className="text-slate-400 hover:text-white p-1.5 relative">
                            <Bell size={16} />
                            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-900 border border-slate-800"
                        >
                            {isOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>

                </div>
            </div>

            {/* MOBILE DROP-DOWN MENU */}
            {isOpen && (
                <div className="md:hidden border-t border-slate-900 bg-slate-950 px-4 pt-2 pb-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black tracking-wide ${isActive
                                        ? "bg-indigo-600 text-white"
                                        : "text-slate-400 hover:bg-slate-900"
                                    }`}
                            >
                                <Icon size={15} strokeWidth={2.5} />
                                {item.name}
                            </Link>
                        );
                    })}
                    <div className="pt-2 border-t border-slate-900 mt-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-xl text-xs font-black tracking-wide transition-colors"
                        >
                            <LogOut size={15} strokeWidth={2.5} />
                            Keluar Sistem
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default StudentHeader;