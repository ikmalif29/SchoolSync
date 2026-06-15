/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2, GraduationCap, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import AdminSidebar from "../../components/SidebarAdmin"; // Sesuaikan path ini dengan project Anda

const TeacherManagement = () => {
    const token = localStorage.getItem("token");
    const BASE_URL = "http://localhost:8098/teacherSvc/api/teacher";

    // State Kontrol Sidebar Toggle
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // State CRUD & Data
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0, last: true });

    // State Modal
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    // Initial State sesuai CreateTeacherRequest DTO
    const initialFormState = {
        nip: "",
        fullName: "",
        gender: "",
        phoneNumber: "",
        subjectId: "",
        email: "",
        address: ""
    };
    const [formData, setFormData] = useState(initialFormState);

    // Fetch All Teachers
    const getTeachers = async (page = 0) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${BASE_URL}/get-all-teacher?page=${page}&size=10`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            const result = await response.json();

            setTeachers(result?.data?.content || []);
            setPagination({
                page: result?.data?.page || 0,
                totalPages: result?.data?.totalPages || 0,
                totalElements: result?.data?.totalElements || 0,
                last: result?.data?.last ?? true
            });
        } catch (error) {
            console.error("Error fetching teachers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTeachers();
    }, []);

    // Filter Client-side untuk baris data yang sedang tampil
    const filteredTeachers = teachers.filter(teacher =>
        teacher.nip?.toLowerCase().includes(keyword.toLowerCase()) ||
        teacher.fullName?.toLowerCase().includes(keyword.toLowerCase())
    );

    const handleOpenCreate = () => {
        setFormData(initialFormState);
        setShowCreateModal(true);
    };

    const handleOpenUpdate = (teacher) => {
        setSelectedTeacher(teacher);
        setFormData({
            nip: teacher.nip || "",
            fullName: teacher.fullName || "",
            gender: teacher.gender || "",
            phoneNumber: teacher.phoneNumber || "",
            subjectId: teacher.subjectId || "",
            email: teacher.email || "",
            address: teacher.address || ""
        });
        setShowUpdateModal(true);
    };

    const handleCreateTeacher = async (e) => {
        e.preventDefault();
        try {
            // Ubah menjadi objek JavaScript biasa untuk di-stringify ke JSON
            const payload = {
                nip: formData.nip,
                fullName: formData.fullName,
                gender: formData.gender,
                phoneNumber: formData.phoneNumber,
                subjectId: formData.subjectId ? Number(formData.subjectId) : 0,
                email: formData.email,
                address: formData.address
            };

            const response = await fetch(`${BASE_URL}/create-teacher`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Ganti ke JSON
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload) // Kirim sebagai string JSON
            });

            if (response.ok) {
                setShowCreateModal(false);
                getTeachers(pagination.page);
            } else {
                const errText = await response.text();
                alert(`Failed to create: ${errText}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateTeacher = async (e) => {
        e.preventDefault();
        try {
            const params = new URLSearchParams();
            params.append("nip", formData.nip);
            params.append("fullName", formData.fullName);
            params.append("gender", formData.gender);
            params.append("phoneNumber", formData.phoneNumber);
            params.append("subjectId", formData.subjectId ? String(formData.subjectId) : "0");
            params.append("email", formData.email);
            params.append("address", formData.address);

            const response = await fetch(`${BASE_URL}/update-teacher/${selectedTeacher.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${token}`
                },
                body: params.toString()
            });

            if (response.ok) {
                setShowUpdateModal(false);
                getTeachers(pagination.page);
            } else {
                const errText = await response.text();
                alert(`Failed to update: ${errText}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteTeacher = async () => {
        try {
            const response = await fetch(`${BASE_URL}/delete-teacher/${selectedTeacher.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                setShowDeleteModal(false);
                getTeachers(0); // Kembali ke halaman pertama
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
                                Teacher Management
                            </h1>
                            <p className="text-sm text-slate-400 mt-1">Manage and assign teaching staff credentials</p>
                        </div>
                        <button
                            onClick={handleOpenCreate}
                            className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-lg shadow-cyan-600/10"
                        >
                            <Plus size={18} /> Add Teacher
                        </button>
                    </div>

                    {/* STATISTICS SUMMARY */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-900 border border-slate-800/60 rounded-xl p-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-400">Total Teachers</p>
                                <h2 className="text-3xl font-bold tracking-tight text-white mt-1">{pagination.totalElements}</h2>
                            </div>
                            <div className="bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/20">
                                <GraduationCap size={24} className="text-cyan-400" />
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
                            placeholder="Search by NIP or Full Name..."
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
                                        <th className="p-4">NIP</th>
                                        <th className="p-4">Full Name</th>
                                        <th className="p-4">Gender</th>
                                        <th className="p-4">Subject ID</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {loading ? (
                                        <tr><td colSpan="6" className="text-center p-12 text-slate-400">Loading records...</td></tr>
                                    ) : filteredTeachers.length === 0 ? (
                                        <tr><td colSpan="6" className="text-center p-12 text-slate-400">No teacher found.</td></tr>
                                    ) : (
                                        filteredTeachers.map((teacher) => (
                                            <tr key={teacher.id} className="hover:bg-slate-800/30 transition-colors duration-150">
                                                <td className="p-4 font-mono text-cyan-400">{teacher.nip || "-"}</td>
                                                <td className="p-4 font-medium text-white">{teacher.fullName}</td>
                                                <td className="p-4 text-slate-300">{teacher.gender || "-"}</td>
                                                <td className="p-4 text-slate-300">
                                                    <span className="px-2 py-1 bg-slate-800 rounded-md border border-slate-700/50 text-xs">
                                                        ID: {teacher.subjectId || "0"}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${teacher.status === "ACTIVE" || teacher.status === null
                                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                            : "bg-slate-800 text-slate-400"
                                                        }`}>
                                                        {teacher.status || "ACTIVE"}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleOpenUpdate(teacher)}
                                                            className="bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-white p-2 rounded-lg border border-amber-500/20 transition-all"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => { setSelectedTeacher(teacher); setShowDeleteModal(true); }}
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
                        <p className="text-xs md:text-sm text-slate-400">Showing {filteredTeachers.length} of {pagination.totalElements} entries</p>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                disabled={pagination.page === 0}
                                onClick={() => getTeachers(pagination.page - 1)}
                                className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-xl text-sm disabled:opacity-40 transition-all flex items-center justify-center gap-1"
                            >
                                <ChevronLeft size={16} /> Previous
                            </button>
                            <button
                                disabled={pagination.last}
                                onClick={() => getTeachers(pagination.page + 1)}
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
                        onSubmit={showCreateModal ? handleCreateTeacher : handleUpdateTeacher}
                        className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-4 my-8"
                    >
                        <h2 className="text-xl font-bold text-white">
                            {showCreateModal ? "Create Teacher Data" : "Update Teacher Data"}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium">NIP *</label>
                                <input
                                    required
                                    placeholder="e.g. 19800102..."
                                    value={formData.nip}
                                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700/60 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium">Full Name *</label>
                                <input
                                    required
                                    placeholder="Teacher Full Name"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700/60 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium">Gender *</label>
                                <select
                                    required
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700/60 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500"
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium">Phone Number *</label>
                                <input
                                    required
                                    placeholder="e.g. 081234567"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700/60 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium">Subject ID (Long) *</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="e.g. 1"
                                    value={formData.subjectId}
                                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700/60 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium">Email Address *</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="teacher@school.sch.id"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700/60 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-slate-400 font-medium">Address *</label>
                            <textarea
                                rows="2"
                                required
                                placeholder="Full Address Here..."
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700/60 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500 resize-none"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
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
                                Save Data
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
                            <h2 className="text-lg font-bold text-white">Delete Teacher?</h2>
                            <p className="text-sm text-slate-400 mt-1">
                                Are you sure you want to remove <span className="text-white font-semibold">{selectedTeacher?.fullName}</span>? This action is permanent.
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
                                onClick={handleDeleteTeacher}
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

export default TeacherManagement;