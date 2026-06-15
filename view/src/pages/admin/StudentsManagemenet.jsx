/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { 
    Search, 
    Plus, 
    Pencil, 
    Trash2, 
    Users, 
    ChevronLeft, 
    ChevronRight, 
    Menu, 
    Loader2, 
    X, 
    Eye, 
    Calendar, 
    Phone, 
    Mail, 
    MapPin, 
    Award, 
    ShieldCheck
} from "lucide-react";
import AdminSidebar from "../../components/SidebarAdmin"; 

const StudentManagement = () => {
    const token = localStorage.getItem("token");
    const BASE_URL = "http://localhost:8098/studentSvc/api/students";

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0, last: true });
    
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false); 
    const [selectedStudent, setSelectedStudent] = useState(null);

    const classOptions = ["X RPL", "XI RPL", "XII RPL", "X TKJ", "XI TKJ", "XII TKJ"];

    const initialFormState = {
        nis: "", fullName: "", gender: "", birthDate: "", phoneNumber: "",
        email: "", address: "", className: "", major: "", parentName: "", parentPhone: ""
    };
    const [formData, setFormData] = useState(initialFormState);

    const getStudents = async (page = 0) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${BASE_URL}/get-all-students?page=${page}&size=10`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
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
    console.log(students);

    const filteredStudents = students.filter(student =>
        student.nis?.toLowerCase().includes(keyword.toLowerCase()) ||
        student.fullName?.toLowerCase().includes(keyword.toLowerCase())
    );

    const handleOpenCreate = () => {
        setFormData(initialFormState);
        setShowCreateModal(true);
    };

    const handleOpenDetail = (student) => {
        setSelectedStudent(student);
        setShowDetailModal(true);
    };

    const handleOpenUpdate = (student) => {
        setSelectedStudent(student);
        setFormData({
            nis: student.nis || "",
            fullName: student.fullName || "",
            gender: student.gender || "",
            birthDate: student.birthDate || "",
            phoneNumber: student.phoneNumber || "",
            email: student.email || "",
            address: student.address || "",
            className: student.className || "",
            major: student.major || "",
            parentName: student.parentName || "",
            parentPhone: student.parentPhone || ""
        });
        setShowUpdateModal(true);
    };

    // ==========================================
    // FORM SUBMIT HANDLERS
    // ==========================================
    const handleCreateStudent = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BASE_URL}/create-student`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setShowCreateModal(false);
                getStudents(pagination.page);
            } else {
                const errText = await response.text();
                alert(`Failed to create: ${errText}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BASE_URL}/update-student/${selectedStudent.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setShowUpdateModal(false);
                getStudents(pagination.page);
            } else {
                const errText = await response.text();
                alert(`Failed to update: ${errText}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteStudent = async () => {
        try {
            const response = await fetch(`${BASE_URL}/delete-student/${selectedStudent.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                setShowDeleteModal(false);
                getStudents(0);
            } else {
                const errText = await response.text();
                alert(`Failed to delete: ${errText}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex bg-slate-950 min-h-screen text-slate-100 antialiased overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
            
            {/* INTEGRASI SIDEBAR */}
            <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 min-w-0 flex flex-col transition-all duration-300 ease-in-out">
                
                {/* TOP BAR / TOGGLE HEADER */}
                <header className="bg-slate-900/40 border-b border-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center sticky top-0 z-40">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 bg-slate-900 border border-slate-800/80 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-all duration-200 active:scale-95 shadow-inner cursor-pointer"
                        title="Toggle Sidebar"
                    >
                        <Menu size={20} />
                    </button>
                </header>

                {/* CONTENT CONTAINER */}
                <div className="p-4 md:p-8 space-y-8 flex-1 overflow-y-auto max-w-7xl w-full mx-auto animate-fade-in">
                    
                    {/* BANNER HEADER */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-linear-to-r from-slate-900/60 to-slate-900/20 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-md shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-all duration-700 pointer-events-none" />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                                Student Management
                            </h1>
                            <p className="text-sm text-slate-400 mt-1">Manage and monitor all student digital records seamlessly</p>
                        </div>
                        <button
                            onClick={handleOpenCreate}
                            className="w-full sm:w-auto bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 active:scale-95 border border-cyan-400/20 group/btn cursor-pointer"
                        >
                            <Plus size={18} className="group-hover/btn:rotate-90 transition-transform duration-300" /> Add Student
                        </button>
                    </div>

                    {/* STATISTICS */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="bg-linear-to-b from-slate-900 to-slate-950 border border-slate-800/60 rounded-2xl p-5 flex items-center justify-between shadow-lg relative group overflow-hidden transition-all duration-300 hover:border-cyan-500/30">
                            <div className="absolute inset-0 bg-cyan-500/1 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Students</p>
                                <h2 className="text-3xl font-bold tracking-tight text-white mt-1.5">{pagination.totalElements}</h2>
                            </div>
                            <div className="bg-cyan-500/10 p-3.5 rounded-xl border border-cyan-500/20 text-cyan-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                <Users size={22} />
                            </div>
                        </div>
                        <div className="bg-linear-to-b from-slate-900 to-slate-950 border border-slate-800/60 rounded-2xl p-5 shadow-lg transition-all duration-300 hover:border-slate-700">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Page</p>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-200 mt-1.5">{pagination.page + 1}</h2>
                        </div>
                        <div className="bg-linear-to-b from-slate-900 to-slate-950 border border-slate-800/60 rounded-2xl p-5 shadow-lg transition-all duration-300 hover:border-slate-700">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Pages</p>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-200 mt-1.5">{pagination.totalPages}</h2>
                        </div>
                    </div>

                    {/* SEARCHBAR */}
                    <div className="relative group max-w-md">
                        <Search className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by NIS or Name..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/80 focus:ring-4 focus:ring-cyan-500/10 transition-all duration-200"
                        />
                    </div>

                    {/* TABLE AREA */}
                    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-sm">
                                <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-300 font-semibold tracking-wide uppercase text-xs">
                                    <tr>
                                        <th className="p-4 pl-6">NIS</th>
                                        <th className="p-4">Full Name</th>
                                        <th className="p-4">Gender</th>
                                        <th className="p-4">Class</th>
                                        <th className="p-4 pr-6 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="p-16 text-center text-slate-400">
                                                <div className="flex flex-col items-center justify-center gap-3">
                                                    <Loader2 className="animate-spin text-cyan-500" size={32} />
                                                    <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">Fetching latest records...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center p-16 text-slate-500 font-medium">No student records found.</td>
                                        </tr>
                                    ) : (
                                        filteredStudents.map((student) => (
                                            <tr key={student.id} className="hover:bg-slate-800/30 transition-all duration-150 group/row">
                                                <td className="p-4 pl-6 font-mono font-medium text-cyan-400 group-hover/row:text-cyan-300">{student.nis}</td>
                                                <td className="p-4 font-semibold text-white tracking-wide">{student.fullName}</td>
                                                <td className="p-4 text-slate-300 font-medium">{student.gender}</td>
                                                <td className="p-4">
                                                    <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg text-xs font-medium tracking-wide">
                                                        {student.className}
                                                    </span>
                                                </td>
                                                <td className="p-4 pr-6">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleOpenDetail(student)}
                                                            className="bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 p-2 rounded-xl border border-cyan-500/20 hover:border-cyan-400 transition-all duration-200 active:scale-90 shadow-md cursor-pointer"
                                                            title="View Profile Details"
                                                        >
                                                            <Eye size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenUpdate(student)}
                                                            className="bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-white p-2 rounded-xl border border-amber-500/20 hover:border-amber-400 transition-all duration-200 active:scale-90 shadow-md cursor-pointer"
                                                            title="Edit data"
                                                        >
                                                            <Pencil size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => { setSelectedStudent(student); setShowDeleteModal(true); }}
                                                            className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white p-2 rounded-xl border border-red-500/20 hover:border-red-400 transition-all duration-200 active:scale-90 shadow-md cursor-pointer"
                                                            title="Delete data"
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

                    {/* PAGINATION */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                        <p className="text-xs md:text-sm text-slate-400 font-medium">
                            Showing <span className="text-white font-semibold">{filteredStudents.length}</span> of <span className="text-white font-semibold">{pagination.totalElements}</span> entries
                        </p>
                        <div className="flex gap-2.5 w-full sm:w-auto">
                            <button
                                disabled={pagination.page === 0}
                                onClick={() => getStudents(pagination.page - 1)}
                                className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-xl text-sm font-medium disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                            >
                                <ChevronLeft size={16} /> Previous
                            </button>
                            <button
                                disabled={pagination.last}
                                onClick={() => getStudents(pagination.page + 1)}
                                className="flex-1 sm:flex-none px-5 py-2 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-sm font-medium disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 shadow-md shadow-cyan-600/5 cursor-pointer"
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==========================================
                POPUP DETAIL STUDENT MODAL
               ========================================== */}
            {showDetailModal && selectedStudent && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4 overflow-y-auto animate-fade-in">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-6 transform transition-all scale-100 animate-scale-up relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />
                        
                        <button 
                            type="button" 
                            onClick={() => setShowDetailModal(false)}
                            className="absolute right-4 top-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex flex-col items-center text-center space-y-3 pt-2">
                            <div className="w-20 h-20 rounded-full bg-linear-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
                                <Users size={36} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white tracking-wide">{selectedStudent.fullName}</h2>
                                <p className="text-sm font-mono text-cyan-400 mt-0.5">{selectedStudent.nis}</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-md text-xs font-semibold tracking-wide flex items-center gap-1">
                                    <Award size={12} /> {selectedStudent.className}
                                </span>
                                <span className="px-2.5 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 rounded-md text-xs font-medium">
                                    {selectedStudent.gender}
                                </span>
                            </div>
                        </div>

                        <hr className="border-slate-800/80" />

                        <div className="space-y-4 text-sm">
                            <div className="flex items-start gap-3">
                                <ShieldCheck size={18} className="text-slate-500 mt-0.5" />
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Major Specialization</p>
                                    <p className="text-slate-200 font-medium mt-0.5">{selectedStudent.major || "-"}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <Calendar size={18} className="text-slate-500 mt-0.5" />
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Birth Date</p>
                                    <p className="text-slate-200 font-medium mt-0.5">{selectedStudent.birthDate || "-"}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Phone size={18} className="text-slate-500 mt-0.5" />
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Contact Number</p>
                                    <p className="text-slate-200 font-medium mt-0.5">{selectedStudent.phoneNumber || "-"}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Mail size={18} className="text-slate-500 mt-0.5" />
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Email Address</p>
                                    <p className="text-slate-200 font-mono mt-0.5 break-all">{selectedStudent.email || "-"}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-slate-500 mt-0.5" />
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Home Address</p>
                                    <p className="text-slate-300 mt-0.5 leading-relaxed">{selectedStudent.address || "-"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Parent / Guardian Connection</h3>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <p className="text-slate-500 font-medium">Name</p>
                                    <p className="text-slate-200 font-semibold mt-0.5">{selectedStudent.parentName || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 font-medium">Phone</p>
                                    <p className="text-slate-200 font-semibold mt-0.5">{selectedStudent.parentPhone || "-"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => setShowDetailModal(false)}
                                className="w-full py-2.5 text-center text-sm font-semibold bg-slate-800 hover:bg-slate-700/80 text-white rounded-xl transition-all duration-200 active:scale-98 cursor-pointer"
                            >
                                Close Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ==========================================
                MODAL CREATE / UPDATE FORM
               ========================================== */}
            {(showCreateModal || showUpdateModal) && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4 overflow-y-auto animate-fade-in">
                    <form 
                        onSubmit={showCreateModal ? handleCreateStudent : handleUpdateStudent}
                        className="bg-slate-900/95 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-5 my-8 transform transition-all scale-100 animate-scale-up backdrop-blur-lg relative"
                    >
                        <button 
                            type="button" 
                            onClick={() => { setShowCreateModal(false); setShowUpdateModal(false); }}
                            className="absolute right-4 top-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                        
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-wide">
                                {showCreateModal ? "Add New Student Record" : "Modify Student Record"}
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">Fill in the necessary field data correctly.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-400 font-semibold tracking-wider uppercase">NIS *</label>
                                <input
                                    required
                                    placeholder="e.g. 1012003"
                                    value={formData.nis}
                                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Full Name *</label>
                                <input
                                    required
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Gender</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500 transition-all"
                                >
                                    <option value="" className="bg-slate-950">Select Gender</option>
                                    <option value="Laki-laki" className="bg-slate-950">Laki-laki</option>
                                    <option value="Perempuan" className="bg-slate-950">Perempuan</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Birth Date</label>
                                <input
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500 transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Class Name</label>
                                <select
                                    value={formData.className}
                                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500 transition-all"
                                >
                                    <option value="" className="bg-slate-950">Select Class</option>
                                    {classOptions.map((item) => (
                                        <option key={item} value={item} className="bg-slate-950">{item}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Major</label>
                                <input
                                    placeholder="e.g. Rekayasa Perangkat Lunak"
                                    value={formData.major}
                                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500 transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Email</label>
                                <input
                                    type="email"
                                    placeholder="student@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500 transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Phone Number</label>
                                <input
                                    placeholder="e.g. 08123456789"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500 transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Parent/Guardian Name</label>
                                <input
                                    placeholder="Parent Name"
                                    value={formData.parentName}
                                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500 transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Parent/Guardian Phone</label>
                                <input
                                    placeholder="Parent Phone Number"
                                    value={formData.parentPhone}
                                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Home Address</label>
                            <textarea
                                placeholder="Enter full address details..."
                                rows={3}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 p-2.5 text-sm rounded-xl text-white outline-none focus:border-cyan-500 transition-all resize-none"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => { setShowCreateModal(false); setShowUpdateModal(false); }}
                                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 font-medium text-sm transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-medium text-sm transition-all active:scale-95 shadow-md shadow-cyan-500/10 cursor-pointer"
                            >
                                {showCreateModal ? "Save Record" : "Apply Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ==========================================
                MODAL CONFIRM DELETE
               ========================================== */}
            {showDeleteModal && selectedStudent && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-fade-in">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl space-y-4 text-center transform transition-all scale-100 animate-scale-up">
                        <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <Trash2 size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Remove Student Record?</h3>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                Are you sure you want to delete <span className="text-white font-semibold">{selectedStudent.fullName}</span>? This action is permanent.
                            </p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-xl transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteStudent}
                                className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-sm rounded-xl transition-colors shadow-md shadow-red-600/10 cursor-pointer"
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

export default StudentManagement;