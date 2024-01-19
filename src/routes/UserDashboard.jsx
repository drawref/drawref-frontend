import { useDispatch, useSelector } from "react-redux";

import { logout } from "../app/userProfileSlice";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";

function UserDashboard() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.userProfile);

  return (
    <>
      <div className="App bg-white">
        <TheHeader />
        <div id="content" className="bg-white text-center text-defaultText">
          <button onClick={() => dispatch(logout())}>Logout</button>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default UserDashboard;
