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
import AdminPayments from "./pages/admin/PaymentManagement.jsx";
import ScheduleManagement from "./pages/admin/ScheduleManagement.jsx";
import TeacherDashboard from "./pages/teacher/TeacherDashboard.jsx";
import TeacherProfile from "./pages/teacher/TeacherProfile.jsx";
import DashboardLayout from "./components/teacher/TeacherLayout.jsx";
import TeacherSchedule from "./pages/teacher/TeacherSchedule.jsx";
import StudentLandingPage from "./pages/student/StudentLandingPage.jsx";
import StudentLayout from "./components/student/StudentLayout.jsx";
import StudentProfile from "./pages/student/StudentProfile.jsx";
import StudentSchedule from "./pages/student/StudentSchedule.jsx";
import StudentReport from "./pages/student/StudentReport.jsx";
import TeacherGradeManagement from "./pages/teacher/TeacherGradeManagement.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      /* AUTH */
      {
        index: true, // Menggunakan index: true sebagai halaman utama/akar "/"
        element: <Login />,
      },

      /* =========================================================
         1. AREA KHUSUS ADMIN
         ========================================================= */
      {
        path: "admin", // Menggunakan jalur relatif (tanpa '/')
        element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
        children: [
          {
            path: "dashboard", // Menjadi: /admin/dashboard
            element: <DashboardAdmin />,
          },
          {
            path: "students", // Menjadi: /admin/students
            element: <StudentManagement />,
          },
          {
            path: "teachers", // Menjadi: /admin/teachers
            element: <TeacherManagement />,
          },
          {
            path: "subjects", // Menjadi: /admin/subjects
            element: <SubjectManagement />
          },
          {
            path: "grades", // Menjadi: /admin/grades
            element: <GradeManagement />,
          },
          {
            path: "payments", // Menjadi: /admin/payments
            element: <AdminPayments />,
          },
          {
            path: "schedules", // Menjadi: /admin/schedules
            element: <ScheduleManagement />,
          },
        ],
      },

      /* =========================================================
         2. CONTOH AREA GURU (TEACHER) & MAHASISWA/SISWA (STUDENT)
         Nantinya jika kamu membuat halaman khusus Teacher atau Student,
         kamu tinggal menambahkan grup baru di bawah ini:
         ========================================================= */
      {
        path: "teacher",
        element: <ProtectedRoute allowedRoles={["TEACHER"]} />,
        children: [
          {
            // Semua halaman di dalam sini otomatis dibungkus Header & Footer
            element: <DashboardLayout />,
            children: [
              {
                path: "dashboard", // Menjadi: /teacher/dashboard
                element: <TeacherDashboard />
              },
              {
                path: "profile", // Menjadi: /teacher/profile
                element: <TeacherProfile />
              },
              {
                path: "schedules", // Menjadi: /teacher/schedules
                element: <TeacherSchedule />
              },
              {
                path: "grades", // Menjadi: /teacher/grades
                element: <TeacherGradeManagement />
              }
            ]
          }
        ]
      },


      {
        path: "student",
        element: <ProtectedRoute allowedRoles={["STUDENT"]} />,
        children: [
          {
            element: <StudentLayout />,
            children: [
              { 
                path: "dashboard", 
                element: <StudentLandingPage />
              },
              {
                path: "profile",
                element: <StudentProfile />
              },
              {
                path: "schedules",
                element: <StudentSchedule />
              },
              {
                path: "raport",
                element: <StudentReport />
              }
            ]
          }
        ]
      }

    ],
  },
  /* Rute Global untuk Halaman Ditolak */
  {
    path: "/access-denied",
    element: <div className="p-8 text-center font-bold text-rose-600">403 - Access Denied</div>
  }
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);