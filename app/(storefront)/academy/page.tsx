import type { Metadata } from 'next'
import Link from 'next/link'
import { Scissors, Palette, Lightbulb, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Academy | SHAHI',
  description: 'Learn the art of fashion design with Shahi Boutique Academy.',
}

export default function AcademyPage() {
  const features = [
    {
      icon: Scissors,
      title: 'Pattern Making & Tailoring',
      description: 'Master the technical skills needed to construct high-quality garments from scratch. Learn precise measurements, cutting, and stitching techniques.'
    },
    {
      icon: Palette,
      title: 'Fashion Illustration',
      description: 'Bring your ideas to life. Learn how to sketch your concepts, use color theory, and present your designs professionally.'
    },
    {
      icon: Lightbulb,
      title: 'Creative Direction',
      description: 'Develop a unique aesthetic and brand identity. Learn how to curate collections, plan photoshoots, and tell a compelling story through fashion.'
    },
    {
      icon: TrendingUp,
      title: 'Business & Marketing',
      description: 'Turn your passion into a profitable business. Learn about sourcing materials, manufacturing, e-commerce, and social media marketing.'
    }
  ]

  return (
    <div className="bg-white min-h-screen pb-32">
      
      {/* Hero Section */}
      <div className="bg-[#1C1C1C] text-white py-32 px-6 sm:px-8 lg:px-12 text-center rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-[0.3em] mb-6 block">
            Learn From The Best
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-black tracking-tighter uppercase mb-8 leading-none">
            SHAHI ACADEMY
          </h1>
          <p className="mt-6 text-gray-300 font-medium text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Master the art of modern fashion design. From pattern making to brand building, we provide the knowledge and tools you need to launch your own label.
          </p>
          <div className="mt-12">
            <a 
              href="https://coaching.shahiboutique.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#FF7A00] text-white rounded-full px-12 py-6 text-sm font-black uppercase tracking-widest hover:bg-white hover:text-[#1C1C1C] transition-colors duration-300 shadow-xl hover:scale-105 transform"
            >
              Enroll Now
            </a>
          </div>
        </div>
      </div>

      {/* Curriculum Section */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-sans font-black tracking-tighter text-gray-900 uppercase">
            What You Will Learn
          </h2>
          <div className="w-24 h-2 bg-[#FF7A00] mx-auto mt-8 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="bg-[#F8F9FA] rounded-[3rem] p-10 sm:p-14 border border-gray-100 hover:border-[#FF7A00]/30 transition-colors duration-300 group">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-10 h-10 text-[#FF7A00]" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <div className="bg-[#F8F9FA] rounded-[3rem] p-12 sm:p-20 text-center border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FF7A00] to-[#ff9900]"></div>
          <h2 className="text-3xl sm:text-5xl font-sans font-black tracking-tighter text-gray-900 uppercase mb-6">
            Ready to start your journey?
          </h2>
          <p className="text-gray-500 font-medium text-lg mb-10 max-w-2xl mx-auto">
            Our registration and student portal is hosted on a dedicated platform. Click below to view course schedules, pricing, and sign up for our upcoming batches.
          </p>
          <a 
            href="https://coaching.shahiboutique.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#1C1C1C] text-white rounded-full px-12 py-6 text-sm font-black uppercase tracking-widest hover:bg-[#FF7A00] transition-colors duration-300 shadow-lg"
          >
            Go to Coaching Portal
          </a>
        </div>
      </div>

    </div>
  )
}
