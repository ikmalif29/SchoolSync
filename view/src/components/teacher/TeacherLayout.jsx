
import { Outlet } from "react-router-dom";
import TeacherHeader from "./TeacherHeader";
import TeacherFooter from "./TeacherFooter";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/40">
      {/* Header Premium Tetap di Atas */}
      <TeacherHeader />
      
      {/* Konten Halaman Utama */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        <Outlet />
      </main>
      
      {/* Footer Bersih di Paling Bawah */}
      <TeacherFooter />
    </div>
  );
};

export default DashboardLayout;