import { useState } from "react";
import { Eye, EyeOff, GraduationCap, ArrowRight, Activity, Zap } from "lucide-react";
import Cookies from "js-cookie";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("username", data.username);
            Cookies.set("role", data.role);

            if (data.role === "ADMIN") {
                window.location.href = "/admin/dashboard";
            }
            // Tambahkan redirect lain jika ada role lain

        } catch (err) {
            console.error(err);
            setError(err.message || "Username atau password salah");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center font-sans">
            {/* Tech Grid Background & Neon Glows */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Main Container */}
            <div className="w-full max-w-5xl mx-4 relative z-10">
                <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] grid md:grid-cols-12">
                    
                    {/* Left Side - Hero Brand (Takes 5 columns) */}
                    <div className="hidden md:flex md:col-span-5 flex-col justify-between p-12 bg-zinc-900/50 border-r border-zinc-800 relative">
                        {/* Abstract Tech Line Accent */}
                        <div className="absolute top-0 right-0 w-[2px] h-32 bg-gradient-to-b from-cyan-400 to-transparent" />
                        
                        <div>
                            <div className="inline-flex items-center justify-center p-3.5 bg-black border border-cyan-500/30 rounded-2xl shadow-[0_0_15px_rgba(6,182,212,0.2)] mb-8">
                                <GraduationCap size={40} className="text-cyan-400" />
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-white leading-none">
                                ACADEMIC<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200 font-light">
                                    MANAGEMENT
                                </span>
                            </h1>
                        </div>

                        <div className="space-y-6 my-auto pt-12">
                            <div className="flex gap-4 items-center p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl">
                                <Zap size={20} className="text-cyan-400 flex-shrink-0" />
                                <div>
                                    <p className="text-white font-medium text-sm">Cepat & Modern</p>
                                    <p className="text-zinc-400 text-xs">Kelola sistem dengan satu ketukan.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl">
                                <Activity size={20} className="text-cyan-400 flex-shrink-0" />
                                <div>
                                    <p className="text-white font-medium text-sm">Real-time Insight</p>
                                    <p className="text-zinc-400 text-xs">Pantau metrik dan data secara instan.</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-xs text-zinc-500 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                            Sistem Berjalan Normal
                        </div>
                    </div>

                    {/* Right Side - Login Form (Takes 7 columns) */}
                    <div className="col-span-12 md:col-span-7 p-8 md:p-16 flex items-center bg-black/60">
                        <div className="w-full max-w-md mx-auto">
                            
                            {/* Mobile Header Only */}
                            <div className="md:hidden flex items-center gap-3 mb-8">
                                <GraduationCap size={32} className="text-cyan-400" />
                                <h1 className="text-2xl font-black tracking-tight text-white">ACADEMIC</h1>
                            </div>

                            <div className="mb-10">
                                <h2 className="text-3xl font-bold text-white tracking-tight">
                                    Selamat Datang Kembali
                                </h2>
                                <p className="text-zinc-400 mt-2 text-sm">
                                    Masukkan kredensial Anda untuk mengakses dasbor akademik.
                                </p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={form.username}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
                                        placeholder="Masukkan username Anda"
                                        required
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider">
                                            Password
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3.5 bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all text-sm tracking-wide"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-cyan-400 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-xs flex items-center gap-2.5">
                                        <span>⚠️</span> {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full group relative overflow-hidden bg-white hover:bg-zinc-100 text-black py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_25px_rgba(6,182,212,0.3)]"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black/30 border-t-black animate-spin rounded-full" />
                                            <span>Autentikasi...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>MASUK SISTEM</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <p className="text-center text-zinc-500 mt-8 text-xs">
                                Mengalami kendala? <span className="text-cyan-400 hover:underline cursor-pointer font-medium">Hubungi Administrator</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-zinc-600 text-xs tracking-wide">
                © 2026 Academic Management System • <span className="text-zinc-500">Knowledge is Power</span>
            </div>
        </div>
    );
};

export default Login;