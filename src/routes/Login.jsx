import TheHeader from '../components/TheHeader';
import TheFooter from '../components/TheFooter';
import bg from '../assets/login-bg.jpg';
import github from '../assets/login-logos/github-light.svg';
import google from '../assets/login-logos/google.svg';

function Login() {
  return (
    <>
      <div className="App" style={{ backgroundImage: `url(${bg})` }}>
        <TheHeader />
        <div id="content" className="flex items-center justify-center text-defaultText">
          <div className="block w-[24rem] max-w-full mx-5 px-6 pt-8 pb-6 shadow-card border-slate-200 bg-white border-[5px] flex-shrink-0">
            <h1 className="text-3xl font-semibold text-center mt-1 mb-7">
              Login
            </h1>
            <div className="bg-slate-800 text-white text-center font-semibold text-lg py-2.5 rounded-sm cursor-pointer my-2.5 flex pl-12 gap-4 items-center">
              <img src={github} alt="GitHub logo" className="h-7" />
              <span>Sign in with GitHub</span>
            </div>
            <div className="bg-white border-[3px] border-slate-200 text-center text-lg py-2 rounded cursor-pointer my-2.5 flex pl-12 gap-4 items-center">
              <img src={google} alt="Google logo" className="h-7" />
              <span>Sign in with Google</span>
            </div>
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default Login;
