import { useState } from "react";
import { Eye, EyeOff, GraduationCap, ArrowRight, Activity, Zap, Lock, User } from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:8098/authSvc/auth/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );

            const result = await response.json();
            console.log("LOGIN RESPONSE:", result);

            if (!response.ok) {
                throw new Error(result.message || result.error || "Login gagal");
            }

            const data = result.data;
            // 1. Menyimpan data ke LocalStorage dan Cookies
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("username", data.username);
            Cookies.set("role", data.role, { expires: 1 }); // Menambahkan masa aktif cookie 1 hari agar aman

            // 2. Alur Pengalihan Otomatis Menggunakan useNavigate (Bebas Reload)
            const userRole = data.role.toUpperCase();

            if (userRole === "ADMIN") {
                // replace: true membuat user tidak bisa menekan tombol 'back' kembali ke login setelah sukses masuk
                navigate("/admin/dashboard", { replace: true });
            } else if (userRole === "TEACHER") {
                // Arahkan ke rute guru/akademik yang kamu inginkan nanti
                navigate("/teacher/dashboard", { replace: true });
            } else if (userRole === "STUDENT") {
                // Arahkan ke portal siswa nanti
                navigate("/student/dashboard", { replace: true });
            } else {
                // Fallback jika role tidak dikenali
                setError("Role pengguna tidak valid.");
            }

        } catch (err) {
            console.error(err);
            setError(err.message || "Username atau password salah");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center font-sans bg-slate-900">
            {/* Background Image - Bersih, Tajam, & Tanpa Blur */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105 animate-[pulse_8s_infinite_alternate]"
                style={{
                    backgroundImage: `url('https://i.pinimg.com/736x/cc/a4/ed/cca4eddf6eb5ddadb356322404e056f7.jpg')`,
                }}
            />

            {/* Light Overlay Tipis Bergradasi */}
            <div className="absolute inset-0 bg-linear-to-tr from-sky-300/20 via-black/10 to-white/40" />

            {/* Main Container dengan Animasi Muncul Bouncing */}
            <div className="w-full max-w-5xl mx-4 relative z-10 animate-[bounce_1s_ease-out_1] [animation-duration:0.7s]">
                {/* Kotak Utama - Efek Blur Kaca Sangat Pekat (backdrop-blur-3xl) */}
                <div className="bg-white/75 backdrop-blur-3xl border border-white/80 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.15)] grid md:grid-cols-12 transform hover:scale-[1.01] transition-transform duration-500">

                    {/* Left Side - Hero Brand (Takes 5 columns) */}
                    <div className="hidden md:flex md:col-span-5 flex-col justify-between p-12 bg-white/30 border-r border-zinc-200/50 relative">
                        <div className="absolute top-0 right-0 w-0.5 h-32 bg-linear-to-b from-cyan-400 to-transparent" />

                        <div>
                            <div className="inline-flex items-center justify-center p-3.5 bg-white border border-cyan-200 rounded-2xl shadow-md mb-8 text-cyan-500 hover:rotate-12 transition-transform duration-300">
                                <GraduationCap size={40} />
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-black leading-none">
                                ACADEMIC<br />
                                <span className="text-cyan-500 font-light tracking-wide">
                                    MANAGEMENT
                                </span>
                            </h1>
                        </div>

                        <div className="space-y-4 my-auto pt-12">
                            <div className="flex gap-4 items-center p-3.5 bg-white/90 border border-white rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
                                <div className="p-2 bg-cyan-50 text-cyan-500 rounded-xl group-hover:scale-110 transition-transform">
                                    <Zap size={18} />
                                </div>
                                <div>
                                    <p className="text-black font-bold text-sm">Cepat & Modern</p>
                                    <p className="text-zinc-500 text-xs">Kelola sistem dengan satu ketukan.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center p-3.5 bg-white/90 border border-white rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
                                <div className="p-2 bg-cyan-50 text-cyan-500 rounded-xl group-hover:scale-110 transition-transform">
                                    <Activity size={18} />
                                </div>
                                <div>
                                    <p className="text-black font-bold text-sm">Real-time Insight</p>
                                    <p className="text-zinc-500 text-xs">Pantau metrik dan data secara instan.</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-xs text-zinc-500 flex items-center gap-2 font-medium">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                            Sistem Berjalan Normal
                        </div>
                    </div>

                    {/* Right Side - Login Form dengan Peningkatan Input UI */}
                    <div className="col-span-12 md:col-span-7 p-8 md:p-16 flex items-center bg-white/40">
                        <div className="w-full max-w-md mx-auto">

                            {/* Mobile Header */}
                            <div className="md:hidden flex items-center gap-3 mb-8">
                                <GraduationCap size={32} className="text-cyan-500" />
                                <h1 className="text-2xl font-black tracking-tight text-black">ACADEMIC</h1>
                            </div>

                            <div className="mb-10">
                                <h2 className="text-3xl font-extrabold text-black tracking-tight animate-[fadeIn_0.5s_ease-out]">
                                    Selamat Datang Kembali
                                </h2>
                                <p className="text-zinc-600 mt-2 text-sm font-medium">
                                    Masukkan kredensial Anda untuk mengakses dasbor akademik.
                                </p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-5">
                                {/* Input Username */}
                                <div className="group/input relative">
                                    <label className="block text-zinc-700 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within/input:text-cyan-600 transition-colors">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within/input:text-cyan-500 transition-colors">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="username"
                                            value={form.username}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-zinc-200 focus:border-cyan-500 rounded-xl text-black placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-cyan-100 transition-all text-sm font-medium shadow-sm"
                                            placeholder="Masukkan username Anda"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Input Password */}
                                <div className="group/input relative">
                                    <label className="block text-zinc-700 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within/input:text-cyan-600 transition-colors">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within/input:text-cyan-500 transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-12 py-3.5 bg-white border border-zinc-200 focus:border-cyan-500 rounded-xl text-black placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-cyan-100 transition-all text-sm tracking-wide font-medium shadow-sm"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-cyan-500 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs flex items-center gap-2.5 font-semibold animate-[shake_0.5s_ease-in-out]">
                                        <span>⚠️</span> {error}
                                    </div>
                                )}

                                {/* Submit Button dengan Efek Hover & Loading Baru */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full group relative overflow-hidden bg-black hover:bg-zinc-900 text-white py-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-black/10 hover:shadow-xl hover:shadow-cyan-500/20 active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                                            <span className="tracking-wide">MEMPROSES DATA...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="tracking-wider">MASUK SISTEM</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <p className="text-center text-zinc-500 mt-8 text-xs font-semibold">
                                Mengalami kendala? <span className="text-cyan-600 hover:underline cursor-pointer font-bold transition-all">Hubungi Administrator</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-zinc-500 text-xs tracking-wide font-bold bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/40 shadow-sm">
                © 2026 Academic Management System • <span className="text-cyan-600">Knowledge is Power</span>
            </div>
        </div>
    );
};

export default Login;