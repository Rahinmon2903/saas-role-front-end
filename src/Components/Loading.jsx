const Loading = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-neutral-700 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm text-neutral-300">
          Loading…
        </p>
      </div>
    </div>
  );
};

export default Loading;
