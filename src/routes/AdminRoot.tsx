import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

function AdminRoot() {
  const user = useAppSelector((state) => state.userProfile);

  if (user.loggedIn && user.admin) {
    return <Outlet />;
  }

  return <Navigate to="/login" />;
}

export default AdminRoot;
