function TheFooter() {
  return (
    <>
      <div className="flex flex-col sticky bottom-0">
        <div className="h-20 bg-gradient-to-b from-transparent to-white sm:hidden"></div>
        <footer className="bg-primary-600 flex gap-1 justify-center items-center px-2 pt-1 pb-1.5 text-white border-t-[5px] border-t-secondary-200">
          DrawRef &middot; <a href="https://github.com/DanielOaks" className="text-[#d2ebf4]">Source Code</a>
        </footer>
      </div>
    </>
  );
}

export default TheFooter;
