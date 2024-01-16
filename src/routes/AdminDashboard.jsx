import { useSelector } from "react-redux";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";

function AdminDashboard() {
  const user = useSelector((state) => state.userProfile);

  return (
    <>
      <div className="App bg-white">
        <TheHeader />
        <div id="content" className="bg-white text-center text-defaultText">
          {user.admin && <span>Test</span>}
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default AdminDashboard;
