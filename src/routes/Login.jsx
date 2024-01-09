import TheHeader from '../components/TheHeader';
import TheFooter from '../components/TheFooter';
import bg from '../assets/login-bg.jpg';

function Login() {
  return (
    <>
      <div className="App" style={{ backgroundImage: `url(${bg})` }}>
        <TheHeader />
        <div id="content" className="flex items-center justify-center text-defaultText">
          <div className="block w-[24rem] max-w-full mx-5 px-3 pt-3 pb-2.5 shadow-card border-slate-200 bg-white border-[5px] flex-shrink-0">
            <h1 className="text-3xl font-semibold text-center mt-1 mb-6">
              Login
            </h1>
            <div className="bg-slate-800 text-white text-center text-lg py-1.5 rounded cursor-pointer my-2">Sign in with GitHub</div>
            <div className="bg-white border-[3px] border-slate-200 text-center text-lg py-1 rounded cursor-pointer my-2">Sign in with Google</div>
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default Login;
