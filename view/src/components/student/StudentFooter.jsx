import { GraduationCap, Heart } from "lucide-react";

const StudentFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* BRAND FOOTER */}
          <div className="flex items-center gap-2">
            <GraduationCap size={15} className="text-indigo-500" strokeWidth={2.5} />
            <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">
              SchoolSync — Universitas Nasional Pasim
            </span>
          </div>

          {/* NAVIGATION LINKS SHORTCUT */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-bold text-slate-400">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors">Panduan Akademik</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors">Syarat & Ketentuan</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors">Pusat Bantuan</span>
          </div>

          {/* COPYRIGHT */}
          <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <span>© {currentYear} SchoolSync. Crafted with</span>
            <Heart size={11} className="text-rose-500 fill-rose-500 animate-pulse" />
            <span>Dev Team.</span>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default StudentFooter;