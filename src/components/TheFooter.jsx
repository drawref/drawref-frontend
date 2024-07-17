import { Link } from "react-router-dom";

function TheFooter() {
  return (
    <>
      <div className="sticky bottom-0 flex flex-col">
        <div className="h-20 bg-gradient-to-b from-transparent to-white dark:to-primary-950 sm:hidden"></div>
        <footer className="flex items-center justify-center gap-1 border-t-[5px] border-t-secondary-200 bg-primary-600 px-2 pb-1.5 pt-1 text-white dark:border-t-secondary-600 dark:bg-primary-800">
          {"DrawRef · "}
          <Link to="/about" className="text-[#d2ebf4]">
            About
          </Link>
          {" · "}
          <a href="https://github.com/DanielOaks/drawref-frontend" className="text-[#d2ebf4]">
            Source Code
          </a>
        </footer>
      </div>
    </>
  );
}

export default TheFooter;
