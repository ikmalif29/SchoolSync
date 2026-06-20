/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';

const StudentReport = () => {
    // State manajemen data dari dua API berbeda
    const [studentInfo, setStudentInfo] = useState(null);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Konfigurasi Endpoint Gateway sesuai isi controller backend terbaru
    const GRADE_API_URL = "http://localhost:8098/gradeSvc/api/grades";
    const STUDENT_API_URL = "http://localhost:8098/studentSvc/api/students";
    
    const STUDENT_EMAIL = localStorage.getItem("username"); 
    const TOKEN = localStorage.getItem("token"); 

    useEffect(() => {
        if (!TOKEN) {
            setError("Token autentikasi tidak ditemukan. Silakan login kembali.");
            setLoading(false);
            return;
        }
        
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const headers = {
                'Authorization': `Bearer ${TOKEN}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };

            // LANGKAH 1: Ambil data profil siswa berdasarkan Email terlebih dahulu
            const studentRes = await fetch(`${STUDENT_API_URL}/search?email=${STUDENT_EMAIL}`, { method: 'GET', headers });

            if (studentRes.status === 401 || studentRes.status === 403) {
                throw new Error("Token tidak valid atau hak akses ditolak. Silakan login ulang.");
            }
            if (!studentRes.ok) throw new Error(`Error ${studentRes.status}: Gagal mengambil data profil siswa.`);

            const studentData = await studentRes.json();

            // Simpan data profil siswa ke state
            let currentStudentId = null;
            if (studentData) {
                currentStudentId = studentData.id; // Ambil Primary Key ID untuk pencarian nilai
                setStudentInfo({
                    fullName: studentData.fullName || "Siswa",
                    nis: studentData.nis || "-",
                    className: studentData.className || "-",
                    major: studentData.major || "Teknik Industri"
                });
            }

            // LANGKAH 2: Ambil komponen nilai berdasarkan Student ID (jika ID ditemukan)
            if (currentStudentId) {
                const gradeRes = await fetch(`${GRADE_API_URL}/get-grade-by-student-id/${currentStudentId}`, { method: 'GET', headers });

                if (gradeRes.status === 401 || gradeRes.status === 403) {
                    throw new Error("Token tidak valid atau hak akses ditolak saat memuat nilai.");
                }
                if (!gradeRes.ok) throw new Error(`Error ${gradeRes.status}: Gagal mengambil data komponen nilai.`);

                const gradeResult = await gradeRes.json();

                // Ekstrak data komponen nilai (menangani jika dibungkus GenericResponse .data)
                const gradeList = gradeResult.data || gradeResult || [];
                setGrades(Array.isArray(gradeList) ? gradeList : []);
            } else {
                setGrades([]);
            }

            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fungsi unduh berkas biner Excel dari gradeSvc (Endpoint ini valid menggunakan RequestParam email)
    const downloadExcelReport = async () => {
        try {
            const response = await fetch(`${GRADE_API_URL}/download/report?email=${STUDENT_EMAIL}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`
                }
            });

            if (!response.ok) throw new Error("Gagal mengunduh berkas Excel dari server.");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Rapor_${STUDENT_EMAIL}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert("Gagal mendownload excel rapor: " + err.message);
        }
    };

    const calculateOverallAverage = () => {
        if (!grades || grades.length === 0) return "0.0";
        const total = grades.reduce((sum, item) => sum + (item.finalScore || 0), 0);
        return (total / grades.length).toFixed(1);
    };

    const getBadgeClass = (letter) => {
        if (letter === 'A') return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
        if (letter === 'B') return "bg-blue-50 text-blue-700 border-blue-200/60";
        if (letter === 'C') return "bg-amber-50 text-amber-700 border-amber-200/60";
        return "bg-slate-100 text-slate-700 border-slate-200";
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-800 antialiased">
            {/* Navbar */}
            <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md shadow-indigo-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-slate-900">E-Rapor Portal</h1>
                        <p className="text-xs text-slate-500">Arsitektur Terdistribusi API Gateway</p>
                    </div>
                </div>
                <button 
                    onClick={downloadExcelReport}
                    disabled={loading || error}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-100 transition-all duration-200 group"
                >
                    <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Unduh Rapor (Excel)
                </button>
            </nav>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                
                {/* Kartu Identitas Dinamis */}
                <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <span className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-500/30">Kartu Hasil Studi</span>
                            <h2 className="text-3xl font-bold mt-2 tracking-tight">
                                {loading ? "Memuat Nama..." : (studentInfo ? studentInfo.fullName : "Tidak Ditemukan")}
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">ID Siswa: {studentInfo ? studentInfo.nis : "-"}</p>
                        </div>
                        <div className="grid grid-cols-2 md:flex items-center gap-8 border-t md:border-t-0 border-slate-700/50 pt-4 md:pt-0 w-full md:w-auto">
                            <div className="md:text-right">
                                <p className="text-xs text-slate-400 uppercase tracking-wider">Kelas</p>
                                <p className="text-lg font-semibold text-indigo-200">{studentInfo ? studentInfo.className : "-"}</p>
                            </div>
                            <div className="md:text-right">
                                <p className="text-xs text-slate-400 uppercase tracking-wider">Jurusan</p>
                                <p className="text-lg font-semibold text-indigo-200">{studentInfo ? studentInfo.major : "-"}</p>
                            </div>
                            <div className="col-span-2 md:text-right">
                                <p className="text-xs text-slate-400 uppercase tracking-wider">Rata-Rata Nilai</p>
                                <p className="text-3xl font-black text-emerald-400">{calculateOverallAverage()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabel Komponen Nilai */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            Daftar Komponen Nilai Akademik
                        </h3>
                        <span className="text-xs font-semibold bg-slate-200/60 text-slate-600 px-3 py-1 rounded-full">
                            {grades.length} Mata Kuliah Terdaftar
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100 bg-slate-50">
                                    <th className="py-4 px-6">Mata Kuliah</th>
                                    <th className="py-4 px-4 text-center">Tugas (30%)</th>
                                    <th className="py-4 px-4 text-center">UTS (30%)</th>
                                    <th className="py-4 px-4 text-center">UAS (40%)</th>
                                    <th className="py-4 px-4 text-center">Nilai Akhir</th>
                                    <th className="py-4 px-6 text-center">Grade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                                {loading && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12 text-slate-400">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
                                            <p className="text-xs font-normal">Menghubungkan data lintas microservice...</p>
                                        </td>
                                    </tr>
                                )}

                                {error && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12 text-rose-500 bg-rose-50/30">
                                            <svg className="w-8 h-8 text-rose-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            <p className="text-sm font-bold">Koneksi API Gagal</p>
                                            <p className="text-xs font-normal mt-1 opacity-80">{error}</p>
                                        </td>
                                    </tr>
                                )}

                                {!loading && !error && grades.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12 text-slate-400">
                                            <p className="text-sm font-medium">Belum ada komponen nilai untuk mahasiswa ini.</p>
                                        </td>
                                    </tr>
                                )}

                                {!loading && !error && grades.map((grade, index) => (
                                    <tr key={grade.id || index} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-4 px-6 font-semibold text-slate-900">{grade.subjectName || "N/A"}</td>
                                        <td className="py-4 px-4 text-center text-slate-500">{grade.assignmentScore}</td>
                                        <td className="py-4 px-4 text-center text-slate-500">{grade.midExamScore}</td>
                                        <td className="py-4 px-4 text-center text-slate-500">{grade.finalExamScore}</td>
                                        <td className="py-4 px-4 text-center font-bold text-slate-900">{grade.finalScore}</td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${getBadgeClass(grade.gradeLetter)}`}>
                                                {grade.gradeLetter || "-"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentReport;