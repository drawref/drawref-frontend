import TheHeader from '../components/TheHeader';
import TheFooter from '../components/TheFooter';

function Login() {
  return (
    <>
      <div className="App bg-white">
        <TheHeader />
        <div id="content" className="flex items-center justify-center text-defaultText">
          <div className="block w-[24rem] max-w-full mx-5 px-3 pt-3 pb-1 shadow-lg border-slate-200 border-[5px] flex-shrink-0">
            <h1 className="text-3xl font-semibold text-center mb-6">
              Login
            </h1>
            <div class="bg-slate-800 text-white text-center text-lg py-1.5 rounded cursor-pointer my-3">Sign in with GitHub</div>
            <div class="bg-white border-[3px] border-slate-200 text-center text-lg py-1 rounded cursor-pointer my-3">Sign in with Google</div>
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default Login;
