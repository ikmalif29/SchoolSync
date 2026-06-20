/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2, GraduationCap, ChevronLeft, ChevronRight, Menu, Eye, X, Phone, Mail, MapPin, User, ShieldCheck } from "lucide-react";
import AdminSidebar from "../../components/SidebarAdmin"; 

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
    const [showDetailModal, setShowDetailModal] = useState(false);
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

    // Filter Pencarian
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
            subjectId: teacher.subjectId !== null ? String(teacher.subjectId) : "",
            email: teacher.email || "",
            address: teacher.address || ""
        });
        setShowUpdateModal(true);
    };

    const handleOpenDetail = (teacher) => {
        setSelectedTeacher(teacher);
        setShowDetailModal(true);
    };

    const handleCreateTeacher = async (e) => {
        e.preventDefault();
        try {
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
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setShowCreateModal(false);
                setFormData(initialFormState);
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
            const payload = {
                nip: formData.nip,
                fullName: formData.fullName,
                gender: formData.gender,
                phoneNumber: formData.phoneNumber,
                subjectId: formData.subjectId ? Number(formData.subjectId) : 0,
                email: formData.email,
                address: formData.address
            };

            const response = await fetch(`${BASE_URL}/update-teacher/${selectedTeacher.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setShowUpdateModal(false);
                setSelectedTeacher(null);
                setFormData(initialFormState);
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
                setSelectedTeacher(null);
                getTeachers(0);
            } else {
                const errText = await response.text();
                alert(`Failed to delete: ${errText}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex bg-slate-50 min-h-screen text-slate-800 antialiased overflow-x-hidden">

            {/* ADMIN SIDEBAR */}
            <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 min-w-0 flex flex-col">

                {/* HEADER TOPBAR */}
                <header className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-4 flex items-center shadow-xs">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all active:scale-95 shadow-xs cursor-pointer"
                        title="Toggle Sidebar"
                    >
                        <Menu size={20} />
                    </button>
                </header>

                {/* CONTENT CONTAINER */}
                <div className="p-4 md:p-8 space-y-6 flex-1 overflow-y-auto">

                    {/* TITLE CARD */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                                Teacher Management
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">Manage and assign teaching staff credentials</p>
                        </div>
                        <button
                            onClick={handleOpenCreate}
                            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-md shadow-indigo-600/10 cursor-pointer"
                        >
                            <Plus size={18} /> Add Teacher
                        </button>
                    </div>

                    {/* STATISTICS SUMMARY */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white border border-slate-200/60 rounded-xl p-5 flex items-center justify-between shadow-xs">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Teachers</p>
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">{pagination.totalElements}</h2>
                            </div>
                            <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                                <GraduationCap size={24} className="text-indigo-600" />
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-xs">
                            <p className="text-sm font-medium text-slate-500">Current Page</p>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">{pagination.page + 1}</h2>
                        </div>
                        <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-xs">
                            <p className="text-sm font-medium text-slate-500">Total Pages</p>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">{pagination.totalPages}</h2>
                        </div>
                    </div>

                    {/* SEARCH INPUT */}
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by NIP or Full Name..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all shadow-xs"
                        />
                    </div>

                    {/* DATA TABLE */}
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                                    <tr>
                                        <th className="p-4">NIP</th>
                                        <th className="p-4">Full Name</th>
                                        <th className="p-4">Gender</th>
                                        <th className="p-4">Subject ID</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {loading ? (
                                        <tr><td colSpan="6" className="text-center p-12 text-slate-400">Loading records...</td></tr>
                                    ) : filteredTeachers.length === 0 ? (
                                        <tr><td colSpan="6" className="text-center p-12 text-slate-400">No teacher found.</td></tr>
                                    ) : (
                                        filteredTeachers.map((teacher) => (
                                            <tr key={teacher.id} className="hover:bg-slate-50/80 transition-colors duration-150">
                                                <td className="p-4 font-mono font-medium text-indigo-600">{teacher.nip || "-"}</td>
                                                <td className="p-4 font-medium text-slate-900">{teacher.fullName}</td>
                                                <td className="p-4 text-slate-500">{teacher.gender || "-"}</td>
                                                <td className="p-4 text-slate-600">
                                                    <span className="px-2 py-1 bg-slate-100 rounded-md border border-slate-200 text-xs font-medium text-slate-600">
                                                        ID: {teacher.subjectId !== null ? teacher.subjectId : "-"}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-md text-xs font-semibold inline-flex items-center gap-1 ${teacher.status === "ACTIVE"
                                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                        : "bg-slate-100 text-slate-600 border border-slate-200"
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${teacher.status === "ACTIVE" ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                                                        {teacher.status || "ACTIVE"}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-center gap-1.5">
                                                        <button
                                                            onClick={() => handleOpenDetail(teacher)}
                                                            className="bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 p-2 rounded-lg border border-slate-200 transition-all shadow-xs cursor-pointer"
                                                            title="Detail Info"
                                                        >
                                                            <Eye size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenUpdate(teacher)}
                                                            className="bg-white hover:bg-amber-50 text-amber-600 hover:text-amber-700 p-2 rounded-lg border border-slate-200 hover:border-amber-200 transition-all shadow-xs cursor-pointer"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => { setSelectedTeacher(teacher); setShowDeleteModal(true); }}
                                                            className="bg-white hover:bg-red-50 text-red-500 hover:text-red-600 p-2 rounded-lg border border-slate-200 hover:border-red-200 transition-all shadow-xs cursor-pointer"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={15} />
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
                        <p className="text-xs md:text-sm text-slate-500">Showing {filteredTeachers.length} of {pagination.totalElements} entries</p>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                disabled={pagination.page === 0}
                                onClick={() => getTeachers(pagination.page - 1)}
                                className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm disabled:opacity-40 transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                            >
                                <ChevronLeft size={16} /> Previous
                            </button>
                            <button
                                disabled={pagination.last}
                                onClick={() => getTeachers(pagination.page + 1)}
                                className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm disabled:opacity-40 transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL MUTASI (CREATE & UPDATE) */}
            {(showCreateModal || showUpdateModal) && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-50 p-4 overflow-y-auto">
                    <form
                        onSubmit={showCreateModal ? handleCreateTeacher : handleUpdateTeacher}
                        className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl p-6 shadow-xl space-y-4 my-8"
                    >
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900">
                                {showCreateModal ? "Create Teacher Data" : "Update Teacher Data"}
                            </h2>
                            <button 
                                type="button" 
                                onClick={() => { setShowCreateModal(false); setShowUpdateModal(false); }}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-slate-600 font-semibold">NIP *</label>
                                <input
                                    required
                                    placeholder="e.g. 19890115..."
                                    value={formData.nip}
                                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-600 font-semibold">Full Name *</label>
                                <input
                                    required
                                    placeholder="Teacher Full Name"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-600 font-semibold">Gender *</label>
                                <select
                                    required
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm rounded-xl text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-600 font-semibold">Phone Number *</label>
                                <input
                                    required
                                    placeholder="e.g. 081298765432"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-600 font-semibold">Subject ID (Long)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 1"
                                    value={formData.subjectId}
                                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-600 font-semibold">Email Address *</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="teacher@sekolah.sch.id"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-slate-600 font-semibold">Address *</label>
                            <textarea
                                rows="2"
                                required
                                placeholder="Full Address Here..."
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => { setShowCreateModal(false); setShowUpdateModal(false); }}
                                className="px-4 py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white shadow-md shadow-indigo-600/10 transition-colors cursor-pointer"
                            >
                                Save Data
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ACTION DETAIL INFO MODAL */}
            {showDetailModal && selectedTeacher && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-50 p-4">
                    <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 shadow-xl space-y-6">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <User size={18} className="text-indigo-600" /> Teacher Profile
                            </h2>
                            <button 
                                onClick={() => { setShowDetailModal(false); setSelectedTeacher(null); }}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-indigo-100 border border-indigo-200 rounded-full flex items-center justify-center text-indigo-600 mb-2 font-bold text-xl">
                                    {selectedTeacher.fullName?.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="text-base font-bold text-slate-900">{selectedTeacher.fullName}</h3>
                                <p className="text-xs font-mono text-indigo-600 mt-0.5">NIP: {selectedTeacher.nip || "-"}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 text-sm">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <ShieldCheck size={16} className="text-slate-400 shrink-0" />
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium">Status & Role</p>
                                        <p className="text-slate-900 font-medium text-xs mt-0.5">
                                            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded">
                                                {selectedTeacher.status || "ACTIVE"}
                                            </span>
                                            <span className="ml-1.5 px-1.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded">
                                                TEACHER
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-slate-600">
                                    <User size={16} className="text-slate-400 shrink-0" />
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium">Gender</p>
                                        <p className="text-slate-900 font-medium">{selectedTeacher.gender || "-"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-slate-600">
                                    <GraduationCap size={16} className="text-slate-400 shrink-0" />
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium">Subject Assignment ID</p>
                                        <p className="text-slate-900 font-medium">ID: {selectedTeacher.subjectId !== null ? selectedTeacher.subjectId : "-"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-slate-600">
                                    <Phone size={16} className="text-slate-400 shrink-0" />
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium">Phone Number</p>
                                        <p className="text-slate-900 font-medium">{selectedTeacher.phoneNumber || "-"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-slate-600">
                                    <Mail size={16} className="text-slate-400 shrink-0" />
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium">Email Address</p>
                                        <p className="text-slate-900 font-medium break-all">{selectedTeacher.email || "-"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 text-slate-600">
                                    <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium">Full Address</p>
                                        <p className="text-slate-900 font-medium leading-relaxed">{selectedTeacher.address || "-"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={() => { setShowDetailModal(false); setSelectedTeacher(null); }}
                                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm transition-colors cursor-pointer"
                            >
                                Close Detail
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE ALERT MODAL */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-50 p-4">
                    <div className="bg-white border border-slate-200 w-full max-w-sm rounded-2xl p-6 shadow-xl text-center space-y-4">
                        <div className="mx-auto bg-red-50 p-3 rounded-full border border-red-100 w-fit">
                            <Trash2 size={26} className="text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Delete Teacher?</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Are you sure you want to remove <span className="text-slate-900 font-semibold">{selectedTeacher?.fullName}</span>? This action is permanent.
                            </p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteTeacher}
                                className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 rounded-xl text-white transition-colors cursor-pointer"
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