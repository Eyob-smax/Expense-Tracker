export default function Overlay({ className = "" }: { className?: string }) {
  return (
    <div
      className={`fixed inset-0  bg-stone-800 w-full h-full flex items-center opacity-70 justify-center z-50 ${className}`}
    ></div>
  );
}
