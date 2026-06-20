import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    ClipboardList,
    CreditCard,
    FileText,
    LogOut,
    School,
    X,
    Calendar
} from "lucide-react";

const menus = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Schedules", icon: Calendar, path: "/admin/schedules" }, // 🌟 Menu baru
    { name: "Students", icon: Users, path: "/admin/students" },
    { name: "Teachers", icon: GraduationCap, path: "/admin/teachers" },
    { name: "Subjects", icon: BookOpen, path: "/admin/subjects" },
    { name: "Grades", icon: ClipboardList, path: "/admin/grades" },
    { name: "Payments", icon: CreditCard, path: "/admin/payments" },
    { name: "Reports", icon: FileText, path: "/admin/reports" }
];

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
    const username = localStorage.getItem("username") || "Admin";

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <>
            {/* BACKDROP: Aktif hanya di Mobile saat sidebar terbuka */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300"
                    onClick={toggleSidebar}
                />
            )}

            {/* SIDEBAR CONTAINER */}
            <aside className={`
                fixed top-0 bottom-0 left-0 z-50 flex flex-col
                w-64 md:w-72 bg-white border-r border-slate-100 min-h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)]
                transition-transform duration-300 ease-in-out
                lg:static lg:translate-x-0
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                
                {/* Header Logo & Brand */}
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3.5 group">
                        <div className="p-2.5 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform duration-300">
                            <School size={22} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-slate-800 font-bold text-base tracking-tight leading-tight">
                                Academic System
                            </h1>
                            <p className="text-indigo-600/80 font-medium text-xs tracking-wider uppercase mt-0.5">
                                Admin Panel
                            </p>
                        </div>
                    </div>
                    
                    {/* Tombol Close Mobile */}
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 lg:hidden"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Profile Section */}
                <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-3 bg-linear-to-r from-slate-50/50 to-transparent">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shadow-inner">
                        {username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-slate-400 text-[11px] font-medium tracking-wide uppercase">Welcome back</p>
                        <h2 className="text-slate-700 font-semibold text-sm tracking-tight">{username}</h2>
                    </div>
                </div>

                {/* Navigation Menus */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {menus.map((menu) => {
                        const Icon = menu.icon;
                        return (
                            <NavLink
                                key={menu.path}
                                to={menu.path}
                                onClick={() => {
                                    if (window.innerWidth < 1024) toggleSidebar();
                                }}
                                className={({ isActive }) => `
                                    flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 group
                                    ${isActive
                                        ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20 translate-x-1"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600 hover:translate-x-1"
                                    }
                                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon 
                                            size={19} 
                                            className={`transition-transform duration-300 ${!isActive && "group-hover:scale-110 group-hover:rotate-3"} text-current`} 
                                        />
                                        <span className="tracking-wide">{menu.name}</span>
                                        {isActive && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-slate-50">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2.5 bg-rose-50 hover:bg-linear-to-r hover:from-rose-500 hover:to-red-600 text-rose-600 hover:text-white py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-rose-500/20 active:scale-[0.98]"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;