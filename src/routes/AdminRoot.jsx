import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminRoot() {
  const user = useSelector((state) => state.userProfile);

  if (user.loggedIn && user.admin) {
    return <Outlet />;
  }

  return <Navigate to="/login" />;
}

export default AdminRoot;
