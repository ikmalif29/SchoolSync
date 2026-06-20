/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  Calendar,
  Award,
  ArrowUpRight,
  Clock,
  GraduationCap,
  Loader2,
  RefreshCw,
  Sparkles,
  LayoutDashboard
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("Guru");
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const teacherId = localStorage.getItem("teacherId") || 1;
  const token = localStorage.getItem("token");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const savedUsername = localStorage.getItem("username");
      if (savedUsername) setUsername(savedUsername);

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
        throw new Error(result.message || "Gagal sinkronisasi data dashboard.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalClasses = new Set(schedules.map(s => s.subjectId)).size;
  const totalStudents = schedules.reduce((acc, curr) => acc + (curr.studentIds?.length || 0), 0);
  const totalSchedules = schedules.length;

  const stats = [
    { id: 1, name: "Kelas Unik", value: `${totalClasses} Kelas`, icon: BookOpen, color: "from-indigo-500 to-blue-600", bg: "bg-indigo-500/10" },
    { id: 2, name: "Siswa Dibimbing", value: `${totalStudents} Siswa`, icon: Users, color: "from-emerald-500 to-teal-600", bg: "bg-emerald-500/10" },
    { id: 3, name: "Total Jadwal", value: `${totalSchedules} Agenda`, icon: Calendar, color: "from-amber-500 to-orange-600", bg: "bg-amber-500/10" },
    { id: 4, name: "Belum Dinilai", value: "12 Siswa", icon: Award, color: "from-rose-500 to-pink-600", bg: "bg-rose-500/10" },
  ];

  const formatTime = (timeStr) => timeStr ? timeStr.substring(0, 5) : "--:--";

  if (loading) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3 bg-slate-950 text-white rounded-3xl m-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_60%)] animate-pulse" />
      <div className="relative flex items-center justify-center scale-125">
        <Loader2 className="text-indigo-400 animate-spin" size={48} strokeWidth={1.5} />
        <Sparkles className="text-amber-400 absolute animate-bounce" size={16} />
      </div>
      <p className="text-[10px] font-black tracking-widest text-indigo-300/60 uppercase animate-pulse mt-2">
        Mengompilasi Data Akademik
      </p>
    </div>
  );

  if (error) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center gap-4 bg-white border border-slate-100 rounded-3xl shadow-2xl max-w-md mx-auto my-12 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-inner animate-bounce">
        <RefreshCw size={28} />
      </div>
      <div>
        <h3 className="text-base font-black text-slate-900 tracking-tight">Koneksi Batas Sistem Gagal</h3>
        <p className="text-xs text-slate-400 mt-1 px-4">{error}</p>
      </div>
      <button onClick={fetchDashboardData} className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-slate-900 to-slate-800 text-white rounded-xl text-xs font-bold hover:shadow-lg active:scale-95 transition-all">
        Sikronkan Ulang Node
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-6 text-slate-800 animate-in fade-in duration-500">
      
      {/* ================= 1. HERO GRADIENT GLASS BANNER ================= */}
      <div className="relative bg-linear-to-br from-indigo-950 via-slate-900 to-black text-white rounded-3xl p-6 md:p-8 shadow-xl overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-indigo-600/30 transition-all duration-700" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
        
        <div className="z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-black tracking-wider text-indigo-200 uppercase">
            <LayoutDashboard size={12} className="animate-pulse" /> Live System Monitor
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-none">
            Selamat Datang, <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400">{username.split("@")[0]}</span>! 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium max-w-xl leading-relaxed">
            Sistem mendeteksi <span className="text-indigo-300 font-bold">{totalSchedules} kelas aktif</span> berdedikasi tinggi untuk agenda edukasi Anda hari ini.
          </p>
        </div>
        
        <div className="z-10 text-[10px] font-black tracking-widest uppercase px-4 py-2.5 bg-white/5 backdrop-blur-lg text-indigo-200 rounded-2xl border border-white/10 shadow-lg">
          Semester Ganjil • 2026/2027
        </div>
      </div>

      {/* ================= 2. INTERACTIVE STATS CARD ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.id}
              style={{ animationDelay: `${idx * 70}ms` }}
              className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-center justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group animate-in slide-in-from-bottom-4"
            >
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.name}</p>
                <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bg} bg-clip-border p-3.5 rounded-2xl border border-slate-50 group-hover:bg-linear-to-br ${stat.color} group-hover:text-white transition-all duration-300 shadow-2xs group-hover:rotate-6`}>
                <IconComponent size={20} strokeWidth={2.5} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= 3. TWO COLUMN LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LINI MASA TIMELINE (KIRI - GLOW EFFECT) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between min-h-100">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="text-indigo-500 animate-spin-slow" size={18} />
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Lini Masa Mengajar Aktif</h2>
              </div>
              <button onClick={() => navigate("/teacher/schedules")} className="group inline-flex items-center gap-1 text-[11px] text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
                Lihat Semua <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            <div className="relative border-l-2 border-indigo-100 pl-4 ml-2 space-y-4 py-2">
              {schedules.length > 0 ? (
                schedules.slice(0, 3).map((schedule, index) => (
                  <div
                    key={schedule.id || index}
                    className="relative p-4 bg-slate-50 hover:bg-white border border-slate-100 hover:border-indigo-100 rounded-2xl hover:shadow-md transition-all duration-300 group/item"
                  >
                    {/* Bullet Node Glow */}
                    <div className="absolute -left-6.25 top-7 w-3 h-3 bg-indigo-600 rounded-full border-4 border-white ring-4 ring-indigo-50 group-hover/item:scale-125 transition-transform" />
                    
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-black text-slate-900 group-hover/item:text-indigo-600 transition-colors">{schedule.subjectName}</h4>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">
                          HARI {schedule.dayOfWeek} • <span className="text-slate-600">{schedule.studentIds?.length || 0} Siswa</span>
                        </p>
                      </div>
                      <div className="text-xs font-mono font-black bg-white px-3 py-1.5 border border-slate-100 text-slate-700 rounded-xl shadow-3xs group-hover/item:bg-indigo-950 group-hover/item:text-white group-hover/item:border-indigo-950 transition-all">
                        {formatTime(schedule.startTime)} WIB
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  Belum ada jadwal mengajar terdaftar pada sistem.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button onClick={fetchDashboardData} className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest text-slate-400 hover:text-indigo-600 uppercase transition-colors">
              <RefreshCw size={12} className="hover:rotate-180 transition-transform duration-500" /> Sinkronisasi Real-Time
            </button>
          </div>
        </div>

        {/* AKSES CEPAT (KANAN) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <h2 className="text-xs font-black text-slate-900 pb-3 border-b border-slate-100 uppercase tracking-widest">Akses Navigasi</h2>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl text-xs font-black transition-all shadow-md hover:shadow-xl active:scale-98 group">
                <div className="flex items-center gap-2.5">
                  <GraduationCap size={18} />
                  <span>Kelola & Input Nilai Siswa</span>
                </div>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button onClick={() => navigate("/admin/schedules")} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100 rounded-2xl text-xs font-black transition-all active:scale-98 group">
                <div className="flex items-center gap-2.5 text-slate-800">
                  <Calendar size={18} className="text-slate-500" />
                  <span>Atur Jadwal Pelajaran</span>
                </div>
                <ArrowUpRight size={14} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </button>
            </div>
          </div>

          <div className="p-4 bg-linear-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10 rounded-2xl text-[11px] font-semibold text-slate-500 leading-relaxed relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 text-indigo-500/10 pointer-events-none transform rotate-12">
              <Sparkles size={64} />
            </div>
            💡 <strong className="text-slate-700">Tips Arsitektur:</strong> Total data murid dihitung secara dinamis via agregasi relasi ID backend berbasis kluster microservice.
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;