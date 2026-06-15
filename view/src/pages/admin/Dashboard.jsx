import { useState } from "react";
import {
    Users,
    GraduationCap,
    BookOpen,
    CreditCard,
    TrendingUp,
    CircleDollarSign,
    Menu,
    ArrowUpRight,
    Clock
} from "lucide-react";
import AdminSidebar from "../../components/SidebarAdmin";

const stats = [
    { title: "Total Students", value: "320", icon: Users, gradient: "from-indigo-500 to-blue-600", lightBg: "bg-indigo-50 text-indigo-600" },
    { title: "Total Teachers", value: "28", icon: GraduationCap, gradient: "from-purple-500 to-violet-600", lightBg: "bg-purple-50 text-purple-600" },
    { title: "Total Subjects", value: "16", icon: BookOpen, gradient: "from-pink-500 to-rose-600", lightBg: "bg-pink-50 text-pink-600" },
    { title: "Total Payments", value: "125", icon: CreditCard, gradient: "from-emerald-500 to-teal-600", lightBg: "bg-emerald-50 text-emerald-600" },
];

const DashboardAdmin = () => {
    const username = localStorage.getItem("username") || "Admin";
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex bg-[#f8fafc] min-h-screen text-slate-700 antialiased overflow-x-hidden">
            
            {/* INTEGRASI SIDEBAR ELEGAN */}
            <AdminSidebar 
                isOpen={isSidebarOpen} 
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            />

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 min-w-0 flex flex-col transition-all duration-300">
                
                {/* GLASSMORPHISM TOP BAR */}
                <header className="sticky top-0 bg-white/70 backdrop-blur-md border-b border-slate-100 px-6 md:px-8 py-4 flex items-center justify-between z-30 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition-all active:scale-95 shadow-sm"
                            title="Toggle Sidebar"
                        >
                            <Menu size={19} />
                        </button>
                        <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100 hidden sm:inline-block">
                            Sistem Akademik Aktif
                        </span>
                    </div>

                    <div className="text-right text-xs text-slate-400 font-medium">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </header>

                {/* CONTENT CONTAINER */}
                <div className="p-6 md:p-8 space-y-6 flex-1 overflow-y-auto max-w-400 w-full mx-auto animate-fadeIn">
                    
                    {/* PREMIUM WELCOME HEADER */}
                    <div className="relative overflow-hidden bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-indigo-950/10 group">
                        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
                        <div className="relative z-10">
                            <span className="text-xs font-semibold tracking-widest text-indigo-400 uppercase">Ringkasan Utama</span>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1 bg-linear-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                                Selamat Datang Kembali, {username} 👋
                            </h1>
                            <p className="text-slate-400 text-xs md:text-sm mt-1.5 font-medium max-w-md">
                                Semua sistem berjalan optimal. Berikut adalah pembaruan data akademik dan administrasi hari ini.
                            </p>
                        </div>
                    </div>

                    {/* STATS GRID WITH LIFT-UP INTERACTION */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                        {stats.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(99,102,241,0.05)] border-b-2 hover:border-b-indigo-500 transition-all duration-300 group cursor-pointer"
                                >
                                    <div className="space-y-1">
                                        <p className="text-slate-400 text-xs font-semibold tracking-wide uppercase">
                                            {item.title}
                                        </p>
                                        <h2 className="text-3xl font-bold tracking-tight text-slate-800 group-hover:text-indigo-600 transition-colors">
                                            {item.value}
                                        </h2>
                                    </div>
                                    <div className={`p-3.5 rounded-xl transition-all duration-300 ${item.lightBg} group-hover:bg-linear-to-tr group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-md group-hover:shadow-indigo-200`}>
                                        <Icon size={22} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* TWO COLUMN ANALYTICS SECTION */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        
                        {/* RECENT ACTIVITY CARD */}
                        <div className="xl:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                                            <TrendingUp size={18} />
                                        </div>
                                        <h2 className="text-base font-bold text-slate-800">Aktivitas Terbaru</h2>
                                    </div>
                                    <button className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                                        Semua <ArrowUpRight size={14} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { title: "Siswa baru berhasil terdaftar", time: "5 menit yang lalu", type: "student" },
                                        { title: "Perubahan data kurikulum Guru", time: "20 menit yang lalu", type: "teacher" },
                                        { title: "Invois pembayaran baru dibuat", time: "1 jam yang lalu", type: "payment" }
                                    ].map((act, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors group">
                                            <div className="p-2 rounded-lg bg-white border border-slate-100 text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors mt-0.5">
                                                <Clock size={14} />
                                            </div>
                                            <div>
                                                <p className="text-xs md:text-sm text-slate-700 font-medium">{act.title}</p>
                                                <span className="text-slate-400 text-[11px] mt-0.5 block font-medium">{act.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* PAYMENT SUMMARY DECORATED */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                    <CircleDollarSign size={18} />
                                </div>
                                <h2 className="text-base font-bold text-slate-800">Ringkasan Keuangan</h2>
                            </div>

                            <div className="space-y-3.5">
                                {[
                                    { label: "Lunas (Paid)", amount: "Rp 45.000.000", color: "text-emerald-600", bg: "bg-emerald-50/60 border-emerald-100/70" },
                                    { label: "Tertunda (Pending)", amount: "Rp 12.500.000", color: "text-amber-600", bg: "bg-amber-50/60 border-amber-100/70" },
                                    { label: "Menunggak (Overdue)", amount: "Rp 4.200.000", color: "text-rose-600", bg: "bg-rose-50/60 border-rose-100/70" }
                                ].map((item, idx) => (
                                    <div key={idx} className={`p-4 rounded-xl border ${item.bg} transition-transform duration-200 hover:scale-[1.01]`}>
                                        <p className="text-slate-400 text-[11px] font-bold tracking-wider uppercase">{item.label}</p>
                                        <h3 className={`${item.color} text-xl font-bold tracking-tight mt-1.5`}>
                                            {item.amount}
                                        </h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* LATEST PAYMENTS MODERN LIGHT TABLE */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-bold text-slate-800">Transaksi Terakhir</h2>
                            <span className="text-xs text-slate-400 font-medium">Menampilkan 3 entri teratas</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-xs md:text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                                        <th className="pb-3 pr-4">Nama Siswa</th>
                                        <th className="pb-3 px-4">Jumlah Nominal</th>
                                        <th className="pb-3 pl-4 text-center">Status Pembayaran</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-50">
                                    {[
                                        { name: "Ahmad Fauzi", amount: "Rp 500.000", status: "PAID", style: "bg-emerald-50 text-emerald-600 border-emerald-100" },
                                        { name: "Nabila Putri", amount: "Rp 750.000", status: "PENDING", style: "bg-amber-50 text-amber-600 border-amber-100" },
                                        { name: "Rizky Maulana", amount: "Rp 650.000", status: "OVERDUE", style: "bg-rose-50 text-rose-600 border-rose-100" }
                                    ].map((row, index) => (
                                        <tr key={index} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="py-3.5 pr-4 text-slate-700 font-semibold flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                    {row.name.charAt(0)}
                                                </div>
                                                {row.name}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-600 font-medium font-mono">{row.amount}</td>
                                            <td className="py-3.5 pl-4 text-center">
                                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider border ${row.style}`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;