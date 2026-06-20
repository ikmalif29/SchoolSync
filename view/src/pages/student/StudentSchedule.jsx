import { useState, useEffect } from "react";
import { 
  Calendar, Clock, BookOpen, User, AlertCircle, 
  CheckCircle2,  Sparkles 
} from "lucide-react";

const StudentSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDay, setCurrentDay] = useState("");

  // Definisi kedua Base URL layanan microservice milikmu
  const STUDENT_SVC_URL = "http://localhost:8098/studentSvc/api/students";
  const SUBJECT_SVC_URL = "http://localhost:8098/subjectSvc/api/schedules";

  useEffect(() => {
    const fetchProfileAndSchedule = async () => {
      try {
        setLoading(true);
        
        // 1. Ambil data autentikasi dasar dari localStorage
        const savedEmail = localStorage.getItem("username");
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Sesi Anda telah habis. Silakan login kembali.");
        }

        // 2. Dapatkan nama hari ini otomatis format UPPERCASE (e.g., FRIDAY)
        const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        const todayName = days[new Date().getDay()];
        setCurrentDay(todayName);

        // ================= STEP 1: FETCH DATA ID STUDENT BY EMAIL =================
        const profileResponse = await fetch(`${STUDENT_SVC_URL}/search?email=${savedEmail}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (profileResponse.status === 401 || profileResponse.status === 403) {
          throw new Error("Hak akses ditolak. Token tidak valid.");
        }

        if (!profileResponse.ok) {
          throw new Error("Gagal mengenali identitas akun siswa.");
        }

        const studentData = await profileResponse.json();
        setStudentInfo(studentData);
        
        // Mengambil ID asli dari response detail profile kamu (studentData.id = 3)
        const fetchedStudentId = studentData.id; 

        // ================= STEP 2: FETCH JADWAL MENGGUNAKAN ID YANG DIDAPAT =================
        const scheduleResponse = await fetch(`${SUBJECT_SVC_URL}/student/${fetchedStudentId}/today?dayOfWeek=${todayName}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!scheduleResponse.ok) {
          throw new Error("Gagal menyinkronkan jadwal pelajaran harian.");
        }

        const scheduleResult = await scheduleResponse.json();
        
        // Membaca wrapper GenericResponse "data" dari Subject Service
        setSchedules(scheduleResult.data || []);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndSchedule();
  }, []);

  // Format tampilan teks hari agar lebih rapi (e.g., FRIDAY -> Jumat)
  const formatDayId = (dayInEnglish) => {
    const mapping = {
      MONDAY: "Senin", TUESDAY: "Selasa", WEDNESDAY: "Rabu",
      THURSDAY: "Kamis", FRIDAY: "Jumat", SATURDAY: "Sabtu", SUNDAY: "Minggu"
    };
    return mapping[dayInEnglish] || dayInEnglish;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Menghubungkan Antar Microservice...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/40 p-4 md:p-8 space-y-6 animate-fade-in">
      
      {/* ================= 1. DYNAMIC HEADER BOARD ================= */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300">
              <Sparkles size={12} className="animate-spin" /> Kelas Aktif: {studentInfo?.className || "-"}
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">
              Jadwal Kuliah: {studentInfo?.fullName}
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Data sinkron otomatis berdasarkan NIM/NIS <span className="text-indigo-400 font-bold">{studentInfo?.nis}</span> terdaftar.
            </p>
          </div>

          {/* Badge Hari Aktif */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3 self-start sm:self-center">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md">
              <Calendar size={18} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-wider leading-none">Hari Ini</p>
              <span className="text-base font-black tracking-wide text-white">{formatDayId(currentDay)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. TIMELINE SCHEDULE LIST ================= */}
      <div className="max-w-4xl mx-auto space-y-4">
        {error ? (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 p-5 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-xs">
            <AlertCircle size={16} className="shrink-0" />
            <span>Gagal memproses data: {error}</span>
          </div>
        ) : schedules.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3 shadow-xs">
            <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-700">Tidak Ada Jadwal Kuliah</h3>
              <p className="text-xs text-slate-400 font-medium">Hari ini Anda bebas dari kelas tatap muka. Selamat beristirahat!</p>
            </div>
          </div>
        ) : (
          schedules.map((item) => (
            <div 
              key={item.id} 
              className="bg-white border border-slate-200/80 hover:border-indigo-200 rounded-2xl p-5 md:p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 group relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-linear-to-b from-indigo-500 to-violet-600"></div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pl-2">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 px-3.5 py-2 rounded-xl text-slate-700 font-mono text-xs font-black shadow-inner shrink-0 self-start sm:self-center">
                  <Clock size={14} className="text-indigo-600" />
                  {item.startTime.substring(0, 5)} WIB
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">
                    Subject ID: #{item.subjectId}
                  </span>
                  <h3 className="text-base font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {item.subjectName}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <User size={13} />
                    <span className={item.teacherName.includes("Error") ? "text-rose-500/80 font-medium" : "text-slate-500"}>
                      {item.teacherName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 pl-2 md:pl-0 gap-4">
                <div className="text-left md:text-right">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Rekan Sekelas</span>
                  <div className="flex items-center gap-1 text-xs font-black text-slate-700">
                    <BookOpen size={13} className="text-slate-400" />
                    <span>{item.studentIds?.length || 0} Mahasiswa Terdaftar</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentSchedule;