/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  User, Mail, Phone, MapPin, BookOpen, FileText,
  Loader2, RefreshCw, Copy, Check, Sparkles, Compass, Shield, Award
} from "lucide-react";

const TeacherProfile = () => {
  const [profile, setProfile] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("personal");
  const [copied, setCopied] = useState(false);

  const email = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const teacherId = localStorage.getItem("teacherId") || 1;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const profileRes = await fetch(`http://localhost:8098/teacherSvc/api/teacher/get-teacher-by-email/${email}`, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      });
      const profileResult = await profileRes.json();
      
      if (!profileRes.ok || !profileResult.data) {
        throw new Error(profileResult.message || "Gagal memuat profil guru.");
      }
      setProfile(profileResult.data);

      const scheduleRes = await fetch(`http://localhost:8098/subjectSvc/api/schedules/teacher/${teacherId}`, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      });
      const scheduleResult = await scheduleRes.json();

      if (scheduleRes.ok && scheduleResult.data) {
        setSchedules(scheduleResult.data);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => { 
    if (email) fetchData(); 
  }, [email]);

  const handleCopyNip = (nipText) => {
    if (!nipText) return;
    navigator.clipboard.writeText(nipText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hoursPerSchedule = 4;
  const currentHours = schedules.length * hoursPerSchedule;
  const maxHours = 24;
  const progressPercentage = Math.min((currentHours / maxHours) * 100, 100);
  const init = profile?.fullName?.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  if (loading) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3 bg-slate-950 text-white rounded-3xl m-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12),transparent_60%)] animate-pulse" />
      <div className="relative flex items-center justify-center scale-125">
        <Loader2 className="text-indigo-400 animate-spin" size={48} strokeWidth={1.5} />
        <Sparkles className="text-amber-400 absolute animate-pulse" size={16} />
      </div>
      <p className="text-[10px] font-black tracking-widest text-indigo-300/60 uppercase animate-pulse mt-2">
        Synchronizing Credentials
      </p>
    </div>
  );

  if (error) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center gap-4 bg-white border border-slate-100 rounded-3xl shadow-2xl max-w-md mx-auto my-12 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-inner animate-bounce">
        <Compass size={28} />
      </div>
      <div>
        <h3 className="text-base font-black text-slate-900 tracking-tight">Gagal Menghubungkan Profil</h3>
        <p className="text-xs text-slate-400 mt-1 px-4">{error}</p>
      </div>
      <button onClick={fetchData} className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-slate-900 to-slate-800 text-white rounded-xl text-xs font-bold hover:shadow-lg active:scale-95 transition-all">
        <RefreshCw size={13} /> Sinkronisasi Ulang
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6 text-slate-800 animate-in fade-in duration-500">

      {/* ================= HERO DARK ELEGANT CARD ================= */}
      <div className="relative bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 overflow-hidden shadow-xl group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-indigo-600/20 transition-all duration-700" />
        <div className="absolute -bottom-10 left-1/4 w-52 h-52 bg-purple-600/10 rounded-full blur-3xl" />

        {/* Avatar Pro Cluster */}
        <div className="relative p-1 bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:rotate-1">
          <div className="w-24 h-24 md:w-28 md:h-28 bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white font-black text-4xl tracking-tight relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/40" />
            <span className="z-10 bg-clip-text text-transparent bg-linear-to-r from-white via-slate-200 to-slate-400">{init}</span>
            <span className="z-10 text-[8px] font-black tracking-widest text-indigo-300 bg-indigo-500/10 px-2 py-0.5 border border-indigo-500/20 rounded-md uppercase mt-1.5 scale-90">VERIFIED</span>
          </div>
        </div>

        {/* Identity Information */}
        <div className="space-y-3 text-center md:text-left flex-1 z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-2.5 justify-center md:justify-start">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-slate-100 to-slate-300">
              {profile?.fullName}
            </h1>
            <span className="inline-flex self-center px-3 py-1 text-[9px] font-black bg-white/10 backdrop-blur-md text-emerald-400 border border-white/5 rounded-full uppercase tracking-wider">
              ● {profile?.status}
            </span>
          </div>

          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-lg px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors group/nip">
            <Shield size={12} className="text-indigo-400" />
            <p className="text-xs font-black font-mono text-slate-300">NIP. {profile?.nip}</p>
            <button
              onClick={() => handleCopyNip(profile?.nip)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5"
              title="Salin NIP"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} className="group-hover/nip:scale-110 transition-transform" />}
            </button>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-xl text-xs font-black">
              <BookOpen size={13} /> Expertise Line #{profile?.subjectId}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/5 text-slate-300 rounded-xl text-xs font-bold">
              <User size={13} className="text-slate-400" /> Gender ({profile?.gender})
            </span>
          </div>
        </div>
      </div>

      {/* ================= TABS NAVIGATION ================= */}
      <div className="flex bg-slate-200/50 backdrop-blur-md p-1 border border-slate-200/40 rounded-2xl gap-1 max-w-xs shadow-inner">
        {[
          { id: "personal", label: "Data Pribadi", icon: User },
          { id: "document", label: "Berkas Kerja", icon: FileText }
        ].map((t) => {
          const Icon = t.icon;
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-black rounded-xl cursor-pointer transition-all duration-300 ${isSelected
                  ? "bg-white text-indigo-600 shadow-md border border-slate-200/10"
                  : "text-slate-500 hover:text-slate-900"
                }`}
            >
              <Icon size={14} strokeWidth={2.5} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ================= MAIN CONTENT GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

        {/* LEFT PROFILE CONTAINER */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between min-h-85">
          {activeTab === "personal" ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Informasi Kontak & Domisili</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-100 hover:bg-white transition-all duration-300 group/item hover:shadow-md">
                  <div className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl group-hover/item:text-indigo-600 group-hover/item:border-indigo-100 shadow-3xs transition-all group-hover/item:rotate-3">
                    <Mail size={16} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">E-Mail Resmi</p>
                    <p className="text-xs font-black text-slate-900 truncate mt-0.5">{profile?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-100 hover:bg-white transition-all duration-300 group/item hover:shadow-md">
                  <div className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl group-hover/item:text-indigo-600 group-hover/item:border-indigo-100 shadow-3xs transition-all group-hover/item:rotate-3">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kontak Telepon</p>
                    <p className="text-xs font-black text-slate-900 font-mono tracking-wide mt-0.5">{profile?.phoneNumber}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-100 hover:bg-white transition-all duration-300 group/item hover:shadow-md">
                <div className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl group-hover/item:text-indigo-600 group-hover/item:border-indigo-100 shadow-3xs transition-all group-hover/item:rotate-3 mt-0.5">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Alamat Domisili</p>
                  <p className="text-xs font-bold text-slate-700 mt-1 leading-relaxed">{profile?.address}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs font-bold space-y-3 my-auto animate-in fade-in duration-300">
              <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 mx-auto shadow-inner">
                <FileText size={22} />
              </div>
              <p className="tracking-wide text-slate-400">Belum ada dokumen penunjang akademik terunggah.</p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button onClick={fetchData} className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest text-slate-400 hover:text-indigo-600 uppercase transition-colors group/ref">
              <RefreshCw size={12} className="group-hover/ref:rotate-180 transition-transform duration-500" /> Perbarui Data Profil
            </button>
          </div>
        </div>

        {/* RIGHT METRICS SYSTEM */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-5">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Aktivitas Mengajar</h3>

          <div className="space-y-4">
            {/* Elegant Total Agenda Box */}
            <div className="p-5 bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white rounded-2xl space-y-1 shadow-md relative overflow-hidden group/box">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover/box:scale-150 transition-transform duration-500" />
              <div className="absolute right-4 top-4 opacity-20 group-hover/box:opacity-40 transition-opacity">
                <Award size={36} strokeWidth={1.5} />
              </div>
              <p className="text-[9px] font-black opacity-70 uppercase tracking-widest">Total Node Agenda</p>
              <p className="text-lg font-black tracking-tight">{schedules.length} Jadwal Mengajar</p>
            </div>

            {/* Dynamic SKS Loading Matrix */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3.5">
              <div className="flex justify-between items-center text-xs font-black text-slate-800">
                <span>Beban Kerja SKS</span>
                <span className="text-indigo-600 font-mono bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100/30">{currentHours} / {maxHours} Jam</span>
              </div>
              
              <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden p-0.5">
                <div 
                  style={{ width: `${progressPercentage}%` }}
                  className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 shadow-xs"
                />
              </div>

              <p className="text-[10px] font-semibold text-slate-400 leading-relaxed">
                {progressPercentage >= 100 
                  ? "✓ Beban mengajar optimal terisi penuh untuk periode semester ganjil ini." 
                  : `Matriks kapasitas terisi ${progressPercentage.toFixed(0)}% dari batas maksimum reguler mingguan.`}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeacherProfile;