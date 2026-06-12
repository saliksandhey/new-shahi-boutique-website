export default function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-2 border-stone-200 border-t-black rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-serif uppercase tracking-widest text-stone-500 animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
