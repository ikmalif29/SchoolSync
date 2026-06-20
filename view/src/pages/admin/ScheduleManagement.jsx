/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Trash2, Edit3, Calendar, Clock, User, Users, X, 
    CheckCircle, AlertTriangle, ChevronLeft, ChevronRight, Menu, Info
} from 'lucide-react';

// 📝 Import Sidebar dari folder komponen kamu
import AdminSidebar from '../../components/SidebarAdmin';

const SCHEDULE_URL = "http://localhost:8098/subjectSvc/api/schedules";
const DAYS_OF_WEEK = ['ALL', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export default function ScheduleManagement() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [toast, setToast] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // 🌟 State Baru untuk Popup Kustom & Detail Info
    const [deleteTargetId, setDeleteTargetId] = useState(null); 
    const [detailSchedule, setDetailSchedule] = useState(null); 

    // Filter & Pagination State
    const [selectedDay, setSelectedDay] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(6);
    const [paginationInfo, setPaginationInfo] = useState({
        totalElements: 0,
        totalPages: 0,
        last: true
    });

    // Form State
    const [formData, setFormData] = useState({
        subjectId: '',
        teacherId: '',
        dayOfWeek: 'MONDAY',
        startTime: '07:00',
        studentIds: ''
    });

    useEffect(() => {
        fetchSchedules();
    }, [currentPage, selectedDay]);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            showToast('Token tidak ditemukan! Silakan login kembali.', 'error');
            return null;
        }
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    const fetchSchedules = async () => {
        const headers = getAuthHeaders();
        if (!headers) return;

        setIsLoading(true);
        try {
            let queryParams = `page=${currentPage}&size=${pageSize}`;
            if (selectedDay !== 'ALL') {
                queryParams += `&dayOfWeek=${selectedDay}`;
            }

            const res = await fetch(`${SCHEDULE_URL}/get-all?${queryParams}`, {
                method: 'GET',
                headers: headers
            });

            const resData = await res.json();
            if (res.ok && resData.data) {
                setSchedules(resData.data.content || []);
                setPaginationInfo({
                    totalElements: resData.data.totalElements || 0,
                    totalPages: resData.data.totalPages || 0,
                    last: resData.data.last !== undefined ? resData.data.last : true
                });
            }
        } catch (err) {
            showToast('Gagal memuat daftar jadwal', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    console.log(schedules);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const headers = getAuthHeaders();
        if (!headers) return;

        const payload = {
            subjectId: Number(formData.subjectId),
            teacherId: Number(formData.teacherId),
            dayOfWeek: formData.dayOfWeek,
            startTime: formData.startTime,
            studentIds: formData.studentIds.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id))
        };

        try {
            const url = editingSchedule ? `${SCHEDULE_URL}/update-schedule/${editingSchedule.id}` : `${SCHEDULE_URL}/create`;
            const method = editingSchedule ? 'PUT' : 'POST';

            const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
            const resData = await res.json();

            if (res.ok) {
                showToast(editingSchedule ? 'Jadwal berhasil diperbarui!' : 'Jadwal baru berhasil dibuat!');
                setIsModalOpen(false);
                resetForm();
                fetchSchedules();
            } else {
                showToast(resData.message || 'Terjadi kesalahan validasi', 'error');
            }
        } catch (err) {
            showToast('Gagal terhubung ke server', 'error');
        }
    };

    // 🌟 Aksi Eksekusi Hapus dari Popup Kustom
    const confirmDelete = async () => {
        if (!deleteTargetId) return;
        const headers = getAuthHeaders();
        if (!headers) return;

        try {
            const res = await fetch(`${SCHEDULE_URL}/delete-schedule/${deleteTargetId}`, { method: 'DELETE', headers });
            if (res.ok) {
                showToast('Jadwal sukses dihapus dari sistem');
                setDeleteTargetId(null); // Tutup popup konfirmasi
                if (schedules.length === 1 && currentPage > 0) {
                    setCurrentPage(prev => prev - 1);
                } else {
                    fetchSchedules();
                }
            } else {
                showToast('Gagal menghapus jadwal', 'error');
            }
        } catch (err) {
            showToast('Gagal mengirim permintaan penghapusan', 'error');
        }
    };

    const openEditModal = (schedule) => {
        setEditingSchedule(schedule);
        setFormData({
            subjectId: schedule.subjectId.toString(),
            teacherId: schedule.teacherId?.toString() || '',
            dayOfWeek: schedule.dayOfWeek,
            startTime: schedule.startTime,
            studentIds: schedule.studentIds ? schedule.studentIds.join(', ') : ''
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingSchedule(null);
        setFormData({ subjectId: '', teacherId: '', dayOfWeek: 'MONDAY', startTime: '07:00', studentIds: '' });
    };

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
            
            {/* PANGGIL SIDEBAR YANG SUDAH DIPISAH */}
            <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* MAIN CONTENT SPACE */}
            <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto p-4 md:p-8 relative">
                
                {/* Header Panel */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 bg-white border border-slate-100 p-6 rounded-2xl shadow-xs">
                    <div className="flex items-center gap-3">
                        {/* Tombol Hamburger Mobile */}
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all lg:hidden"
                        >
                            <Menu size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                                Schedule Management
                            </h1>
                            <p className="text-slate-500 text-xs md:text-sm mt-0.5">Sistem Proteksi JWT Admin — Secured API Gateway (Port 8098)</p>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, translateY: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-md shadow-indigo-100 transition-all duration-300"
                    >
                        <Plus size={18} /> Tambah Jadwal Baru
                    </motion.button>
                </div>

                {/* Tab Filter Hari */}
                <div className="mb-6 flex flex-wrap gap-1.5 bg-slate-200/60 p-1.5 rounded-xl border border-slate-200/20 backdrop-blur-md overflow-x-auto">
                    {DAYS_OF_WEEK.map((day) => (
                        <button
                            key={day}
                            onClick={() => { setSelectedDay(day); setCurrentPage(0); }}
                            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 ${selectedDay === day ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'}`}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                {/* Grid List Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
                    {isLoading ? (
                        <div className="col-span-full text-center text-slate-400 py-24 animate-pulse text-sm font-medium">
                            Memuat Data Jadwal Kelas...
                        </div>
                    ) : schedules.length === 0 ? (
                        <div className="col-span-full text-center text-slate-400 py-24 border border-dashed border-slate-200 rounded-2xl bg-white shadow-xs">
                            Tidak ada jadwal terdaftar untuk kriteria filter ini.
                        </div>
                    ) : (
                        <AnimatePresence mode='popLayout'>
                            {schedules.map((schedule) => (
                                <motion.div
                                    key={schedule.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="group relative bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-900/2 rounded-2xl p-6 transition-all duration-300 shadow-xs flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg flex items-center gap-1.5">
                                                <Calendar size={12} /> {schedule.dayOfWeek}
                                            </span>
                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <button onClick={() => setDetailSchedule(schedule)} className="p-2 hover:bg-slate-50 rounded-lg text-indigo-500 transition-colors" title="Detail Info"><Info size={15} /></button>
                                                <button onClick={() => openEditModal(schedule)} className="p-2 hover:bg-slate-50 rounded-lg text-amber-500 transition-colors" title="Edit"><Edit3 size={15} /></button>
                                                <button onClick={() => setDeleteTargetId(schedule.id)} className="p-2 hover:bg-rose-50 rounded-lg text-rose-500 transition-colors" title="Hapus"><Trash2 size={15} /></button>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-slate-800 mb-4 line-clamp-1 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500" /> {schedule.subjectName}
                                        </h3>

                                        <div className="space-y-2.5 text-sm text-slate-500 border-t border-slate-50 pt-4">
                                            <div className="flex items-center gap-2.5">
                                                <Clock size={15} className="text-emerald-500" />
                                                <span>Pukul <strong className="text-slate-700 font-semibold">{schedule.startTime} WIB</strong></span>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <User size={15} className="text-sky-500" />
                                                <span>Guru: <strong className="text-slate-700 font-semibold">{schedule.teacherName || 'Belum diatur'}</strong></span>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <Users size={15} className="text-purple-500" />
                                                <span>Siswa: <strong className="text-slate-700 font-semibold">{schedule.studentIds?.length || 0} Terdaftar</strong></span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Control Pagination */}
                {paginationInfo.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-8 bg-white p-4 border border-slate-100 rounded-2xl shadow-xs">
                        <span className="text-xs text-slate-400 font-medium">
                            Menampilkan {schedules.length} dari {paginationInfo.totalElements} data
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                disabled={currentPage === 0}
                                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-xs font-bold px-3 text-indigo-600">
                                {currentPage + 1} / {paginationInfo.totalPages}
                            </span>
                            <button
                                disabled={paginationInfo.last}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal Form Create/Edit */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" />

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-white border border-slate-100 rounded-2xl w-full max-w-md p-6 md:p-8 shadow-2xl relative z-10">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {editingSchedule ? '⚙️ Edit Jadwal Kelas' : '✨ Tambah Jadwal Baru'}
                                    </h2>
                                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">ID Mata Pelajaran</label>
                                        <input type="number" required value={formData.subjectId} onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none transition-all" placeholder="Mata pelajaran ID" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">ID Guru</label>
                                        <input type="number" required value={formData.teacherId} onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none transition-all" placeholder="Guru ID" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Hari</label>
                                            <select value={formData.dayOfWeek} onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2.5 text-slate-800 text-sm focus:outline-none transition-all">
                                                {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'].map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Jam Mulai</label>
                                            <input type="time" required value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2.5 text-slate-800 text-sm focus:outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Daftar ID Siswa (Pisahkan Koma)</label>
                                        <input type="text" required value={formData.studentIds} onChange={(e) => setFormData({ ...formData, studentIds: e.target.value })} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none transition-all" placeholder="Contoh: 101, 102" />
                                    </div>

                                    <button type="submit" className="w-full mt-4 bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300">
                                        {editingSchedule ? 'Simpan Perubahan' : 'Simpan & Publikasikan'}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* 🌟 1. POPUP KONFIRMASI HAPUS KUSTOM */}
                <AnimatePresence>
                    {deleteTargetId && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteTargetId(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" />
                            
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white border border-slate-100 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative z-10 text-center">
                                <div className="mx-auto w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
                                    <AlertTriangle size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Hapus Jadwal?</h3>
                                <p className="text-slate-500 text-sm mb-6">Tindakan ini tidak dapat dibatalkan. Jadwal yang terhapus akan hilang secara permanen dari sistem.</p>
                                
                                <div className="flex gap-3">
                                    <button onClick={() => setDeleteTargetId(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm transition-all">
                                        Batal
                                    </button>
                                    <button onClick={confirmDelete} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-md shadow-rose-100">
                                        Ya, Hapus
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* 🌟 2. MODAL ACTION DETAIL INFO */}
                <AnimatePresence>
                    {detailSchedule && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetailSchedule(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" />
                            
                            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} className="bg-white border border-slate-100 rounded-2xl w-full max-w-md p-6 md:p-8 shadow-2xl relative z-10">
                                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600"><Info size={18} /></div>
                                        <h2 className="text-xl font-bold text-slate-900">Detail Jadwal Lengkap</h2>
                                    </div>
                                    <button onClick={() => setDetailSchedule(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Mata Pelajaran (ID: {detailSchedule.subjectId})</span>
                                        <p className="text-slate-800 font-bold text-base">{detailSchedule.subjectName}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Hari</span>
                                            <p className="text-slate-800 font-semibold text-sm">{detailSchedule.dayOfWeek}</p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Jam Mulai</span>
                                            <p className="text-slate-800 font-semibold text-sm">{detailSchedule.startTime} WIB</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Guru Pengajar (ID: {detailSchedule.teacherId || 'N/A'})</span>
                                        <p className="text-slate-800 font-semibold text-sm">{detailSchedule.teacherName || 'Belum Ditugaskan'}</p>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Daftar ID Siswa Terdaftar ({detailSchedule.studentIds?.length || 0} Siswa)</span>
                                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                                            {detailSchedule.studentIds && detailSchedule.studentIds.length > 0 ? (
                                                detailSchedule.studentIds.map((sid) => (
                                                    <span key={sid} className="px-2 py-1 bg-white border border-slate-200 text-slate-600 font-medium rounded-md text-xs shadow-2xs">
                                                        ID: {sid}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">Belum ada siswa terdaftar</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button onClick={() => setDetailSchedule(null)} className="w-full mt-6 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-md">
                                    Tutup Detail
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Toast */}
                <AnimatePresence>
                    {toast && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border bg-white shadow-xl ${toast.type === 'error' ? 'border-rose-100 text-rose-600' : 'border-emerald-100 text-emerald-600'}`}>
                            {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
                            <span className="text-sm font-semibold">{toast.msg}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}