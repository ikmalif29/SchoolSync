import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ allowedRole }) => {
    const role = Cookies.get("role");

    console.log("ProtectedRoute role:", role);
    console.log("Allowed role:", allowedRole);

    // belum login
    if (!role) {
        return <Navigate to="/" replace />;
    }

    // role tidak sesuai
    if (role !== allowedRole) {
        return <Navigate to="/access-denied" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;