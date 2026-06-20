
import { Outlet } from "react-router-dom";
import StudentHeader from "./StudentHeader";
import StudentFooter from "./StudentFooter";

const StudentLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50/30">
            <StudentHeader />
            <main className="flex-1">
                <Outlet /> {/* Ini tempat halaman Dashboard, Raport, dll akan dirender */}
            </main>
            <StudentFooter />
        </div>
    );
};

export default StudentLayout;