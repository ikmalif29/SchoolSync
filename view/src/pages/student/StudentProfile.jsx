import { useState, useEffect } from "react";
import {
    User, Mail, Phone, MapPin, Calendar, ShieldCheck,
    Briefcase, GraduationCap, Users, Camera
} from "lucide-react";

const StudentProfile = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE_URL = "http://localhost:8098/studentSvc/api/students";

    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                // 1. Ambil email dan token dari localStorage
                const savedEmail = localStorage.getItem("username");
                const token = localStorage.getItem("token");
    
                // 2. Validasi awal: Jika token tidak ada, langsung lempar error ke block catch
                if (!token) {
                    throw new Error("Sesi Anda telah habis. Silakan login kembali.");
                }
    
                // 3. Eksekusi fetch dengan menyertakan Headers Authorization
                const response = await fetch(`${BASE_URL}/search?email=${savedEmail}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        // Menyisipkan token ke header menggunakan format Bearer
                        "Authorization": `Bearer ${token}`
                    }
                });
    
                // 4. Jika backend mengembalikan status 401 (Unauthorized) atau 403 (Forbidden)
                if (response.status === 401 || response.status === 403) {
                    throw new Error("Token tidak valid atau hak akses ditolak. Silakan login ulang.");
                }
    
                if (!response.ok) {
                    throw new Error("Gagal mengambil data profil siswa dari server");
                }
    
                const data = await response.json();
                setProfileData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchStudentProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Memuat Profil Premium...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-4">
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-2xl max-w-md text-center space-y-2">
                    <p className="text-sm font-black uppercase tracking-wider">Terjadi Kendala Sistem</p>
                    <p className="text-xs font-medium text-rose-600/90">{error}</p>
                </div>
            </div>
        );
    }

    // Generate huruf inisial jika foto Base64 bernilai null
    const getInitials = (name) => {
        return name ? name.substring(0, 2).toUpperCase() : "ST";
    };

    return (
        <div className="min-h-screen bg-slate-50/40 p-4 md:p-8 space-y-8 animate-fade-in">

            {/* ================= 1. THE HERO ACCENT PROFILE CARD ================= */}
            <div className="relative bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-10 text-white overflow-hidden shadow-xl group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl -mr-10 -mt-10"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">

                    {/* Avatar Handler (Berfungsi dinamis jika foto rapot null) */}
                    <div className="relative group/avatar">
                        <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-linear-to-tr from-indigo-500 via-indigo-600 to-violet-600 border-4 border-slate-900 shadow-2xl flex items-center justify-center font-black text-3xl tracking-widest text-white overflow-hidden">
                            {profileData.photoBase64 ? (
                                <img
                                    src={`data:image/jpeg;base64,${profileData.photoBase64}`}
                                    alt={profileData.fullName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span>{getInitials(profileData.fullName)}</span>
                            )}
                        </div>
                        <button className="absolute bottom-1 right-1 p-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl shadow-lg hover:scale-105 transition-transform cursor-pointer">
                            <Camera size={14} />
                        </button>
                    </div>

                    {/* Ringkasan Identitas Utama */}
                    <div className="space-y-2.5 flex-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-400">
                            <ShieldCheck size={12} /> Akun Terverifikasi ({profileData.status})
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            {profileData.fullName}
                        </h1>
                        <p className="text-xs md:text-sm text-slate-400 font-medium max-w-xl">
                            Terdaftar sebagai siswa didik sah di <span className="text-indigo-400 font-bold">Universitas Nasional Pasim</span>. Jagalah kerahasiaan data pribadi akun akademik Anda.
                        </p>
                    </div>
                </div>
            </div>

            {/* ================= 2. DATA GRID DETAILS SECTION ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* KOLOM KIRI: DATA AKADEMIK SEKOLAH */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-6">
                    <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
                        <GraduationCap className="text-indigo-600" size={18} />
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Atribut Akademik</h3>
                    </div>

                    <div className="space-y-4.5">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Nomor Induk Siswa (NIS)</span>
                            <p className="text-sm font-mono font-black text-slate-800 bg-slate-50 border border-slate-200/60 px-3 py-2 rounded-xl">
                                {profileData.nis}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Kelas Saat Ini</span>
                            <p className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                                {profileData.className}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Kompetensi Keahlian (Jurusan)</span>
                            <p className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                                <Briefcase size={14} className="text-slate-400" />
                                {profileData.major}
                            </p>
                        </div>
                    </div>
                </div>

                {/* KOLOM TENGAH: PROFIL BIODATA LENGKAP */}
                <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-6">
                    <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <User className="text-indigo-600" size={18} />
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Biodata Pribadi Siswa</h3>
                        </div>
                        <span className="text-[10px] font-black bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md uppercase tracking-wider">
                            ID Siswa: #{profileData.id}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-500">
                                <Mail size={15} />
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Email Utama</span>
                                <p className="text-xs font-bold text-slate-800">{profileData.email}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-500">
                                <Phone size={15} />
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Nomor Handphone</span>
                                <p className="text-xs font-bold text-slate-800">{profileData.phoneNumber || "-"}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-500">
                                <Calendar size={15} />
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Tanggal Lahir</span>
                                <p className="text-xs font-bold text-slate-800">{profileData.birthDate}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-500">
                                <User size={15} />
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Jenis Kelamin</span>
                                <p className="text-xs font-bold text-slate-800">{profileData.gender}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 sm:col-span-2">
                            <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-500">
                                <MapPin size={15} />
                            </div>
                            <div className="space-y-0.5 flex-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Alamat Domisili Rumah</span>
                                <p className="text-xs font-semibold text-slate-600 leading-relaxed">{profileData.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* SUB-SECTION: DATA WALI / ORANG TUA */}
                    <div className="pt-5 border-t border-slate-100 space-y-4">
                        <div className="flex items-center gap-2">
                            <Users className="text-slate-400" size={15} />
                            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Informasi Orang Tua / Wali</h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 border border-slate-200/60 p-4 rounded-2xl">
                            <div className="space-y-0.5">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Nama Ayah / Ibu / Wali</span>
                                <p className="text-xs font-black text-slate-800">{profileData.parentName || "-"}</p>
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Kontak Darurat Wali</span>
                                <p className="text-xs font-bold text-indigo-600 font-mono">{profileData.parentPhone || "-"}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StudentProfile;