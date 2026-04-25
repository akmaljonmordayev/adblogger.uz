import { Outlet, Navigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import { useAuthStore } from "../../store/useAuthStore";
import { ROUTE_PATHS } from "../../config/constants";

const AdminLayout = () => {
  const { token, user } = useAuthStore();

  // Guard: redirect to admin login if not authenticated
  if (!token || user?.role !== "admin") {
    return <Navigate to={ROUTE_PATHS.ADMIN_LOGIN} replace />;
  }

  return (
   <div className="flex h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
