/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2, Award, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import AdminSidebar from "../../components/SidebarAdmin"; // Sesuaikan path sesuai struktur project Anda

const GradeManagement = () => {
    const token = localStorage.getItem("token");
    // Sesuaikan port 8090 dengan port Spring Cloud Gateway Anda
    const BASE_URL = "http://localhost:8098/gradeSvc/api/grades";

    // State Kontrol Sidebar Toggle
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // State CRUD & Data
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0, last: true });

    // State Modal
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState(null);

    // Initial State sesuai dengan CreateGradeRequest DTO
    const initialFormState = {
        studentId: "",
        teacherId: "",
        subjectId: "",
        className: "",
        assignmentScore: "",
        midExamScore: "",
        finalExamScore: ""
    };
    const [formData, setFormData] = useState(initialFormState);

    // Fetch All Grades
    const getGrades = async (page = 0) => {
        try {
            setLoading(true);
            
            // 1. Ambil token terbaru tepat saat fungsi dipanggil
            const currentToken = localStorage.getItem("token");
            
            // Debugging Token (Buka console F12 untuk melihat ini)
            console.log("Current JWT Token used:", currentToken);
    
            if (!currentToken) {
                throw new Error("Token tidak ditemukan. Silakan login kembali.");
            }
    
            const response = await fetch(
                `${BASE_URL}/get-all-grades?page=${page}&size=10`,
                {
                    method: "GET",
                    headers: { 
                        "Authorization": `Bearer ${currentToken}`,
                        "Content-Type": "application/json"
                    }
                }
            );
    
            // 2. Jika terkena 401 atau error lainnya, tangkap teks error-nya
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`${response.status} ${response.statusText}: ${errText || '[no body]'}`);
            }
    
            const result = await response.json();
            
            setGrades(result?.data?.content || []);
            setPagination({
                page: result?.data?.page || 0,
                totalPages: result?.data?.totalPages || 0,
                totalElements: result?.data?.totalElements || 0,
                last: result?.data?.last ?? true
            });
        } catch (error) {
            console.error("Error fetching grades:", error.message);
            alert(`Authentication/Fetch Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getGrades();
    }, []);

    // Filter Client-side berdasarkan nama Siswa atau nama Kelas
    const filteredGrades = grades.filter(grade =>
        grade.studentName?.toLowerCase().includes(keyword.toLowerCase()) ||
        grade.className?.toLowerCase().includes(keyword.toLowerCase())
    );

    const handleOpenCreate = () => {
        setFormData(initialFormState);
        setShowCreateModal(true);
    };

    const handleOpenUpdate = (grade) => {
        setSelectedGrade(grade);
        setFormData({
            studentId: grade.studentId || "",
            teacherId: grade.teacherId || "",
            subjectId: grade.subjectId || "",
            className: grade.className || "",
            assignmentScore: grade.assignmentScore ?? "",
            midExamScore: grade.midExamScore ?? "",
            finalExamScore: grade.finalExamScore ?? ""
        });
        setShowUpdateModal(true);
    };

    // 1. Create Grade (Menggunakan JSON karena backend pakai @RequestBody)
    const handleCreateGrade = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                studentId: Number(formData.studentId),
                teacherId: Number(formData.teacherId),
                subjectId: Number(formData.subjectId),
                className: formData.className,
                assignmentScore: Number(formData.assignmentScore),
                midExamScore: Number(formData.midExamScore),
                finalExamScore: Number(formData.finalExamScore)
            };

            const response = await fetch(`${BASE_URL}/create-grade`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setShowCreateModal(false);
                getGrades(pagination.page);
            } else {
                const errText = await response.text();
                alert(`Failed to create: ${errText}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 2. Update Grade (Menggunakan JSON karena backend sudah pakai @RequestBody)
    const handleUpdateGrade = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                studentId: Number(formData.studentId),
                teacherId: Number(formData.teacherId),
                subjectId: Number(formData.subjectId),
                className: formData.className,
                assignmentScore: Number(formData.assignmentScore),
                midExamScore: Number(formData.midExamScore),
                finalExamScore: Number(formData.finalExamScore)
            };

            const response = await fetch(`${BASE_URL}/update-grade/${selectedGrade.id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json", 
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setShowUpdateModal(false);
                getGrades(pagination.page);
            } else {
                const errText = await response.text();
                alert(`Failed to update: ${errText}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 3. Delete Grade
    const handleDeleteGrade = async () => {
        try {
            const response = await fetch(`${BASE_URL}/delete-grade/${selectedGrade.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                setShowDeleteModal(false);
                getGrades(0);
            } else {
                const errText = await response.text();
                alert(`Failed to delete: ${errText}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex bg-slate-950 min-h-screen text-slate-100 antialiased overflow-x-hidden">
            
            {/* ADMIN SIDEBAR */}
            <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 min-w-0 flex flex-col">
                
                {/* HEADER BANNER TOPBAR */}
                <header className="bg-slate-900/30 border-b border-slate-900 px-4 md:px-8 py-4 flex items-center">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all active:scale-95"
                        title="Toggle Sidebar"
                    >
                        <Menu size={20} />
                    </button>
                </header>

                {/* CONTENT CONTAINER */}
                <div className="p-4 md:p-8 space-y-6 flex-1 overflow-y-auto">
                    
                    {/* TITLE CARD */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-linear-to-r content-box from-white to-slate-400 bg-clip-text text-transparent">
                                Grade Management
                            </h1>
                            <p className="text-sm text-slate-400 mt-1">Input academic assessment scores and view final grading matrix</p>
                        </div>
                        <button
                            onClick={handleOpenCreate}
                            className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-lg shadow-cyan-600/10"
                        >
                            <Plus size={18} /> Input Grade
                        </button>
                    </div>

                    {/* STATISTICS SUMMARY */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-900 border border-slate-800/60 rounded-xl p-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-400">Total Records</p>
                                <h2 className="text-3xl font-bold tracking-tight text-white mt-1">{pagination.totalElements}</h2>
                            </div>
                            <div className="bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/20">
                                <Award size={24} className="text-cyan-400" />
                            </div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800/60 rounded-xl p-5">
                            <p className="text-sm font-medium text-slate-400">Current Page</p>
                            <h2 className="text-3xl font-bold tracking-tight text-white mt-1">{pagination.page + 1}</h2>
                        </div>
                        <div className="bg-slate-900 border border-slate-800/60 rounded-xl p-5">
                            <p className="text-sm font-medium text-slate-400">Total Pages</p>
                            <h2 className="text-3xl font-bold tracking-tight text-white mt-1">{pagination.totalPages}</h2>
                        </div>
                    </div>

                    {/* SEARCH INPUT */}
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Student Name or Class..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                        />
                    </div>

                    {/* DATA TABLE */}
                    <div className="bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-sm">
                                <thead className="bg-slate-800/50 border-b border-slate-800 text-slate-300 font-medium">
                                    <tr>
                                        <th className="p-4">Student</th>
                                        <th className="p-4">Subject & Teacher</th>
                                        <th className="p-4">Class</th>
                                        <th className="p-4 text-center">Task</th>
                                        <th className="p-4 text-center">UTS</th>
                                        <th className="p-4 text-center">UAS</th>
                                        <th className="p-4 text-center">Final Score</th>
                                        <th className="p-4 text-center">Grade</th>
                                        <th className="p-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {loading ? (
                                        <tr><td colSpan="9" className="text-center p-12 text-slate-400">Loading grade records...</td></tr>
                                    ) : filteredGrades.length === 0 ? (
                                        <tr><td colSpan="9" className="text-center p-12 text-slate-400">No grade records found.</td></tr>
                                    ) : (
                                        filteredGrades.map((grade) => (
                                            <tr key={grade.id} className="hover:bg-slate-800/30 transition-colors duration-150">
                                                <td className="p-4">
                                                    <div className="font-medium text-white">{grade.studentName || "N/A"}</div>
                                                    <div className="text-xs text-slate-500 font-mono">ID: {grade.studentId}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-cyan-400 font-medium">{grade.subjectName || "Unknown Subject"}</div>
                                                    <div className="text-xs text-slate-400 mt-0.5">By: {grade.teacherName || "N/A"}</div>
                                                </td>
                                                <td className="p-4 text-slate-300 font-semibold">{grade.className}</td>
                                                <td className="p-4 text-center text-slate-300">{grade.assignmentScore}</td>
                                                <td className="p-4 text-center text-slate-300">{grade.midExamScore}</td>
                                                <td className="p-4 text-center text-slate-300">{grade.finalExamScore}</td>
                                                <td className="p-4 text-center font-bold text-white">{grade.finalScore?.toFixed(1) || "0.0"}</td>
                                                <td className="p-4 text-center">
                                                    <span className={`px-2.5 py-1 rounded-md text-xs font-extrabold ${
                                                        ["A", "B"].includes(grade.gradeLetter) 
                                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" 
                                                            : ["C", "D"].includes(grade.gradeLetter)
                                                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                                                            : "bg-red-500/10 text-red-400 border border-red-500/25"
                                                    }`}>
                                                        {grade.gradeLetter || "-"}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleOpenUpdate(grade)}
                                                            className="bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-white p-2 rounded-lg border border-amber-500/20 transition-all"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => { setSelectedGrade(grade); setShowDeleteModal(true); }}
                                                            className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white p-2 rounded-lg border border-red-500/20 transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
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
                        <p className="text-xs md:text-sm text-slate-400">Showing {filteredGrades.length} of {pagination.totalElements} entries</p>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                disabled={pagination.page === 0}
                                onClick={() => getGrades(pagination.page - 1)}
                                className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-xl text-sm disabled:opacity-40 transition-all flex items-center justify-center gap-1"
                            >
                                <ChevronLeft size={16} /> Previous
                            </button>
                            <button
                                disabled={pagination.last}
                                onClick={() => getGrades(pagination.page + 1)}
                                className="flex-1 sm:flex-none px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm disabled:opacity-40 transition-all flex items-center justify-center gap-1"
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL MUTASI (CREATE & UPDATE) */}
            {(showCreateModal || showUpdateModal) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
                    <form 
                        onSubmit={showCreateModal ? handleCreateGrade : handleUpdateGrade}
                        className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-4 my-8"
                    >
                        <h2 className="text-xl font-bold text-white">
                            {showCreateModal ? "Input Student Grade" : "Update Student Grade"}
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium">Student ID *</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="e.g. 12"
                                    value={formData.studentId}
                                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700/60 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium">Teacher ID *</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="e.g. 4"
                                    value={formData.teacherId}
                                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700/60 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium">Subject ID *</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="e.g. 2"
                                    value={formData.subjectId}
                                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700/60 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium">Class Name *</label>
                                <input
                                    required
                                    placeholder="e.g. XMIPA-1"
                                    value={formData.className}
                                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700/60 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500"
                                />
                            </div>
                        </div>

                        <div className="bg-slate-950/40 p-4 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium">Assignment Score *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    min="0"
                                    max="100"
                                    placeholder="0-100"
                                    value={formData.assignmentScore}
                                    onChange={(e) => setFormData({ ...formData, assignmentScore: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700/60 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium">Mid Exam (UTS) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    min="0"
                                    max="100"
                                    placeholder="0-100"
                                    value={formData.midExamScore}
                                    onChange={(e) => setFormData({ ...formData, midExamScore: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700/60 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium">Final Exam (UAS) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    min="0"
                                    max="100"
                                    placeholder="0-100"
                                    value={formData.finalExamScore}
                                    onChange={(e) => setFormData({ ...formData, finalExamScore: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700/60 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                            <button
                                type="button"
                                onClick={() => { setShowCreateModal(false); setShowUpdateModal(false); }}
                                className="px-4 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 text-sm font-medium bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white shadow-lg shadow-cyan-600/10 transition-colors"
                            >
                                Save Assessment
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* DELETE ALERT MODAL */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center space-y-4">
                        <div className="mx-auto bg-red-500/10 p-3 rounded-full border border-red-500/20 w-fit">
                            <Trash2 size={26} className="text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Delete Grade Record?</h2>
                            <p className="text-sm text-slate-400 mt-1">
                                Are you sure you want to remove the grade matrix for student <span className="text-white font-semibold">{selectedGrade?.studentName}</span>? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeleteGrade}
                                className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-500 rounded-xl text-white transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GradeManagement;