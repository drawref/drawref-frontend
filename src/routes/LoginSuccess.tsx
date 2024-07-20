import { useSearchParams } from "react-router-dom";

import TheLoadingModal from "../components/TheLoadingModal";
import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import bg from "../assets/login-bg.jpg";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useGetUserQuery } from "../app/apiSlice";
import { login } from "../app/userProfileSlice";
import { useEffect } from "react";

function LoginSuccess() {
  const user = useAppSelector((state) => state.userProfile);

  const [searchBarParams, setSearchBarParams] = useSearchParams();
  const token = searchBarParams.get("token") || "";

  const { data: userInfo, isLoading } = useGetUserQuery({ token });

  const dispatch = useAppDispatch();

  // token is valid, remember it
  useEffect(() => {
    if (!isLoading && userInfo) {
      dispatch(
        login({
          token,
          admin: userInfo.admin,
          name: userInfo.name || "",
          exp: userInfo.exp,
        }),
      );
    }
  }, [userInfo]);

  return (
    <>
      {isLoading && <TheLoadingModal />}
      <div className="App" style={{ backgroundImage: `url(${bg})` }}>
        <TheHeader />
        <div id="content" className="flex items-center justify-center text-defaultText">
          {!isLoading && (
            <div className="mx-5 block w-[24rem] max-w-full flex-shrink-0 border-[5px] border-slate-200 bg-white px-6 pb-7 pt-8 text-center shadow-card">
              <h1 className="mb-3 mt-1 text-3xl font-semibold">{user.loggedIn ? "Logged in" : "Login failed"}</h1>
              <p>
                {user.loggedIn
                  ? "You logged in successfully!"
                  : "Login failed for an unknown reason. Please try again."}
              </p>
            </div>
          )}
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default LoginSuccess;
