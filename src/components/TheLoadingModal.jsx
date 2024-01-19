function TheLoadingModal() {
  return (
    <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-slate-800 bg-opacity-50 text-white backdrop-blur-sm">
      <span className="text-xl font-semibold">Loading...</span>
    </div>
  );
}

export default TheLoadingModal;
