import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import bg from "../assets/login-bg.jpg";

function NotFound() {
  return (
    <>
      <div className="App" style={{ backgroundImage: `url(${bg})` }}>
        <TheHeader />
        <div id="content" className="flex items-center justify-center text-defaultText">
          <div className="mx-5 block w-[24rem] max-w-full flex-shrink-0 border-[5px] border-slate-200 bg-white px-6 pb-7 pt-8 text-center shadow-card">
            <h1 className="mb-5 mt-1 text-3xl font-semibold">404 Not Found</h1>
            <p>We couldn't find that page, sorry!</p>
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default NotFound;
