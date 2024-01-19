import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AuthenticatedRoot() {
  const user = useSelector((state) => state.userProfile);

  if (user.loggedIn) {
    return <Outlet />;
  }

  return <Navigate to="/login" />;
}

export default AuthenticatedRoot;
