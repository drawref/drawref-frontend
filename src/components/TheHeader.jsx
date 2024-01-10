import logo from "../assets/logo-light.svg";
import Icon from "@mdi/react";
import { mdiLoginVariant } from "@mdi/js";
import { Link } from "react-router-dom";

function TheHeader() {
  return (
    <>
      <header className="sticky top-0 flex items-center justify-between bg-primary-600 px-2 py-1">
        <Link to="/login" className="invisible px-2 py-2 text-white sm:hidden">
          <Icon path={mdiLoginVariant} title="Login" size={1.1} className="text-white" />
        </Link>
        <Link to="/" className="block px-3 py-1.5">
          <img src={logo} alt="DrawRef logo" />
        </Link>
        <div className="flex">
          <Link to="/login" className="mx-5 my-2 hidden text-lg font-semibold text-white sm:block">
            Login
          </Link>
          <Link to="/login" className="px-2 py-2 text-white sm:hidden">
            <Icon path={mdiLoginVariant} title="Login" size={1.1} className="text-white" />
          </Link>
        </div>
      </header>
    </>
  );
}

export default TheHeader;
