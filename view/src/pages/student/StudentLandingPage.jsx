/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import {
    BookOpen, Calendar, Award, GraduationCap, ArrowRight,
    Sparkles, Bell, Clock, MapPin, ChevronRight, CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentLandingPage = () => {
    const navigate = useNavigate();
    const [studentName, setStudentName] = useState("Siswa");
    const [currentTime, setCurrentTime] = useState(new Date());

    // Simulasi pengambilan data login siswa dari localStorage
    useEffect(() => {
        const savedName = localStorage.getItem("username") || "Ikmal Fauzaeni";
        setStudentName(savedName.split("@")[0]);

        // Live Clock Efek
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Format Waktu Riil Indonesia
    const formatDate = (date) => {
        return date.toLocaleDateString("id-ID", {
            weekday: "long", year: "numeric", month: "long", day: "numeric"
        });
    };

    // Mock Data Ringkasan Akademik Siswa
    const academicSummaries = [
        { id: 1, title: "Kehadiran Bulan Ini", value: "98%", status: "Sangat Baik", color: "text-emerald-600", bg: "bg-emerald-50" },
        { id: 2, title: "Tugas Terbuka", value: "2 Amalan", status: "Batas Waktu: Besok", color: "text-amber-600", bg: "bg-amber-50" },
        { id: 3, title: "Rata-Rata Nilai", value: "89.5", status: "Peringkat Atas", color: "text-indigo-600", bg: "bg-indigo-50" },
    ];

    // Mock Data Jadwal Hari Ini Khusus Siswa
    const todayClasses = [
        { id: 1, time: "07:30 - 09:00", subject: "Rekayasa Perangkat Lunak", teacher: "Ikmal Fauzaeni (Guru)", room: "Lab Komputer 03", status: "SELESAI" },
        { id: 2, time: "09:15 - 10:45", subject: "Bahasa Inggris", teacher: "Ikmal Fauzaeni (Guru)", room: "Ruang Teori 102", status: "BERLANGSUNG" },
        { id: 3, time: "11:00 - 12:30", subject: "Matematika Dasar", teacher: "Drs. Mulyadi", room: "Ruang Teori 104", status: "MENDATANG" },
    ];

    return (
        <div className="min-h-screen bg-slate-50/40 p-4 md:p-8 space-y-10 animate-fade-in">

            {/* ================= 1. PREMIUM HERO SECTION ================= */}
            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 text-white overflow-hidden shadow-xl group">
                {/* Glow Ambient Lights Efek */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300">
                            <Sparkles size={12} className="animate-pulse" /> Student Portal Akademik
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none">
                            Selamat Datang Kembali, <br className="hidden md:inline" />
                            <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{studentName}</span>! 🎓
                        </h1>
                        <p className="text-xs md:text-sm text-slate-400 max-w-xl font-medium">
                            Akses materi pembelajaran, unggah tugas mingguan, dan pantau perkembangan nilai rapor akhir semestermu secara transparan.
                        </p>
                    </div>

                    {/* Jam & Kalender Digital Widget */}
                    <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl text-right font-sans space-y-1 self-start md:self-auto min-w-50">
                        <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-indigo-300">
                            <Clock size={13} /> {currentTime.toLocaleTimeString("id-ID")} WIB
                        </div>
                        <p className="text-sm font-black text-white">{formatDate(currentTime)}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pt-1 border-t border-white/5">Tahun Ajaran 2026/2027</p>
                    </div>
                </div>
            </div>

            {/* ================= 2. ACADEMIC HIGHLIGHT CARDS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                {academicSummaries.map((summary, idx) => (
                    <div
                        key={summary.id}
                        style={{ animationDelay: `${idx * 100}ms` }}
                        className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs flex items-center justify-between group hover:shadow-md hover:border-indigo-100 transition-all duration-300 animate-slide-up"
                    >
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{summary.title}</p>
                            <p className={`text-xl md:text-2xl font-black ${summary.color}`}>{summary.value}</p>
                            <p className="text-[11px] font-semibold text-slate-400">{summary.status}</p>
                        </div>
                        <div className={`${summary.bg} ${summary.color} p-3 rounded-xl shadow-2xs group-hover:scale-105 transition-transform`}>
                            {summary.id === 1 && <CheckCircle2 size={18} />}
                            {summary.id === 2 && <Bell size={18} />}
                            {summary.id === 3 && <Award size={18} />}
                        </div>
                    </div>
                ))}
            </div>

            {/* ================= 3. TWO COLUMN: SCHEDULES & AMBIENT GALLERY ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* JADWAL KELAS HARI INI (KIRI) */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <Calendar className="text-slate-400" size={16} />
                            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Agenda Pelajaran Hari Ini</h2>
                        </div>
                        <span className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer">Semua Jadwal</span>
                    </div>

                    <div className="space-y-4">
                        {todayClasses.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/60 border border-slate-200/60 rounded-2xl hover:border-indigo-200 hover:bg-white transition-all duration-300 group/item gap-3"
                            >
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-xs font-black text-slate-900 group-hover/item:text-indigo-600 transition-colors">{item.subject}</h4>
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${item.status === "BERLANGSUNG" ? "bg-amber-100 text-amber-700 animate-pulse" :
                                            item.status === "SELESAI" ? "bg-slate-200 text-slate-600" : "bg-indigo-50 text-indigo-700"
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className="text-[11px] font-medium text-slate-400 flex items-center gap-4">
                                        <span className="flex items-center gap-1"><GraduationCap size={12} /> {item.teacher}</span>
                                        <span className="flex items-center gap-1"><MapPin size={11} /> {item.room}</span>
                                    </p>
                                </div>
                                <div className="text-xs font-mono font-black bg-white px-3 py-1.5 border border-slate-200/80 text-slate-700 rounded-xl shadow-2xs self-start sm:self-auto">
                                    {item.time}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FOTO SEKOLAH REALISTIK & AKSES CEPAT (KANAN) */}
                <div className="space-y-6">

                    {/* Foto Sekolah Komponen */}
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs group/img">
                        <div className="relative h-44 w-full bg-slate-200 overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80"
                                alt="Gedung Kampus Utama"
                                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                            <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg text-[10px] font-bold">
                                <MapPin size={10} /> Gedung Utama Kampus
                            </span>
                        </div>
                        <div className="p-4 space-y-1">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Universitas Nasional Pasim</h3>
                            <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                                Lingkungan belajar modern berbasis teknologi informasi yang berlokasi di pusat kota Bandung.
                            </p>
                        </div>
                    </div>

                    {/* Akses Navigasi Cepat */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-50">Navigasi Siswa</h3>

                        <button
                            onClick={() => navigate("/student/schedules")}
                            className="w-full flex items-center justify-between p-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs group cursor-pointer"
                        >
                            <div className="flex items-center gap-2">
                                <BookOpen size={15} />
                                <span>Lihat Jadwal Mengajar Guru</span>
                            </div>
                            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>

                        <button
                            className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60 rounded-xl text-xs font-bold transition-all group cursor-pointer"
                        >
                            <div className="flex items-center gap-2 text-slate-600">
                                <Award size={15} />
                                <span>Lihat Transkrip Nilas Rapot</span>
                            </div>
                            <ChevronRight size={13} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default StudentLandingPage;