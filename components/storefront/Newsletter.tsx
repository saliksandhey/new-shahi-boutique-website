'use client'

export function Newsletter() {
  return (
    <section className="py-24 bg-[#F8F9FA] px-6 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1400px] relative py-20 md:py-24 px-8 overflow-hidden bg-[#1C1C1C] rounded-[2.5rem] shadow-2xl">
        
        {/* Subtle Background Accent */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FF7A00] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#FF7A00] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 pointer-events-none" />

        <div className="mx-auto max-w-3xl text-center relative z-10">
          
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-6 tracking-tight text-white leading-tight">
              Join Our <span className="text-[#FF7A00]">Community</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base font-medium max-w-xl mx-auto">
              Subscribe to receive insider access to new streetwear drops, exclusive events, and limited-edition collections.
            </p>
          </div>

          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto relative">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 bg-white/10 border border-white/10 text-white placeholder:text-gray-500 px-6 py-4 focus:outline-none focus:border-[#FF7A00] transition-colors rounded-full shadow-inner backdrop-blur-sm"
              required
            />
            <button
              type="submit"
              className="bg-[#FF7A00] text-[#111111] px-8 py-4 font-bold tracking-widest text-xs uppercase hover:bg-white transition-colors rounded-full shadow-md shrink-0"
            >
              Subscribe
            </button>
          </form>

        </div>
      </div>
    </section>
  )
}
