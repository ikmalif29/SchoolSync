/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from "react";
import {
    Plus, Search, CreditCard, X, CheckCircle, AlertCircle,
    Ban, Calendar, Menu, RefreshCw, User,
    DollarSign, FileText, Info, Eye
} from "lucide-react";
import AdminSidebar from "../../components/SidebarAdmin";

const API_BASE_URL = "http://localhost:8098/paymentSvc/api/payment";
const request = async (url, method, body = null) => {
    const res = await fetch(`${API_BASE_URL}${url}`, {
        method,
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: body ? JSON.stringify(body) : null
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

const AdminPayments = () => {
    // STATE UNTUK KONTROL BUKA/TUTUP SIDEBAR
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedPayment, setSelectedPayment] = useState(null);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const [formData, setFormData] = useState({
        studentId: "", studentEmail: "", amount: "", description: "",
        paymentType: "SPP_BULANAN", dueDate: "", targetClassLevel: "10",
        academicYear: "2025/2026", periodMonth: "1"
    });

    useEffect(() => {
        fetchPayments();
    }, []);

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
    };

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const res = await request("/get-all-payments", "GET");
            setPayments(res.data || []);
            setError("");
        } catch (err) {
            setError(err.message || "Gagal mengambil data.");
            showToast("Gagal menyinkronkan data pembayaran", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action, id, confirmMsg) => {
        if (!window.confirm(confirmMsg)) return;
        try {
            await request(`/${action}-payment?id=${id}`, "POST");
            showToast(`Aksi ${action === "pay" ? "Pelunasan" : "Pembatalan"} berhasil diproses!`, "success");
            fetchPayments();
        } catch (err) {
            showToast(err.message || "Gagal memproses aksi.", "error");
        }
    };

    const handleCreatePayment = async (e) => {
        e.preventDefault();
        try {
            await request("/create-payment", "POST", {
                ...formData,
                studentId: formData.studentId ? parseInt(formData.studentId, 10) : null,
                amount: parseFloat(formData.amount),
                targetClassLevel: parseInt(formData.targetClassLevel, 10),
                periodMonth: formData.paymentType === "SPP_BULANAN" ? parseInt(formData.periodMonth, 10) : null
            });
            setIsModalOpen(false);
            showToast("Tagihan baru berhasil diterbitkan!", "success");
            setFormData({
                studentId: "", studentEmail: "", amount: "", description: "",
                paymentType: "SPP_BULANAN", dueDate: "", targetClassLevel: "10",
                academicYear: "2025/2026", periodMonth: "1"
            });
            fetchPayments();
        } catch (err) {
            showToast(err.message || "Terjadi kesalahan sistem", "error");
        }
    };

    const statusBadges = {
        PAID: <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-600 flex items-center gap-1.5 border border-emerald-100 shadow-sm"><CheckCircle size={13} /> Lunas</span>,
        CANCELLED: <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 flex items-center gap-1.5 border border-rose-100 shadow-sm"><Ban size={13} /> Dibatalkan</span>,
        PENDING: <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-600 flex items-center gap-1.5 border border-amber-100 shadow-sm animate-pulse"><AlertCircle size={13} /> Menunggu</span>
    };

    const filteredPayments = payments.filter(p =>
        p.studentId?.toString().includes(search) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
    );

    const getMonthName = (monthNum) => {
        const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        return months[parseInt(monthNum, 10) - 1] || "-";
    };

    return (
        // Pembungkus Utama Menggunakan Flexbox agar Sidebar dan Konten Sejajar Samping
        <div className="flex min-h-screen bg-slate-50/50 w-full font-sans">

            <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* KONTEN UTAMA HALAMAN PAYMENT */}
            <div className="flex-1 p-4 md:p-8 w-full overflow-hidden relative">

                {/* TOAST NOTIFICATION COMPONENT */}
                {toast.show && (
                    <div className={`fixed top-6 right-6 z-100 flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-xl transition-all max-w-md ${toast.type === "success"
                            ? "bg-white border-emerald-100 text-slate-800 shadow-emerald-100/40"
                            : "bg-white border-rose-100 text-slate-800 shadow-rose-100/40"
                        }`}>
                        <div className={`p-2 rounded-xl ${toast.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                            {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sistem Notifikasi</p>
                            <p className="text-sm font-semibold text-slate-700 mt-0.5">{toast.message}</p>
                        </div>
                        <button onClick={() => setToast({ ...toast, show: false })} className="ml-4 p-1 rounded-lg text-slate-400 hover:bg-slate-50">
                            <X size={14} />
                        </button>
                    </div>
                )}

                {/* Main Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs transition-all hover:shadow-md">
                    <div className="flex items-center gap-3.5">
                        {/* Tombol Menu untuk memicu buka/tutup sidebar di Mobile */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 lg:hidden transition-all active:scale-95 border border-slate-100 cursor-pointer"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-linear-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-100">
                                <CreditCard className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Manajemen Pembayaran</h1>
                                <p className="text-xs md:text-sm text-slate-400 mt-0.5 font-medium">Kelola pembuatan tagihan SPP dan administrasi akademik siswa secara berkala.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        <button onClick={fetchPayments} className="p-3 rounded-xl border border-slate-100 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 bg-white transition-all active:scale-95 shadow-xs" title="Sinkronkan Ulang">
                            <RefreshCw size={17} className={loading ? "animate-spin text-indigo-600" : ""} />
                        </button>
                        <button onClick={() => setIsModalOpen(true)} className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-violet-600 text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/10 hover:opacity-95 transition-all">
                            <Plus size={18} /> <span>Buat Tagihan</span>
                        </button>
                    </div>
                </div>

                {/* Search Control */}
                <div className="bg-white p-2 rounded-2xl border border-slate-100 flex items-center gap-3 mb-6 shadow-xs focus-within:border-indigo-500/50 transition-all">
                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400"><Search size={18} /></div>
                    <input type="text" placeholder="Cari berdasarkan ID Siswa atau Deskripsi Tagihan..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full text-sm text-slate-700 bg-transparent focus:outline-none font-medium placeholder:text-slate-400" />
                </div>

                {error && <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm mb-6 flex items-center gap-3"><AlertCircle size={20} className="shrink-0" /> <span className="font-medium">{error}</span></div>}

                {/* Table Container */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-slate-600">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-semibold text-[11px] tracking-wider uppercase">
                                    <th className="p-4 pl-6">Siswa</th>
                                    <th className="p-4">Info Akademik</th>
                                    <th className="p-4">Tipe Alokasi</th>
                                    <th className="p-4">Nominal</th>
                                    <th className="p-4">Timeline</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-center pr-6">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="p-12 text-center">
                                            <RefreshCw size={24} className="animate-spin text-indigo-600 mx-auto mb-2" />
                                            <span className="text-xs font-semibold text-slate-400 animate-pulse uppercase tracking-wider">Menyelaraskan data finansial...</span>
                                        </td>
                                    </tr>
                                ) : filteredPayments.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="p-12 text-center text-slate-400">
                                            <FileText size={32} className="mx-auto mb-2 text-slate-200" />
                                            <p className="text-sm font-medium">Tidak ada catatan transaksi log aktif.</p>
                                        </td>
                                    </tr>
                                ) : filteredPayments.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/40 transition-colors group">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-indigo-50/80 border border-indigo-100/50 text-indigo-600 font-bold text-xs flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-xs">
                                                    ID
                                                </div>
                                                <div className="font-bold text-slate-700">Siswa #{p.studentId}</div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-[11px] font-semibold space-y-0.5 bg-slate-50/80 px-2.5 py-1.5 rounded-xl border border-slate-100/60 inline-block">
                                                <p className="text-slate-600"><span className="text-slate-400 font-normal">Kelas:</span> {p.targetClassLevel} • <span className="text-slate-400 font-normal">TA:</span> {p.academicYear}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg font-bold border border-indigo-100/80 tracking-wide">{p.paymentType}</span>
                                            <p className="text-xs text-slate-400 mt-1 max-w-40 truncate font-normal">{p.description || "-"}</p>
                                        </td>
                                        <td className="p-4 font-extrabold text-slate-800 text-base">Rp {p.amount?.toLocaleString("id-ID")}</td>
                                        <td className="p-4 text-xs space-y-1 font-semibold">
                                            <div className="flex items-center gap-1.5 text-amber-600/90"><Calendar size={13} /> Tempo: {p.dueDate}</div>
                                            {p.paymentDate && <div className="flex items-center gap-1.5 text-emerald-600"><CheckCircle size={13} /> Lunas: {p.paymentDate}</div>}
                                        </td>
                                        <td className="p-4">{statusBadges[p.paymentStatus] || statusBadges.PENDING}</td>
                                        <td className="p-4 pr-6 text-center">
                                            <div className="flex justify-center items-center gap-1.5">
                                                <button
                                                    onClick={() => setSelectedPayment(p)}
                                                    className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-xs"
                                                    title="Lihat Detail Subjek"
                                                >
                                                    <Eye size={14} />
                                                </button>

                                                {p.paymentStatus === "PENDING" ? (
                                                    <>
                                                        <button onClick={() => handleAction("pay", p.id, "Konfirmasi pelunasan tagihan ini?")} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95">Bayar</button>
                                                        <button onClick={() => handleAction("cancel", p.id, "Apakah Anda yakin membatalkan tagihan ini?")} className="px-3 py-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-500 rounded-xl text-xs font-bold border border-slate-100/80 transition-all active:scale-95">Batal</button>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100 font-semibold italic">Selesai</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* POPUP DETAIL Transaksi */}
                {selectedPayment && (
                    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl max-w-md w-full border border-slate-100 shadow-2xl p-6 relative">
                            <button onClick={() => setSelectedPayment(null)} className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={16} />
                            </button>
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
                                    <Info size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">Rincian Informasi Subjek</h3>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">ID Log Referensi: #{selectedPayment.id}</p>
                                </div>
                            </div>
                            <div className="mt-5 space-y-4 text-sm font-medium text-slate-600">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100/60">
                                    <span className="text-xs text-slate-400">Target Identitas</span>
                                    <span className="text-slate-800 font-bold">Siswa ID {selectedPayment.studentId}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/60">
                                        <p className="text-[11px] text-slate-400">Tipe Tagihan</p>
                                        <p className="text-xs text-indigo-600 font-bold mt-1 uppercase tracking-wide">{selectedPayment.paymentType}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/60">
                                        <p className="text-[11px] text-slate-400">Alokasi Bulan</p>
                                        <p className="text-xs text-slate-700 font-bold mt-1">
                                            {selectedPayment.paymentType === "SPP_BULANAN" && selectedPayment.periodMonth ? getMonthName(selectedPayment.periodMonth) : "Bukan SPP"}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/60 space-y-2">
                                    <div className="flex justify-between text-xs"><span className="text-slate-400">Tingkat Kelas:</span> <span className="text-slate-700 font-semibold">Kelas {selectedPayment.targetClassLevel}</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-slate-400">Tahun Academic:</span> <span className="text-slate-700 font-semibold">{selectedPayment.academicYear}</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-slate-400">Tanggal Jatuh Tempo:</span> <span className="text-amber-600 font-bold">{selectedPayment.dueDate}</span></div>
                                </div>
                                <div className="p-3 bg-indigo-50/40 rounded-2xl border border-indigo-100/50 flex items-center justify-between">
                                    <span className="text-xs text-indigo-600 font-bold uppercase">Total Tagihan</span>
                                    <span className="text-lg font-extrabold text-indigo-700">Rp {selectedPayment.amount?.toLocaleString("id-ID")}</span>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Deskripsi Tambahan</label>
                                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/60 text-xs text-slate-500 font-normal leading-relaxed">
                                        {selectedPayment.description || "Tidak tersedia keterangan pelengkap pada data transaksi subjek ini."}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedPayment(null)} className="mt-6 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-all">Tutup Detail</button>
                        </div>
                    </div>
                )}

                {/* FORM MODAL: BUAT TAGIKAN BARU */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 relative border border-slate-100">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={16} />
                            </button>
                            <h3 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-3 border-b border-slate-100 pb-3">
                                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shadow-inner"><CreditCard size={18} /></div>
                                <span>Konfigurasi Penerbitan Tagihan</span>
                            </h3>
                            <form onSubmit={handleCreatePayment} className="space-y-5 text-sm font-medium" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1 mb-1.5 tracking-wider"><User size={12} /> ID Siswa *</label>
                                        <input type="number" required name="studentId" value={formData.studentId} className="w-full border border-slate-100 bg-slate-50/50 rounded-xl p-2.5 font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all" placeholder="Contoh: 12" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block tracking-wider">Email Notifikasi</label>
                                        <input type="email" name="studentEmail" value={formData.studentEmail} className="w-full border border-slate-100 bg-slate-50/50 rounded-xl p-2.5 font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all" placeholder="siswa@domain.com" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1 mb-1.5 tracking-wider"><DollarSign size={12} /> Nominal *</label>
                                        <input type="number" required name="amount" value={formData.amount} className="w-full border border-slate-100 bg-slate-50/50 rounded-xl p-2.5 font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all" placeholder="Contoh: 500000" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block tracking-wider">Jatuh Tempo *</label>
                                        <input type="date" required name="dueDate" value={formData.dueDate} className="w-full border border-slate-100 bg-slate-50/50 rounded-xl p-2.5 font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-3 border-b border-slate-100 pb-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold transition-all hover:bg-slate-200">Batal</button>
                                    <button type="submit" className="px-5 py-2.5 bg-linear-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold transition-all shadow-md">Simpan Tagihan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPayments;