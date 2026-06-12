import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Our Store | Shahi Boutique',
  description: 'Visit our flagship boutique in Malerkotla, Punjab for a premium personalized shopping experience.',
}

export default function StoresPage() {
  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image 
            src="/media/store_malerkotla.webp" 
            alt="Shahi Boutique Interior" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-sans font-black tracking-tighter text-white uppercase mb-6 leading-none">
            OUR BOUTIQUE
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Experience the elegance of Shahi in person. Visit our flagship store in Punjab for bespoke styling and exclusive collections.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 md:py-32 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Image Side */}
          <div className="relative aspect-[4/5] w-full rounded-[2rem] overflow-hidden group">
            <Image 
              src="/media/store_malerkotla.webp" 
              alt="Shahi Boutique Malerkotla" 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 transition-opacity duration-700 group-hover:opacity-0" />
          </div>

          {/* Details Side */}
          <div className="space-y-12">
            <div>
              <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full mb-6">
                <MapPin className="w-4 h-4 text-[#FF7A00]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Flagship Location</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black font-sans tracking-tighter uppercase text-gray-900 mb-6">
                Malerkotla, Punjab
              </h2>
              <p className="text-gray-500 font-medium leading-relaxed mb-8">
                Located in the heart of Malerkotla, our flagship boutique offers an immersive luxury shopping experience. Discover our latest collections, receive personalized styling advice, and experience our bespoke bridal services in a private, elegant setting.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-gray-900" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Address</h4>
                    <p className="text-gray-900 font-medium text-sm leading-relaxed">
                      Telian Bazar,<br />
                      Malerkotla, Punjab 148023<br />
                      India
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-gray-900" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Opening Hours</h4>
                    <p className="text-gray-900 font-medium text-sm leading-relaxed">
                      Mon - Sat: 10:00 AM - 8:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-gray-900" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Contact</h4>
                    <p className="text-gray-900 font-medium text-sm leading-relaxed">
                      +91 9217890060
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-gray-900" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Email</h4>
                    <p className="text-gray-900 font-medium text-sm leading-relaxed">
                      contact.shahiboutique@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row gap-4">
              <a 
                href="https://www.google.com/maps/place/Shahi+Boutique/@30.5287815,75.8784215,17z/data=!3m1!4b1!4m6!3m5!1s0x39106772171cb033:0x18c0149d0462835f!8m2!3d30.5287769!4d75.8809964!16s%2Fg%2F11wr03sgrs?entry=ttu&g_ep=EgoyMDI2MDYwOS4wIKXMDSoASAFQAw%3D%3D" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center justify-center bg-[#1C1C1C] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-[#FF7A00] transition-colors shadow-xl"
              >
                Get Directions
              </a>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:border-gray-900 transition-colors"
              >
                Book Appointment
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-[#F8F9FA] py-20 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-5xl font-black font-sans tracking-tighter uppercase text-gray-900 mb-16">
            In-Store Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            
            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center">
                <span className="text-2xl font-black text-gray-300">01</span>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-widest text-gray-900">Personal Styling</h3>
              <p className="text-gray-500 font-medium text-sm leading-relaxed">
                Work one-on-one with our expert stylists to curate a wardrobe perfectly tailored to your unique taste and lifestyle.
              </p>
            </div>

            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center">
                <span className="text-2xl font-black text-gray-300">02</span>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-widest text-gray-900">Bespoke Bridal</h3>
              <p className="text-gray-500 font-medium text-sm leading-relaxed">
                Enjoy exclusive access to our private bridal suites for a consultation regarding your custom wedding trousseau.
              </p>
            </div>

            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center">
                <span className="text-2xl font-black text-gray-300">03</span>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-widest text-gray-900">Expert Alterations</h3>
              <p className="text-gray-500 font-medium text-sm leading-relaxed">
                Ensure the perfect fit with our complimentary in-house tailoring and alteration services for all boutique purchases.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
