import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import bg from "../assets/login-bg.jpg";
import { useLoginUserMutation } from "../app/apiSlice";
import { useAppDispatch } from "../app/hooks";
import { login as loginAction } from "../app/userProfileSlice";

function Login() {
  const [password, setPassword] = useState("");
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser({ password }).unwrap();
      dispatch(
        loginAction({
          token: response.token,
          admin: response.level === "admin",
          name: response.level,
          exp: response.exp,
        }),
      );
      navigate("/admin");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <>
      <div className="App min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}>
        <TheHeader />
        <div id="content" className="flex items-center justify-center text-defaultText">
          <form
            onSubmit={handleLogin}
            className="mx-5 mt-10 block w-[24rem] max-w-full flex-shrink-0 border-[5px] border-slate-200 bg-white px-6 pb-6 pt-8 shadow-card"
          >
            <h1 className="mb-7 mt-1 text-center text-3xl font-semibold">Login</h1>

            {error && <div className="mb-4 text-center text-red-500">Login failed</div>}

            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold">Password</label>
              <input
                type="password"
                className="w-full rounded border px-3 py-2 text-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-sm bg-slate-800 py-2.5 text-center text-lg font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default Login;
