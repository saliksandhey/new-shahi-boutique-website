export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        {/* Luxury Spinner */}
        <div className="relative w-16 h-16">
          {/* Outer track */}
          <div className="absolute inset-0 rounded-full border-[1px] border-gray-100"></div>
          {/* Inner spinning metallic gold ring */}
          <div 
            className="absolute inset-0 rounded-full border-[1px] border-transparent border-t-[#D4AF37] border-r-[#D4AF37] animate-spin" 
            style={{ animationDuration: '1.5s' }}
          ></div>
          {/* Center glowing dot */}
          <div className="absolute inset-0 m-auto w-1 h-1 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_8px_#D4AF37]"></div>
        </div>
        
        {/* Elegant Text */}
        <p className="mt-8 text-[10px] sm:text-xs uppercase tracking-[0.4em] font-medium text-gray-400 animate-pulse">
          Curating
        </p>
      </div>
    </div>
  )
}
