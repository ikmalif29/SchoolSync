/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/SidebarAdmin"; 

import { Menu, Plus, Users, Search, Loader2, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, X, ShieldCheck, Calendar, Phone, Mail, MapPin, Award, GraduationCap, CheckCircle2, AlertCircle } from "lucide-react";

const StudentManagement = () => {
    const token = localStorage.getItem("token");
    const BASE_URL = "http://localhost:8098/studentSvc/api/students";

    // UI States
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [modals, setModals] = useState({ create: false, update: false, delete: false, detail: false });
    
    // Toast Notification State
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    
    // Data States
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0, last: true });

    const initialFormState = {
        nis: "", fullName: "", gender: "", birthDate: "", phoneNumber: "",
        email: "", address: "", className: "", major: "", parentName: "", parentPhone: ""
    };
    const [formData, setFormData] = useState(initialFormState);

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    const toggleModal = (type, isOpen, student = null) => {
        setModals(prev => ({ ...prev, [type]: isOpen }));
        if (student) {
            setSelectedStudent(student);
            if (type === "update") setFormData({ ...student });
        }
        if (type === "create" && isOpen) setFormData(initialFormState);
    };

    const getStudents = async (page = 0) => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/get-all-students?page=${page}&size=10`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await response.json();
            setStudents(result?.data?.content || []);
            setPagination({
                page: result?.data?.page || 0,
                totalPages: result?.data?.totalPages || 0,
                totalElements: result?.data?.totalElements || 0,
                last: result?.data?.last ?? true
            });
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { getStudents(); }, []);

    const filteredStudents = students.filter(s =>
        s.nis?.toLowerCase().includes(keyword.toLowerCase()) ||
        s.fullName?.toLowerCase().includes(keyword.toLowerCase())
    );

    const handleFormSubmit = async (e, endpoint, method, successType) => {
        e.preventDefault();
        const url = method === "POST" ? `${BASE_URL}/${endpoint}` : `${BASE_URL}/${endpoint}/${selectedStudent.id}`;
        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: method !== "DELETE" ? JSON.stringify(formData) : undefined
            });
            if (response.ok) {
                toggleModal(successType, false);
                getStudents(method === "DELETE" ? 0 : pagination.page);
                
                // Trigger Custom Toast Notification
                const actionText = method === "POST" ? "ditambahkan" : method === "PUT" ? "diperbarui" : "dihapus";
                showToast(`Data siswa berhasil ${actionText}!`, "success");
            } else {
                showToast(`Gagal: ${await response.text()}`, "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Terjadi kesalahan pada server.", "error");
        }
    };

    return (
        <div className="flex bg-slate-50 min-h-screen text-slate-800 antialiased selection:bg-indigo-500 selection:text-white overflow-x-hidden font-sans relative">
            
            {/* POPUP NOTIFICATION (TOAST) */}
            {toast.show && (
                <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border bg-white shadow-2xl shadow-slate-200/80 animate-fade-in min-w-75 max-w-md">
                    <div className={`p-2 rounded-xl shrink-0 ${toast.type === "success" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
                        {toast.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{toast.type === "success" ? "Success" : "Error Occurred"}</p>
                        <p className="text-sm font-semibold text-slate-700 mt-0.5 truncate">{toast.message}</p>
                    </div>
                    <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <X size={16} />
                    </button>
                </div>
            )}

            <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className="flex-1 min-w-0 flex flex-col transition-all duration-300">
                {/* HEADER BAR */}
                <header className="bg-white/80 border-b border-slate-200/80 backdrop-blur-md px-6 py-4 flex items-center sticky top-0 z-40 shadow-sm shadow-slate-100">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 text-indigo-600 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm">
                        <Menu size={20} />
                    </button>
                </header>

                {/* MAIN CONTENT */}
                <div className="p-4 md:p-8 space-y-6 flex-1 max-w-7xl w-full mx-auto animate-fade-in">
                    
                    {/* BANNER HEADER */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-linear-to-r from-indigo-600 via-indigo-700 to-violet-700 border border-indigo-100 rounded-2xl p-6 shadow-xl shadow-indigo-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/15 transition-all duration-500" />
                        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl" />
                        
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="p-3 bg-white/10 border border-white/20 rounded-xl text-white shadow-inner hidden sm:block">
                                <GraduationCap size={32} className="animate-bounce duration-1000" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-white">Student Management</h1>
                                <p className="text-sm text-indigo-100/80 mt-0.5">Manage and monitor all student digital records seamlessly</p>
                            </div>
                        </div>
                        <button onClick={() => toggleModal("create", true)} className="w-full sm:w-auto relative z-10 bg-white hover:bg-slate-50 text-indigo-600 font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md border border-white cursor-pointer">
                            <Plus size={18} /> Add Student
                        </button>
                    </div>

                    {/* STATISTICS CARD */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300 group">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-indigo-600 transition-colors">Total Students</p>
                                <h2 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{pagination.totalElements}</h2>
                            </div>
                            <div className="bg-indigo-50 p-3.5 rounded-xl text-indigo-600 border border-indigo-100 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                <Users size={22} />
                            </div>
                        </div>
                        {[
                            { title: "Current Page", value: pagination.page + 1, color: "hover:border-emerald-300 text-emerald-600 bg-emerald-50 border-emerald-100" },
                            { title: "Total Pages", value: pagination.totalPages, color: "hover:border-amber-300 text-amber-600 bg-amber-50 border-amber-100" }
                        ].map((item) => (
                            <div key={item.title} className={`bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 group ${item.color}`}>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-inherit transition-colors">{item.title}</p>
                                    <h2 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{item.value}</h2>
                                </div>
                                <div className={`p-3.5 rounded-xl border group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                                    <Calendar size={22} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SEARCH BAR */}
                    <div className="relative max-w-md group">
                        <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input type="text" placeholder="Search by NIS or Name..." value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none shadow-sm" />
                    </div>

                    {/* TABLE AREA */}
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-xs tracking-wider">
                                    <tr>
                                        {["NIS", "Full Name", "Gender", "Class", "Action"].map((h, i) => (
                                            <th key={h} className={`p-4 ${i === 0 ? "pl-6" : ""} ${h === "Action" ? "text-center pr-6" : ""}`}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="p-12 text-center">
                                                <div className="flex flex-col items-center justify-center gap-3">
                                                    <Loader2 className="animate-spin text-indigo-600" size={32} />
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading records...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredStudents.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center p-12 text-slate-400 font-medium bg-slate-50/50">No student records found.</td></tr>
                                    ) : filteredStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-indigo-50/40 transition-colors group">
                                            <td className="p-4 pl-6 font-mono font-bold text-indigo-600 group-hover:text-indigo-700">{student.nis}</td>
                                            <td className="p-4 font-semibold text-slate-900 group-hover:text-indigo-950">{student.fullName}</td>
                                            <td className="p-4 text-slate-600">{student.gender}</td>
                                            <td className="p-4">
                                                <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg text-xs font-bold shadow-sm">{student.className}</span>
                                            </td>
                                            <td className="p-4 pr-6">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => toggleModal("detail", true, student)} className="p-2 bg-slate-50 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 text-slate-500 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer shadow-sm"><Eye size={15} /></button>
                                                    <button onClick={() => toggleModal("update", true, student)} className="p-2 bg-slate-50 border border-slate-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 text-slate-500 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer shadow-sm"><Pencil size={15} /></button>
                                                    <button onClick={() => toggleModal("delete", true, student)} className="p-2 bg-slate-50 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-500 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer shadow-sm"><Trash2 size={15} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* PAGINATION */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 border-t border-slate-200">
                        <p className="text-sm text-slate-500">Showing <span className="text-indigo-600 font-bold">{filteredStudents.length}</span> of <span className="text-slate-900 font-bold">{pagination.totalElements}</span> entries</p>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button disabled={pagination.page === 0} onClick={() => getStudents(pagination.page - 1)} className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:pointer-events-none transition-all hover:bg-slate-50 flex items-center justify-center gap-1 cursor-pointer shadow-sm"><ChevronLeft size={16} /> Previous</button>
                            <button disabled={pagination.last} onClick={() => getStudents(pagination.page + 1)} className="flex-1 sm:flex-none px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500/20 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:pointer-events-none transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-indigo-600/10">Next <ChevronRight size={16} /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* DETAIL MODAL */}
            {modals.detail && selectedStudent && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex justify-center items-center z-50 p-4 transition-all duration-300 animate-fade-in">
                    <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5 relative animate-scale-up">
                        <button onClick={() => toggleModal("detail", false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"><X size={18} /></button>
                        <div className="flex flex-col items-center text-center space-y-3 pt-2">
                            <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner"><Users size={28} /></div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{selectedStudent.fullName}</h2>
                                <p className="text-sm font-mono font-bold text-indigo-600 mt-0.5">{selectedStudent.nis}</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm"><Award size={12} /> {selectedStudent.className}</span>
                                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-md text-xs font-semibold shadow-sm">{selectedStudent.gender}</span>
                            </div>
                        </div>
                        <hr className="border-slate-100" />
                        <div className="space-y-3 text-sm max-h-[40vh] overflow-y-auto pr-1">
                            {[
                                { icon: ShieldCheck, label: "Major Specialization", value: selectedStudent.major, color: "text-purple-500 bg-purple-50 border-purple-100" },
                                { icon: Calendar, label: "Birth Date", value: selectedStudent.birthDate, color: "text-emerald-500 bg-emerald-50 border-emerald-100" },
                                { icon: Phone, label: "Contact Number", value: selectedStudent.phoneNumber, color: "text-blue-500 bg-blue-50 border-blue-100" },
                                { icon: Mail, label: "Email Address", value: selectedStudent.email, mono: true, color: "text-pink-500 bg-pink-50 border-pink-100" },
                                { icon: MapPin, label: "Home Address", value: selectedStudent.address, color: "text-amber-500 bg-amber-50 border-amber-100" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                                    <div className={`p-2 rounded-lg border ${item.color.split(" ")[1]} ${item.color.split(" ")[2]} ${item.color.split(" ")[0]}`}>
                                        <item.icon size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{item.label}</p>
                                        <p className={`text-slate-700 mt-0.5 ${item.mono ? "font-mono text-xs" : "font-semibold"}`}>{item.value || "-"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-linear-to-br from-slate-50 to-indigo-50/30 border border-slate-100 rounded-xl p-3.5 space-y-2 shadow-inner">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-500">Parent / Guardian</h3>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div><p className="text-slate-400 font-semibold">Name</p><p className="text-slate-800 font-bold mt-0.5">{selectedStudent.parentName || "-"}</p></div>
                                <div><p className="text-slate-400 font-semibold">Phone</p><p className="text-slate-800 font-bold mt-0.5">{selectedStudent.parentPhone || "-"}</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CREATE / UPDATE MODAL */}
            {(modals.create || modals.update) && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all duration-300 animate-fade-in">
                    <form onSubmit={(e) => modals.create ? handleFormSubmit(e, "create-student", "POST", "create") : handleFormSubmit(e, "update-student", "PUT", "update")} className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-6 relative animate-scale-up flex flex-col max-h-[90vh]">
                        <button type="button" onClick={() => modals.create ? toggleModal("create", false) : toggleModal("update", false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"><X size={18} /></button>
                        
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">{modals.create ? "Add New Student Record" : "Modify Student Record"}</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Please provide valid information for all standard fields below.</p>
                        </div>

                        <div className="space-y-6 overflow-y-auto pr-1 flex-1 py-1">
                            
                            {/* SECTION 1: PERSONAL INFORMATION */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50/60 px-3 py-1.5 rounded-lg border border-indigo-100/50">1. Personal Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-500 font-bold tracking-wide">NIS *</label>
                                        <input required value={formData.nis} onChange={(e) => setFormData({ ...formData, nis: e.target.value })} placeholder="e.g. 1012003" className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm rounded-xl text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner focus:ring-4 focus:ring-indigo-500/5" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-500 font-bold tracking-wide">Full Name *</label>
                                        <input required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="Student full name" className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm rounded-xl text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner focus:ring-4 focus:ring-indigo-500/5" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-500 font-bold tracking-wide">Gender</label>
                                        <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm rounded-xl text-slate-900 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner focus:ring-4 focus:ring-indigo-500/5">
                                            <option value="">Select Gender</option>
                                            <option value="Laki-laki">Laki-laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-500 font-bold tracking-wide">Birth Date</label>
                                        <input type="date" value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm rounded-xl text-slate-900 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner focus:ring-4 focus:ring-indigo-500/5" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-500 font-bold tracking-wide">Phone Number</label>
                                        <input value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} placeholder="e.g. 0812345678" className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm rounded-xl text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner focus:ring-4 focus:ring-indigo-500/5" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-500 font-bold tracking-wide">Email Address</label>
                                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="e.g. student@school.com" className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm rounded-xl text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner focus:ring-4 focus:ring-indigo-500/5" />
                                    </div>
                                    <div className="space-y-1 sm:col-span-2">
                                        <label className="text-xs text-slate-500 font-bold tracking-wide">Home Address</label>
                                        <textarea rows="2" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Full home address..." className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm rounded-xl text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner focus:ring-4 focus:ring-indigo-500/5 resize-none" />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 2: ACADEMIC DETAILS */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold tracking-wider uppercase text-purple-600 bg-purple-50/60 px-3 py-1.5 rounded-lg border border-purple-100/50">2. Academic Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-500 font-bold tracking-wide">Class Name</label>
                                        <select value={formData.className} onChange={(e) => setFormData({ ...formData, className: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm rounded-xl text-slate-900 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner focus:ring-4 focus:ring-indigo-500/5">
                                            <option value="">Select Class</option>
                                            {["X RPL", "XI RPL", "XII RPL", "X TKJ", "XI TKJ", "XII TKJ"].map(item => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-500 font-bold tracking-wide">Major / Specialization</label>
                                        <input value={formData.major} onChange={(e) => setFormData({ ...formData, major: e.target.value })} placeholder="e.g. Rekayasa Perangkat Lunak" className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm rounded-xl text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner focus:ring-4 focus:ring-indigo-500/5" />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3: PARENT / GUARDIAN INFORMATION */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold tracking-wider uppercase text-amber-600 bg-amber-50/60 px-3 py-1.5 rounded-lg border border-amber-100/50">3. Parent / Guardian Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-500 font-bold tracking-wide">Parent Name</label>
                                        <input value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} placeholder="Father or Mother name" className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm rounded-xl text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner focus:ring-4 focus:ring-indigo-500/5" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-500 font-bold tracking-wide">Parent Phone</label>
                                        <input value={formData.parentPhone} onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })} placeholder="e.g. 0898765432" className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm rounded-xl text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner focus:ring-4 focus:ring-indigo-500/5" />
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 shrink-0">
                            <button type="button" onClick={() => modals.create ? toggleModal("create", false) : toggleModal("update", false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-semibold transition-all cursor-pointer">Cancel</button>
                            <button type="submit" className="px-5 py-2 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-md shadow-indigo-600/10 cursor-pointer">Save Record</button>
                        </div>
                    </form>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {modals.delete && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all duration-300 animate-fade-in">
                    <div className="bg-white border border-slate-200 w-full max-w-sm rounded-2xl p-6 shadow-2xl space-y-4 animate-scale-up">
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Delete Record?</h2>
                        <p className="text-sm text-slate-500 leading-relaxed">Are you sure you want to delete <span className="text-red-500 font-bold">{selectedStudent?.fullName}</span>? This action cannot be undone.</p>
                        <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={() => toggleModal("delete", false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-semibold transition-all cursor-pointer">Cancel</button>
                            <button type="button" onClick={(e) => handleFormSubmit(e, "delete-student", "DELETE", "delete")} className="px-4 py-2 bg-linear-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-md shadow-red-500/10 cursor-pointer">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;