import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import DashboardAdmin from "./pages/admin/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import StudentManagement from "./pages/admin/StudentsManagemenet.jsx";
import TeacherManagement from "./pages/admin/TeacherManagement.jsx";
import SubjectManagement from "./pages/admin/SubjectManagement.jsx";
import GradeManagement from "./pages/admin/GradeManagement.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      /* AUTH */
      {
        path: "/",
        element: <Login />,
      },

      /* ADMIN */
      {
        path: "/admin",
        element: <ProtectedRoute allowedRole="ADMIN" />,
        children: [
          {
            path: "/admin/dashboard",
            element: <DashboardAdmin />,
          },
          {
            path: "/admin/students",
            element: <StudentManagement />,
          },
          {
            path: "/admin/teachers",
            element: <TeacherManagement />,
          },
          {
            path: "/admin/subjects",
            element: <SubjectManagement />
          },
          {
            path: "/admin/grades",
            element: <GradeManagement />,
          },
          {
            path: "/admin/payments",
            element: <h1>Payments</h1>,
          },
          {
            path: "/admin/users",
            element: <h1>Users</h1>,
          },
          {
          }
        ],
      }

    ],
    
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);