import { ShieldCheck, Truck, RefreshCcw, Sparkles } from 'lucide-react'

export function WhyChooseUs() {
  const features = [
    {
      name: 'Premium Quality',
      description: 'Meticulously sourced materials ensuring unparalleled comfort and lasting elegance.',
      icon: Sparkles,
    },
    {
      name: 'Worldwide Shipping',
      description: 'Delivering to your doorstep with our fast, secure global courier network.',
      icon: Truck,
    },
    {
      name: 'Easy Returns',
      description: 'A seamless, hassle-free return process designed for your absolute peace of mind.',
      icon: RefreshCcw,
    },
    {
      name: 'Secure Payments',
      description: 'Encrypted, safe, and flexible payment options for a worry-free shopping experience.',
      icon: ShieldCheck,
    },
  ]

  return (
    <section className="py-12 md:py-20 bg-[#F8F9FA] px-6 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-sans font-black text-gray-900 mb-3 tracking-tighter uppercase">
            The Shahi <span className="text-[#FF7A00]">Experience</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-lg font-medium">
            Uncompromising Quality & Service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col items-center text-center bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              
              <div className="mb-6">
                <div className="h-16 w-16 bg-[#1C1C1C] rounded-full flex items-center justify-center shadow-sm">
                  <feature.icon className="h-7 w-7 text-white" strokeWidth={1.5} />
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 tracking-wide mb-3">
                {feature.name}
              </h3>
              
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  )
}
