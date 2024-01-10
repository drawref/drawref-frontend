import TheHeader from '../components/TheHeader';
import TheFooter from '../components/TheFooter';
import bg from '../assets/login-bg.jpg';

function NotFound() {
  return (
    <>
      <div className="App" style={{ backgroundImage: `url(${bg})` }}>
        <TheHeader />
        <div id="content" className="flex items-center justify-center text-defaultText">
          <div className="block w-[24rem] max-w-full mx-5 px-6 pt-8 pb-7 shadow-card border-slate-200 bg-white border-[5px] flex-shrink-0 text-center">
            <h1 className="text-3xl font-semibold mt-1 mb-5">
              404 Not Found
            </h1>
            <p>
              We couldn't find that page, sorry!
            </p>
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default NotFound;
