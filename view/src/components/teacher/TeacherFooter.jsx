import { ShieldCheck, Sparkles } from "lucide-react";

const TeacherFooter = () => {
  return (
    <footer className="bg-white border-t border-slate-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          
          {/* LEFT CONTENT */}
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3">
            <div className="flex items-center gap-1.5 font-black text-slate-800 text-xs tracking-tight">
              <div className="bg-indigo-50 p-1 rounded-md text-indigo-600">
                <Sparkles size={12} />
              </div>
              SchoolSync
            </div>
            <span className="hidden sm:inline text-slate-200">|</span>
            <p className="text-[11px] font-bold text-slate-400">
              &copy; {new Date().getFullYear()} All Rights Reserved. Sinkronisasi Data & Manajemen Akademik Efisien.
            </p>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex items-center gap-4 text-[11px] font-black text-slate-400">
            <span className="hover:text-slate-800 cursor-pointer transition-colors">Bantuan</span>
            <span className="hover:text-slate-800 cursor-pointer transition-colors">Privasi</span>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/5 text-emerald-600 border border-emerald-500/10 rounded-lg">
              <ShieldCheck size={12} strokeWidth={2.5} />
              <span className="font-sans text-[10px] uppercase tracking-wider font-black">Secure Gateway</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default TeacherFooter;