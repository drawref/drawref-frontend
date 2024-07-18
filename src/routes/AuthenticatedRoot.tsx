import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

function AuthenticatedRoot() {
  const user = useAppSelector((state) => state.userProfile);

  if (user.loggedIn) {
    return <Outlet />;
  }

  return <Navigate to="/login" />;
}

export default AuthenticatedRoot;
