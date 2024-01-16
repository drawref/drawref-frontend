import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";

function Landing() {
  const user = useSelector((state) => state.userProfile);

  return (
    <>
      <div className="App bg-white">
        <TheHeader />
        <div id="content" className="bg-white text-center text-defaultText">
          <h1 className="mb-3 mt-10 text-3xl font-semibold">Dashboard</h1>
          <div className="mx-auto my-8 flex w-[60rem] max-w-full flex-col justify-center gap-6 px-4">
            {user.admin && (
              <>
                <span>Admin links here</span>
                <Link to={`/`} className="text-linkText">
                  Link here
                </Link>
              </>
            )}
            {user.loggedIn && (
              <>
                <span>Normal user links here</span>
              </>
            )}
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default Landing;
