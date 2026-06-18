import Image from 'next/image'

export function PotliShowcase() {
  return (
    <section className="py-10 md:py-16 bg-white overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
        <div className="text-center md:text-left mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-sans font-black text-gray-900 mb-3 tracking-tighter uppercase">
            The <span className="text-[#FF7A00]">Potli</span> Collection
          </h2>
          <p className="text-gray-500 text-sm md:text-lg font-medium max-w-2xl">
            Experience the elegance of handcrafted perfection. Our signature potli purses are designed to be the ultimate statement piece for every occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 lg:gap-8 h-auto md:h-[600px] lg:h-[700px]">
          
          {/* Main Video - Left Side */}
          <div className="md:col-span-7 lg:col-span-8 rounded-[2rem] overflow-hidden relative group h-[400px] md:h-full">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            >
              <source src="/media/potli_video_1.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-8 left-8 right-8 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <h3 className="text-white font-black text-2xl lg:text-3xl uppercase tracking-widest mb-2">Heritage Meets Modernity</h3>
              <p className="text-white/90 font-medium text-sm">Perfect for festive walks and evening galas.</p>
            </div>
          </div>

          {/* Right Side Stack */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-4 md:gap-6 lg:gap-8 h-[600px] md:h-full">
            
            {/* Top Image */}
            <div className="flex-1 rounded-[2rem] overflow-hidden relative group">
              <Image 
                src="/media/potli_image_1.jpeg" 
                alt="Handcrafted Potli Purses" 
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <span className="text-white font-bold uppercase tracking-widest text-xs">Exquisite Detailing</span>
              </div>
            </div>

            {/* Bottom Video */}
            <div className="flex-1 rounded-[2rem] overflow-hidden relative group">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              >
                <source src="/media/potli_video_2.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <span className="text-white font-bold uppercase tracking-widest text-xs">The Shikara Collection</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
