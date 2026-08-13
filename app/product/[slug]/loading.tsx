export default function Loading() {
  return (
    <div className="w-full min-h-screen pt-[83px] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-accent rounded-full animate-spin"></div>
        <p className="font-poppins text-primary font-medium tracking-wide">Loading product...</p>
      </div>
    </div>
  );
}
