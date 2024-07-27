import urlJoin from "url-join";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import bg from "../assets/login-bg.jpg";
import github from "../assets/login-logos/github-light.svg";
// import google from "../assets/login-logos/google.svg";

function Login() {
  return (
    <>
      <div className="App" style={{ backgroundImage: `url(${bg})` }}>
        <TheHeader />
        <div id="content" className="flex items-center justify-center text-defaultText">
          <div className="mx-5 block w-[24rem] max-w-full flex-shrink-0 border-[5px] border-slate-200 bg-white px-6 pb-6 pt-8 shadow-card">
            <h1 className="mb-7 mt-1 text-center text-3xl font-semibold">Login</h1>
            <a
              href={urlJoin(import.meta.env.VITE_DRAWREF_API || "", "auth/github")}
              className="my-2.5 flex cursor-pointer items-center gap-4 rounded-sm bg-slate-800 py-[0.68rem] pl-12 text-center text-lg font-semibold text-white"
            >
              <img src={github} alt="GitHub logo" className="h-7" />
              <span>Sign in with GitHub</span>
            </a>
            {/* <div className="my-2.5 flex cursor-pointer items-center gap-4 rounded border-[3px] border-slate-200 bg-white py-2 pl-[2.85rem] text-center text-lg font-semibold">
              <img src={google} alt="Google logo" className="h-7" />
              <span>Sign in with Google</span>
            </div> */}
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default Login;
