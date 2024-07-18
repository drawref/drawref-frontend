import { Link } from "react-router-dom";

import { useAppSelector } from "../app/hooks";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";

function DashboardLinks() {
  const user = useAppSelector((state) => state.userProfile);

  return (
    <>
      <div className="App bg-white">
        <TheHeader />
        <div id="content" className="bg-white text-center text-defaultText">
          <h1 className="mb-3 mt-10 text-3xl font-semibold">Dashboards</h1>
          <div className="mx-auto my-8 flex w-[23rem] max-w-full flex-col justify-center gap-6 px-4">
            {user.admin && (
              <Link to={`/admin`} className="rounded-lg bg-primary-700 p-2 text-lg font-semibold text-white shadow">
                Admin Dashboard
              </Link>
            )}
            <Link to={`/dashboard`} className="rounded-lg bg-secondary-600 p-2 text-lg font-semibold text-white shadow">
              Dashboard
            </Link>
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default DashboardLinks;
