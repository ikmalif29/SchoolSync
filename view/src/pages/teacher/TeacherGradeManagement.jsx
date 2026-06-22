/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Search, Award, Menu, X, CheckCircle, AlertCircle, BookOpen, User, Eye, RefreshCw, Plus, Edit2, Trash2 } from "lucide-react";

const TeacherGradeManagement = () => {
    const token = localStorage.getItem("token");
    const BASE_URL = "http://localhost:8098/gradeSvc/api/grades";

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [teacherProfile, setTeacherProfile] = useState(null);

    // State Modal & Notifikasi
    const [modal, setModal] = useState({ type: null, data: null }); // 'detail' | 'create' | 'edit' | 'delete'
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    // State Form untuk Create & Edit
    const [formData, setFormData] = useState({
        studentId: "",
        subjectId: "",
        className: "",
        assignmentScore: "",
        midExamScore: "",
        finalExamScore: ""
    });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
    };

    const getGradesByTeacher = async () => {
        try {
            setLoading(true);
            const currentToken = localStorage.getItem("token");
            const email = localStorage.getItem("username");

            if (!currentToken) throw new Error("Token tidak ditemukan. Silakan login kembali.");
            if (!email) throw new Error("Email (username) tidak ditemukan di localStorage.");

            // 1. Fetch data profile teacher
            const profileResponse = await fetch(`http://localhost:8098/teacherSvc/api/teacher/get-teacher-by-email/${email}`, {
                headers: { "Authorization": `Bearer ${currentToken}`, "Content-Type": "application/json" }
            });

            if (!profileResponse.ok) throw new Error(`Gagal mengambil profil guru: ${profileResponse.status}`);

            const profileResult = await profileResponse.json();
            const teacherData = profileResult?.data || profileResult;
            const teacherId = teacherData?.id;

            if (!teacherId) throw new Error("ID Guru tidak ditemukan dalam data profil.");
            setTeacherProfile(teacherData);

            // 2. Fetch data grade berdasarkan teacherId
            const gradeResponse = await fetch(`${BASE_URL}/get-grade-by-teacher-id/${teacherId}`, {
                headers: { "Authorization": `Bearer ${currentToken}`, "Content-Type": "application/json" }
            });

            if (!gradeResponse.ok) throw new Error(`${gradeResponse.status}: ${await gradeResponse.text()}`);
            const gradeResult = await gradeResponse.json();

            setGrades(gradeResult?.data || []);
        } catch (error) {
            showToast(error.message, "error");
        } finally { setLoading(false); }
    };

    useEffect(() => {
        getGradesByTeacher();
    }, []);

    // Handle Submit Form (Create & Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!teacherProfile?.id) {
            showToast("Profil guru belum dimuat, tidak bisa memproses data.", "error");
            return;
        }

        try {
            setSubmitLoading(true);
            const isEdit = modal.type === "edit";
            const url = isEdit ? `${BASE_URL}/update-grade/${modal.data.id}` : `${BASE_URL}/create-grade`;
            const method = isEdit ? "PUT" : "POST";

            // Konversi tipe data string dari input HTML menjadi Number (Double/Long bagi Java)
            const payload = {
                studentId: Number(formData.studentId),         // Menjadi Long di Backend
                teacherId: Number(teacherProfile.id),          // Menjadi Long di Backend
                subjectId: Number(formData.subjectId),         // Menjadi Long di Backend
                className: formData.className,                 // String
                assignmentScore: Number(formData.assignmentScore), // Menjadi Double di Backend
                midExamScore: Number(formData.midExamScore),       // Menjadi Double di Backend
                finalExamScore: Number(formData.finalExamScore)    // Menjadi Double di Backend
            };

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Terjadi kesalahan sistem.");
            }

            showToast(isEdit ? "Grade updated Successfully" : "Grade created Successfully", "success");
            closeModal();
            getGradesByTeacher();
        } catch (error) {
            showToast(error.message, "error");
        } finally {
            setSubmitLoading(false);
        }
    };

    // Handle Delete Grade
    const handleDelete = async () => {
        try {
            setSubmitLoading(true);
            const response = await fetch(`${BASE_URL}/delete-grade/${modal.data.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            const resultText = await response.text();
            if (!response.ok) throw new Error(resultText || "Gagal menghapus data.");

            showToast("Grade deleted Successfully", "success");
            closeModal();
            getGradesByTeacher();
        } catch (error) {
            showToast(error.message, "error");
        } finally {
            setSubmitLoading(false);
        }
    };

    const filteredGrades = grades.filter(g =>
        g.studentName?.toLowerCase().includes(keyword.toLowerCase()) ||
        g.className?.toLowerCase().includes(keyword.toLowerCase()) ||
        g.subjectName?.toLowerCase().includes(keyword.toLowerCase())
    );

    const openModal = (type, data = null) => {
        setModal({ type, data });
        if (type === "edit" && data) {
            setFormData({
                studentId: data.studentId ? data.studentId.toString() : "",
                subjectId: data.subjectId ? data.subjectId.toString() : "",
                className: data.className || "",
                assignmentScore: data.assignmentScore ? data.assignmentScore.toString() : "",
                midExamScore: data.midExamScore ? data.midExamScore.toString() : "",
                finalExamScore: data.finalExamScore ? data.finalExamScore.toString() : ""
            });
        } else if (type === "create") {
            setFormData({
                studentId: "",
                subjectId: grades[0]?.subjectId ? grades[0].subjectId.toString() : "",
                className: "",
                assignmentScore: "",
                midExamScore: "",
                finalExamScore: ""
            });
        }
    };

    const closeModal = () => {
        setModal({ type: null, data: null });
        setFormData({ studentId: "", subjectId: "", className: "", assignmentScore: "", midExamScore: "", finalExamScore: "" });
    };

    return (
        <div className="flex bg-slate-50 min-h-screen text-slate-800 antialiased font-sans">
            <div className="flex-1 min-w-0 flex flex-col">
                <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200/70 text-slate-600 transition-all active:scale-95 cursor-pointer">
                        <Menu size={20} />
                    </button>
                    <button onClick={() => openModal("create")} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 transition-all cursor-pointer">
                        <Plus size={16} /> Add New Grade
                    </button>
                </header>

                <div className="p-6 md:p-10 space-y-6 flex-1 overflow-y-auto max-w-7xl w-full mx-auto">

                    {/* DASHBOARD HEADER */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-linear-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-slate-900/10">
                        <div>
                            <span className="bg-indigo-500/20 text-indigo-300 font-semibold px-3 py-1 rounded-full text-xs border border-indigo-500/30 uppercase tracking-wider">Teacher Performance Panel</span>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-2">
                                {teacherProfile?.name ? `Welcome, ${teacherProfile.name}` : "Academic Grading Matrix"}
                            </h1>
                            <p className="text-xs md:text-sm text-slate-300 mt-1 font-light">Manage, update, and evaluate student academic performances seamlessly.</p>
                        </div>
                        <button onClick={getGradesByTeacher} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-sm font-medium px-4 py-2.5 rounded-xl border border-white/10 backdrop-blur-xs transition-all cursor-pointer">
                            <RefreshCw size={15} className={`${loading ? "animate-spin" : ""}`} /> Reload Data
                        </button>
                    </div>

                    {/* STATISTICS BAR */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-xs">
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assigned Evaluations</p>
                                <h2 className="text-2xl font-bold text-slate-900 mt-0.5">{filteredGrades.length} Records</h2>
                            </div>
                            <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600"><Award size={20} /></div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-xs">
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Instructor Identity</p>
                                <h2 className="text-xl font-bold text-slate-900 mt-0.5 truncate max-w-[250px]">
                                    {teacherProfile?.nip ? `NIP. ${teacherProfile.nip}` : `ID: #${teacherProfile?.id || "-"}`}
                                </h2>
                            </div>
                            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-slate-500"><User size={20} /></div>
                        </div>
                    </div>

                    {/* FILTER INPUT */}
                    <div className="relative group">
                        <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input type="text" placeholder="Filter matrices by Student name, Class name or Subject description..." value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xs" />
                    </div>

                    {/* DATA TABLE */}
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-xs">
                                    <tr>
                                        {["Student", "Subject Details", "Class", "Task", "UTS", "UAS", "Final", "Grade", "Actions"].map((h, i) => <th key={i} className={`p-4 ${i >= 3 && i <= 7 ? "text-center" : ""}`}>{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan="9" className="text-center p-16 text-slate-400 font-medium"><RefreshCw className="animate-spin mx-auto mb-2 text-slate-300" size={24} /> Fetching grading matrices...</td></tr>
                                    ) : filteredGrades.length === 0 ? (
                                        <tr><td colSpan="9" className="text-center p-16 text-slate-400 font-medium">No monitored student matrices matched the criteria.</td></tr>
                                    ) : (
                                        filteredGrades.map((g) => (
                                            <tr key={g.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-900">{g.studentName || "N/A"}</div>
                                                    <div className="text-xs text-slate-400 mt-0.5">Student ID: {g.studentId}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-medium text-slate-800 flex items-center gap-1"><BookOpen size={13} className="text-slate-400" />{g.subjectName || `Subject #${g.subjectId}`}</div>
                                                </td>
                                                <td className="p-4 font-semibold text-slate-600">{g.className}</td>
                                                <td className="p-4 text-center text-slate-600 font-medium">{g.assignmentScore}</td>
                                                <td className="p-4 text-center text-slate-600 font-medium">{g.midExamScore}</td>
                                                <td className="p-4 text-center text-slate-600 font-medium">{g.finalExamScore}</td>
                                                <td className="p-4 text-center font-bold text-slate-900 bg-slate-50/30">{g.finalScore?.toFixed(1) || "0.0"}</td>
                                                <td className="p-4 text-center">
                                                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${["A", "B"].includes(g.gradeLetter) ? "bg-emerald-50 text-emerald-700 border-emerald-100" : ["C", "D"].includes(g.gradeLetter) ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}>{g.gradeLetter || "-"}</span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-center items-center gap-1.5">
                                                        <button onClick={() => openModal("detail", g)} className="p-1.5 bg-slate-100 hover:bg-indigo-50 border border-slate-200 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer" title="View Detail"><Eye size={14} /></button>
                                                        <button onClick={() => openModal("edit", g)} className="p-1.5 bg-slate-100 hover:bg-amber-50 border border-slate-200 text-slate-600 hover:text-amber-600 rounded-lg transition-colors cursor-pointer" title="Edit"><Edit2 size={14} /></button>
                                                        <button onClick={() => openModal("delete", g)} className="p-1.5 bg-slate-100 hover:bg-rose-50 border border-slate-200 text-slate-600 hover:text-rose-600 rounded-lg transition-colors cursor-pointer" title="Delete"><Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL FORM (CREATE & EDIT) */}
            {(modal.type === "create" || modal.type === "edit") && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-50 p-4">
                    <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-2xl space-y-4 border border-slate-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900">{modal.type === "create" ? "Add New Student Grade" : "Modify Student Grade"}</h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"><X size={16} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Student ID</label>
                                    <input type="number" required disabled={modal.type === "edit"} value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 disabled:opacity-60" placeholder="e.g. 4" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Subject ID</label>
                                    <input type="number" required value={formData.subjectId} onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500" placeholder="e.g. 3" />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Class Name</label>
                                    <input type="text" required value={formData.className} onChange={(e) => setFormData({ ...formData, className: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500" placeholder="e.g. TI-2A" />
                                </div>
                            </div>
                            <div className="border-t border-slate-100 pt-3 grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Assignment (30%)</label>
                                    <input type="number" min="0" max="100" step="any" required value={formData.assignmentScore} onChange={(e) => setFormData({ ...formData, assignmentScore: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-center outline-none focus:border-indigo-500" placeholder="0-100" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">UTS (30%)</label>
                                    <input type="number" min="0" max="100" step="any" required value={formData.midExamScore} onChange={(e) => setFormData({ ...formData, midExamScore: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-center outline-none focus:border-indigo-500" placeholder="0-100" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">UAS (40%)</label>
                                    <input type="number" min="0" max="100" step="any" required value={formData.finalExamScore} onChange={(e) => setFormData({ ...formData, finalExamScore: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-center outline-none focus:border-indigo-500" placeholder="0-100" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">Cancel</button>
                                <button type="submit" disabled={submitLoading} className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2 cursor-pointer">
                                    {submitLoading && <RefreshCw size={14} className="animate-spin" />} Save Grade Matrix
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {modal.type === "delete" && modal.data && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-50 p-4">
                    <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-2xl text-center space-y-4 border border-slate-100">
                        <div className="w-12 h-12 bg-rose-50 border border-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-xs"><Trash2 size={22} /></div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Remove Evaluation Matrix?</h3>
                            <p className="text-xs text-slate-400 mt-1">This will permanently delete the grades record for <span className="font-semibold text-slate-700">{modal.data.studentName}</span> in <span className="font-semibold text-slate-700">{modal.data.subjectName}</span>.</p>
                        </div>
                        <div className="flex gap-2 pt-1">
                            <button type="button" onClick={closeModal} className="flex-1 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">Abort</button>
                            <button type="button" onClick={handleDelete} disabled={submitLoading} className="flex-1 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer">
                                {submitLoading && <RefreshCw size={14} className="animate-spin" />} Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DETAIL MODAL */}
            {modal.type === "detail" && modal.data && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-50 p-4">
                    <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-2xl space-y-5 border border-slate-100">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2 text-indigo-600"><BookOpen size={18} /><h2 className="text-base font-bold text-slate-900">Academic Metric Review</h2></div>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"><X size={16} /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 grid grid-cols-2 gap-3">
                                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject Title</p><p className="text-sm font-bold text-indigo-600 mt-0.5">{modal.data.subjectName || `Subject ID ${modal.data.subjectId}`}</p></div>
                                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Class</p><p className="text-sm font-bold text-slate-900 mt-0.5">{modal.data.className}</p></div>
                                <div className="col-span-2 border-t border-slate-200/60 pt-2 mt-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student Affiliation</p>
                                    <p className="text-sm font-semibold text-slate-700 flex items-center gap-1 mt-1"><User size={13} className="text-slate-400" /> {modal.data.studentName} (ID: {modal.data.studentId})</p>
                                </div>
                            </div>
                            <div className="border border-slate-200/60 rounded-xl p-4 space-y-2.5 bg-white">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Performance Weights</p>
                                {[
                                    { n: "Assignment Score (30%)", v: modal.data.assignmentScore },
                                    { n: "Mid Exam / UTS (30%)", v: modal.data.midExamScore },
                                    { n: "Final Exam / UAS (40%)", v: modal.data.finalExamScore }
                                ].map((sc, idx) => (
                                    <div key={idx} className="flex justify-between text-sm"><span className="text-slate-500 font-medium">{sc.n}</span><span className="font-bold text-slate-800">{sc.v}</span></div>
                                ))}
                                <div className="flex justify-between text-sm pt-2.5 border-t border-slate-100 font-extrabold"><span className="text-slate-900">Aggregated Mark</span><span className="text-indigo-600 text-base">{modal.data.finalScore?.toFixed(1)} ({modal.data.gradeLetter})</span></div>
                            </div>
                        </div>
                        <button onClick={closeModal} className="w-full py-2.5 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors cursor-pointer shadow-xs">Dismiss Breakdown</button>
                    </div>
                </div>
            )}

            {/* TOAST NOTIFICATION */}
            {toast.show && (
                <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-xl border bg-white max-w-md ${toast.type === "success" ? "border-emerald-200" : "border-red-200"}`}>
                    {toast.type === "success" ? <CheckCircle size={18} className="text-emerald-500" /> : <AlertCircle size={18} className="text-red-500" />}
                    <p className="text-sm font-semibold pr-2">{toast.message}</p>
                    <button onClick={() => setToast({ ...toast, show: false })} className="text-slate-400 hover:text-slate-600 ml-auto p-0.5 rounded-lg hover:bg-slate-100"><X size={14} /></button>
                </div>
            )}
        </div>
    );
};

export default TeacherGradeManagement;