import { Link } from "react-router-dom";

import TheHeader from '../components/TheHeader';
import TheFooter from '../components/TheFooter';

function Landing() {
  return (
    <>
      <div className="App bg-white">
        <TheHeader />
        <div id="content" className="bg-white text-center text-defaultText">
          <h1 className="text-3xl font-semibold mt-10 mb-3">
            Select a category
          </h1>
          <div className="flex w-[60rem] max-w-full px-4 mx-auto flex-wrap justify-center items-center my-8 gap-8 md:gap-12">
            <Link to="/" className="block w-[15rem] px-3 py-3 shadow-card border-slate-200 border-[5px] flex-shrink-0">
              <div className="w-full h-[12.5rem] bg-slate-300 rounded"></div>
              <h2 className="font-medium mt-2 -mb-1 text-2xl">Poses</h2>
            </Link>
            <Link to="/" className="block w-[15rem] px-3 py-3 shadow-card border-slate-200 border-[5px] flex-shrink-0">
              <div className="w-full h-[12.5rem] bg-slate-300 rounded"></div>
              <h2 className="font-medium mt-2 -mb-1 text-2xl">Faces</h2>
            </Link>
            <Link to="/" className="block w-[15rem] px-3 py-3 shadow-card border-slate-200 border-[5px] flex-shrink-0">
              <div className="w-full h-[12.5rem] bg-slate-300 rounded"></div>
              <h2 className="font-medium mt-2 -mb-1 text-2xl">Animals</h2>
            </Link>
            <Link to="/" className="block w-[15rem] px-3 py-3 shadow-card border-slate-200 border-[5px] flex-shrink-0">
              <div className="w-full h-[12.5rem] bg-slate-300 rounded"></div>
              <h2 className="font-medium mt-2 -mb-1 text-2xl">Hands</h2>
            </Link>
            <Link to="/" className="block w-[15rem] px-3 py-3 shadow-card border-slate-200 border-[5px] flex-shrink-0">
              <div className="w-full h-[12.5rem] bg-slate-300 rounded"></div>
              <h2 className="font-medium mt-2 -mb-1 text-2xl">Plants</h2>
            </Link>
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default Landing;
