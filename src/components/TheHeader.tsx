import Icon from "@mdi/react";
import { mdiLoginVariant, mdiAccountCircle } from "@mdi/js";
import { Link } from "react-router-dom";

import { useAppSelector } from "../app/hooks";
import logo from "../assets/logo-light.svg";

interface Props {
  admin: boolean;
}

function TheHeader({ admin }: Props) {
  const user = useAppSelector((state) => state.userProfile);

  return (
    <>
      <header className="sticky top-0 flex items-center justify-between bg-primary-600 px-2 py-1 dark:bg-primary-800">
        <Link to="/login" className="invisible px-2 py-2 text-white sm:hidden">
          <Icon path={mdiLoginVariant} title="Login" size={1.1} className="text-white" />
        </Link>
        <Link to="/" className="flex items-center gap-3 px-3 py-1.5">
          <img src={logo} alt="DrawRef logo" />
          {admin && <span className="-mb-2 hidden text-lg font-medium text-white sm:block">Admin Dashboard</span>}
        </Link>
        <div className="flex">
          {user.loggedIn && (
            <Link to={user.admin ? "/dashboards" : "/dashboard"} className="px-2 py-2 text-white">
              <Icon path={mdiAccountCircle} title="Dashboard" size={1.2} className="text-white" />
            </Link>
          )}
          {!user.loggedIn && (
            <>
              <Link to="/login" className="mx-5 my-2 hidden text-lg font-semibold text-white sm:block">
                Login
              </Link>
              <Link to="/login" className="px-2 py-2 text-white sm:hidden">
                <Icon path={mdiLoginVariant} title="Login" size={1.1} className="text-white" />
              </Link>
            </>
          )}
        </div>
      </header>
    </>
  );
}

export default TheHeader;
