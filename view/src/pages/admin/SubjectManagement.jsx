/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2, BookOpen, ChevronLeft, ChevronRight, Menu, X, CheckCircle, AlertCircle, Info, FileText } from "lucide-react";
import AdminSidebar from "../../components/SidebarAdmin";

const SubjectManagement = () => {
    const token = localStorage.getItem("token");
    const BASE_URL = "http://localhost:8098/subjectSvc/api/subject";

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0, last: true });
    
    // Penyatuan State Modal (type: null | 'create' | 'update' | 'delete' | 'detail')
    const [modal, setModal] = useState({ type: null, data: null });
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [formData, setFormData] = useState({ subjectCode: "", subjectName: "", description: "" });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
    };

    const getSubjects = async (page = 0) => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/get-all-subjects?page=${page}&size=10`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            setSubjects(result?.data?.content || []);
            setPagination({
                page: result?.data?.page || 0,
                totalPages: result?.data?.totalPages || 0,
                totalElements: result?.data?.totalElements || 0,
                last: result?.data?.last ?? true
            });
        } catch (error) {
            showToast("Failed to fetch subject list", "error");
        } finally { setLoading(false); }
    };

    useEffect(() => { getSubjects(); }, []);

    const filteredSubjects = subjects.filter(s =>
        s.subjectCode?.toLowerCase().includes(keyword.toLowerCase()) ||
        s.subjectName?.toLowerCase().includes(keyword.toLowerCase())
    );

    const openModal = (type, data = null) => {
        setModal({ type, data });
        setFormData(type === "update" || type === "detail" 
            ? { subjectCode: data.subjectCode || "", subjectName: data.subjectName || "", description: data.description || "" }
            : { subjectCode: "", subjectName: "", description: "" }
        );
    };

    const closeModal = () => setModal({ type: null, data: null });

    // Mutasi Data (Create & Update disatukan)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isUpdate = modal.type === "update";
        const url = isUpdate ? `${BASE_URL}/update-subject/${modal.data.id}` : `${BASE_URL}/create-subject`;
        
        try {
            const res = await fetch(url, {
                method: isUpdate ? "PUT" : "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                closeModal();
                showToast(isUpdate ? "Subject details successfully updated!" : "Subject successfully created!");
                getSubjects(pagination.page);
            } else {
                showToast(`Failed: ${await res.text()}`, "error");
            }
        } catch (error) { showToast("An unexpected error occurred", "error"); }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`${BASE_URL}/delete-subject/${modal.data.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                closeModal();
                showToast("Subject has been permanently deleted.", "warning");
                getSubjects(0);
            } else { showToast(`Failed: ${await res.text()}`, "error"); }
        } catch (error) { showToast("An unexpected error occurred", "error"); }
    };

    return (
        <div className="flex bg-slate-50 min-h-screen text-slate-800 antialiased font-sans">
            <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className="flex-1 min-w-0 flex flex-col">
                <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center sticky top-0 z-30 shadow-xs">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200/70 text-slate-600 transition-all active:scale-95 cursor-pointer">
                        <Menu size={20} />
                    </button>
                </header>

                <div className="p-6 md:p-10 space-y-8 flex-1 overflow-y-auto max-w-400 w-full mx-auto animate-fade-in">
                    {/* TITLE CARD */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">Subjects Management</h1>
                            <p className="text-sm text-slate-500 mt-1">Configure curriculum subjects and course codes</p>
                        </div>
                        <button onClick={() => openModal("create")} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-indigo-600/10 cursor-pointer group">
                            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Add New Subject
                        </button>
                    </div>

                    {/* STATISTICS SUMMARY */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { label: "Total Subjects", val: pagination.totalElements, icon: <BookOpen className="text-indigo-600" />, bg: "bg-indigo-50 border-indigo-100" },
                            { label: "Current Page", val: pagination.totalElements > 0 ? pagination.page + 1 : 0, icon: <ChevronRight className="text-emerald-600" />, bg: "bg-emerald-50 border-emerald-100" },
                            { label: "Total Pages", val: pagination.totalPages, icon: <FileText className="text-amber-600" />, bg: "bg-amber-50 border-amber-100" }
                        ].map((card, i) => (
                            <div key={i} className="bg-white border border-slate-200/70 rounded-2xl p-6 flex items-center justify-between shadow-xs transition-transform hover:-translate-y-0.5">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.label}</p>
                                    <h2 className="text-3xl font-bold text-slate-900 mt-1">{card.val}</h2>
                                </div>
                                <div className={`p-3 rounded-xl border ${card.bg}`}>{card.icon}</div>
                            </div>
                        ))}
                    </div>

                    {/* SEARCH INPUT */}
                    <div className="relative group">
                        <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input type="text" placeholder="Search by Subject Code or Name..." value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xs" />
                    </div>

                    {/* DATA TABLE */}
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-xs">
                                    <tr>
                                        {["Subject Code", "Subject Name", "Description", "Status", "Actions"].map((h, i) => <th key={i} className={`p-4 ${i === 0 ? "pl-6" : ""} ${i === 4 ? "text-center" : ""}`}>{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan="5" className="text-center p-16 text-slate-400 font-medium">Loading records...</td></tr>
                                    ) : filteredSubjects.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center p-16 text-slate-400 font-medium">No subjects found.</td></tr>
                                    ) : (
                                        filteredSubjects.map((s) => (
                                            <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="p-4 pl-6 font-mono text-indigo-600 font-bold">{s.subjectCode || "-"}</td>
                                                <td className="p-4 font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{s.subjectName}</td>
                                                <td className="p-4 text-slate-500 max-w-xs truncate">{s.description || "-"}</td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${s.status === "ACTIVE" || !s.status ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}>{s.status || "ACTIVE"}</span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-center gap-1.5">
                                                        <button onClick={() => openModal("detail", s)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2.5 rounded-xl border border-slate-200/60 transition-all active:scale-95 cursor-pointer" title="View Details"><Info size={15} /></button>
                                                        <button onClick={() => openModal("update", s)} className="bg-amber-50 hover:bg-amber-500 text-amber-600 hover:text-white p-2.5 rounded-xl border border-amber-200 transition-all active:scale-95 cursor-pointer" title="Edit"><Pencil size={15} /></button>
                                                        <button onClick={() => openModal("delete", s)} className="bg-red-50 hover:bg-red-500 text-red-600 hover:text-white p-2.5 rounded-xl border border-red-200 transition-all active:scale-95 cursor-pointer" title="Delete"><Trash2 size={15} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* PAGINATION PANEL */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                        <p className="text-xs md:text-sm text-slate-500 font-medium">Showing {filteredSubjects.length} of {pagination.totalElements} entries</p>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button disabled={pagination.page === 0} onClick={() => getSubjects(pagination.page - 1)} className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium disabled:opacity-40 transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"><ChevronLeft size={16} /> Previous</button>
                            <button disabled={pagination.last} onClick={() => getSubjects(pagination.page + 1)} className="flex-1 sm:flex-none px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium disabled:opacity-40 transition-all flex items-center justify-center gap-1 shadow-md cursor-pointer">Next <ChevronRight size={16} /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL SYSTEM (CREATE & UPDATE) */}
            {(modal.type === "create" || modal.type === "update") && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-50 p-4 animate-fade-in">
                    <form onSubmit={handleSubmit} className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5 transform scale-100 animate-scale-up">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900">{modal.type === "create" ? "Create New Subject" : "Update Subject Details"}</h2>
                            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"><X size={18} /></button>
                        </div>
                        <div className="space-y-4">
                            {/* Input Code & Name (Mapped untuk hemat tempat) */}
                            {[
                                { label: "Subject Code *", prop: "subjectCode", ph: "e.g. SUBJ-MAT-01", type: "input" },
                                { label: "Subject Name *", prop: "subjectName", ph: "e.g. Mathematics", type: "input" }
                            ].map((input, idx) => (
                                <div key={idx} className="space-y-1.5">
                                    <label className="text-xs text-slate-600 font-semibold uppercase tracking-wider">{input.label}</label>
                                    <input required placeholder={input.ph} value={formData[input.prop]} onChange={(e) => setFormData({ ...formData, [input.prop]: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-3 text-sm rounded-xl text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all" />
                                </div>
                            ))}
                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Description *</label>
                                <textarea rows="4" required placeholder="Describe the learning subject overview..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-3 text-sm rounded-xl text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button type="button" onClick={closeModal} className="px-5 py-2.5 text-sm font-semibold bg-slate-100 text-slate-600 rounded-xl cursor-pointer">Cancel</button>
                            <button type="submit" className="px-5 py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-xl shadow-md cursor-pointer">Save Subject</button>
                        </div>
                    </form>
                </div>
            )}

            {/* DETAIL MODAL */}
            {modal.type === "detail" && modal.data && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-50 p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5 transform scale-100 animate-scale-up">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2 text-indigo-600"><BookOpen size={20} /><h2 className="text-lg font-bold text-slate-900">Subject Overview</h2></div>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"><X size={18} /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject Code</p><p className="text-sm font-mono font-bold text-indigo-600">{modal.data.subjectCode || "-"}</p></div>
                                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject Name</p><p className="text-base font-bold text-slate-900">{modal.data.subjectName}</p></div>
                                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</p><span className={`inline-block px-2.5 py-0.5 mt-1 rounded-full text-xs font-semibold border ${modal.data.status === "ACTIVE" || !modal.data.status ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-600 border-slate-200"}`}>{modal.data.status || "ACTIVE"}</span></div>
                            </div>
                            <div><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Detailed Description</p><div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 max-h-45 overflow-y-auto text-sm text-slate-600 leading-relaxed">{modal.data.description || "No description provided."}</div></div>
                        </div>
                        <button onClick={closeModal} className="w-full py-2.5 text-sm font-semibold bg-slate-900 text-white rounded-xl cursor-pointer">Close Details</button>
                    </div>
                </div>
            )}

            {/* DELETE ALERT MODAL */}
            {modal.type === "delete" && modal.data && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-50 p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center space-y-4 transform scale-100 animate-scale-up">
                        <div className="mx-auto bg-red-50 p-3 rounded-2xl border border-red-100 w-fit"><Trash2 size={26} className="text-red-500" /></div>
                        <div><h2 className="text-lg font-bold text-slate-900">Delete Subject?</h2><p className="text-sm text-slate-500 mt-2">Are you sure you want to remove <span className="text-slate-900 font-semibold">{modal.data.subjectName}</span>? This action cannot be undone.</p></div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-slate-100 text-slate-600 rounded-xl cursor-pointer">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-red-600 text-white rounded-xl shadow-md cursor-pointer">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* FLOATING TOAST NOTIFICATION */}
            {toast.show && (
                <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-xl border animate-slide-in-right bg-white max-w-md ${toast.type === "success" ? "border-emerald-200" : toast.type === "warning" ? "border-amber-200" : "border-red-200"}`}>
                    {toast.type === "success" && <CheckCircle size={20} className="text-emerald-500" />}
                    {toast.type === "warning" && <AlertCircle size={20} className="text-amber-500" />}
                    {toast.type === "error" && <AlertCircle size={20} className="text-red-500" />}
                    <p className="text-sm font-medium pr-2">{toast.message}</p>
                    <button onClick={() => setToast({ ...toast, show: false })} className="text-slate-400 hover:text-slate-600 ml-auto p-0.5 rounded-lg hover:bg-slate-100"><X size={14} /></button>
                </div>
            )}
        </div>
    );
};

export default SubjectManagement;