/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
    Calendar, Clock, BookOpen, Users, ArrowRight,
    Search, RefreshCw, Loader2, CalendarDays, Sparkles, CheckCircle2, Bookmark
} from "lucide-react";

const TeacherSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDay, setSelectedDay] = useState("ALL");

    const teacherId = localStorage.getItem("teacherId") || 1;
    const token = localStorage.getItem("token");

    const fetchSchedules = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await fetch(`http://localhost:8098/subjectSvc/api/schedules/teacher/${teacherId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const result = await res.json();

            if (res.ok && result.data) {
                setSchedules(result.data);
            } else {
                throw new Error(result.message || "Gagal memuat data jadwal mengajar.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const daysList = ["ALL", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

    const filteredSchedules = schedules.filter(item => {
        const matchesDay = selectedDay === "ALL" || item.dayOfWeek.toUpperCase() === selectedDay;
        const matchesSearch = item.subjectName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDay && matchesSearch;
    });

    const formatTime = (timeStr) => {
        if (!timeStr) return "--:--";
        return timeStr.substring(0, 5);
    };

    if (loading) return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3 bg-slate-950 text-white rounded-3xl m-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12),transparent_60%)] animate-pulse" />
            <div className="relative flex items-center justify-center scale-125">
                <Loader2 className="text-indigo-400 animate-spin" size={48} strokeWidth={1.5} />
                <Calendar className="text-purple-400 absolute animate-pulse" size={16} />
            </div>
            <p className="text-[10px] font-black tracking-widest text-indigo-300/60 uppercase animate-pulse mt-2">
                Synchronizing Academic Nodes...
            </p>
        </div>
    );

    if (error) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center gap-4 bg-white border border-slate-100 rounded-3xl shadow-2xl max-w-md mx-auto my-12 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-inner animate-bounce">
                <CalendarDays size={28} />
            </div>
            <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Gagal Sinkronisasi Jadwal</h3>
                <p className="text-xs text-slate-400 mt-1 px-4">{error}</p>
            </div>
            <button onClick={fetchSchedules} className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-slate-900 to-slate-800 text-white rounded-xl text-xs font-bold hover:shadow-lg active:scale-95 transition-all">
                <RefreshCw size={13} /> Muat Ulang Jadwal
            </button>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6 text-slate-800 animate-in fade-in duration-500">

            {/* ================= HEADER CONTROL PANEL ================= */}
            <div className="relative bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-hidden shadow-xl group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -mr-20 -mt-20" />

                <div className="space-y-1.5 z-10">
                    <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black tracking-widest uppercase">
                        <Sparkles size={12} className="text-amber-400 animate-pulse" /> Live Scheduler Matrix
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-slate-100 to-slate-300">
                        Jadwal Mengajar <span className="text-indigo-400">Guru</span>
                    </h1>
                    <p className="text-xs font-medium text-slate-400 max-w-md">
                        Sistem distribusi kelas riil terintegrasi otomatis dengan pangkalan data presensi siswa.
                    </p>
                </div>

                {/* Dynamic Search Bar Component */}
                <div className="relative w-full sm:w-72 z-10">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors" size={14} />
                    <input
                        type="text"
                        placeholder="Cari Mata Pelajaran..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs font-bold pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-hidden focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-500 text-white"
                    />
                </div>
            </div>

            {/* ================= FILTER PILLS SYSTEM ================= */}
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none snap-x">
                {daysList.map((day) => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-xs font-black tracking-wide uppercase transition-all duration-300 cursor-pointer snap-className ${selectedDay === day
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 -translate-y-px"
                            : "bg-white text-slate-500 border border-slate-200/60 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300"
                            }`}
                    >
                        {day === "ALL" ? "✨ Semua Hari" : day}
                    </button>
                ))}
            </div>

            {/* ================= INTERACTIVE SCHEDULE GRID ================= */}
            {filteredSchedules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSchedules.map((schedule, idx) => (
                        <div
                            key={schedule.id}
                            style={{ animationDelay: `${idx * 50}ms` }}
                            className="group relative bg-white border border-slate-100 rounded-3xl p-6 overflow-hidden shadow-xs hover:shadow-xl hover:border-indigo-100 transition-all duration-500 flex flex-col justify-between animate-in fade-in slide-in-from-bottom-4"
                        >
                            {/* Premium Glow Aura Layer */}
                            <div className="absolute top-0 right-0 w-36 h-36 bg-linear-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-125 transition-transform duration-700" />

                            {/* Upper Node Cluster */}
                            <div className="space-y-4 z-10 relative">
                                <div className="flex justify-between items-center">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100/30 text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-3xs">
                                        <CalendarDays size={11} strokeWidth={2.5} /> {schedule.dayOfWeek}
                                    </span>

                                    <div className="flex items-center gap-1.5 text-slate-700 font-mono text-xs font-black bg-slate-50 border border-slate-200/50 px-2.5 py-1 rounded-xl shadow-3xs">
                                        <Clock size={11} className="text-indigo-500" />
                                        {formatTime(schedule.startTime)} WIB
                                    </div>
                                </div>

                                {/* Core Informatics Section */}
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-linear-to-br from-indigo-600 to-indigo-700 text-white rounded-xl shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                                        <BookOpen size={18} strokeWidth={2} />
                                    </div>
                                    <div className="space-y-0.5 flex-1 min-w-0">
                                        <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors truncate">
                                            {schedule.subjectName}
                                        </h3>
                                        <p className="text-[10px] font-bold text-slate-400 font-mono tracking-wider flex items-center gap-1">
                                            <Bookmark size={10} className="text-slate-300" /> CODE ID: #{schedule.subjectId}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Laser Cut Divider Line */}
                            <div className="border-t border-dashed border-slate-100 my-5 group-hover:border-indigo-100/60 transition-colors" />

                            {/* Lower Control Cluster */}
                            <div className="space-y-4 z-10 relative">
                                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl group-hover:bg-indigo-50/30 transition-colors">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-2 bg-white border border-slate-100 text-slate-400 rounded-lg shadow-3xs">
                                            <Users size={13} className="group-hover:text-indigo-600 transition-colors" strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kapasitas</p>
                                            <p className="text-xs font-black text-slate-800">{schedule.studentIds?.length || 0} Mahasiswa</p>
                                        </div>
                                    </div>

                                    {/* Anti-Overlap Profile Stack Bubble */}
                                    <div className="flex -space-x-1.5 overflow-hidden">
                                        {schedule.studentIds?.slice(0, 3).map((id, i) => (
                                            <div key={i} className="inline-flex h-6 w-6 rounded-full bg-slate-100 border-2 border-white items-center justify-center text-[8px] font-black text-slate-500 font-mono shadow-3xs">
                                                {id}
                                            </div>
                                        ))}
                                        {schedule.studentIds?.length > 3 && (
                                            <div className="inline-flex h-6 w-6 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 border-2 border-white items-center justify-center text-[8px] font-black text-white shadow-3xs">
                                                +{schedule.studentIds.length - 3}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Gateway Action Trigger */}
                                <button className="w-full flex items-center justify-center gap-2 py-3 bg-linear-to-r from-slate-950 to-slate-900 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl text-xs font-black tracking-wide shadow-xs hover:shadow-lg hover:shadow-indigo-600/10 transition-all duration-300 group-hover:scale-[1.01] active:scale-95 cursor-pointer">
                                    Mulai Sesi Kelas <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            ) : (
                /* Empty State Data Filter */
                <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-sm mx-auto space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 mx-auto shadow-inner">
                        <CheckCircle2 size={24} className="text-slate-300" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-black text-slate-900 tracking-tight">Tidak Ada Jadwal Mengajar</h4>
                        <p className="text-xs text-slate-400 px-2 leading-relaxed">
                            Query pencarian atau filter hari tidak cocok dengan parameter jadwal aktif Anda.
                        </p>
                    </div>
                    <button
                        onClick={() => { setSelectedDay("ALL"); setSearchQuery(""); }}
                        className="inline-block text-xs font-black text-indigo-600 hover:text-indigo-700 underline tracking-wide cursor-pointer decoration-2 underline-offset-4"
                    >
                        Reset Parameter Filter
                    </button>
                </div>
            )}

        </div>
    );
};

export default TeacherSchedule;