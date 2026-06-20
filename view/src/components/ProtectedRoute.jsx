import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ allowedRoles }) => {
    const role = Cookies.get("role");

    console.log("ProtectedRoute role:", role);
    console.log("Allowed roles:", allowedRoles);

    // 1. Jika cookie role tidak ditemukan (belum login)
    if (!role) {
        return <Navigate to="/" replace />;
    }

    // 2. Cek apakah role user saat ini terdaftar di dalam array allowedRoles
    // .map(r => r.toUpperCase()) memastikan semua string berbentuk huruf kapital agar aman
    const hasAccess = allowedRoles.map(r => r.toUpperCase()).includes(role.toUpperCase());

    if (!hasAccess) {
        return <Navigate to="/access-denied" replace />;
    }

    // 3. Jika aman, lolos ke halaman yang dituju
    return <Outlet />;
};

export default ProtectedRoute;