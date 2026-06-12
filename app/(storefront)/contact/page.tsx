import type { Metadata } from 'next'
import { ContactForm } from '@/components/storefront/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us | SHAHI',
  description: 'Get in touch with our customer service team.',
}

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen pb-32 pt-24">
      {/* Header Banner */}
      <div className="bg-[#F8F9FA] py-24 px-6 sm:px-8 lg:px-12 text-center rounded-[3rem] mx-4 sm:mx-6 lg:mx-8 mb-16 shadow-sm border border-gray-100">
        <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-[0.2em] mb-4 block">
          Get in Touch
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-black tracking-tighter text-gray-900 uppercase mb-6 leading-none">CONCIERGE</h1>
        <p className="mt-6 text-gray-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
          We are dedicated to providing you with an exceptional experience. How may we assist you today?
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-6xl mx-auto items-start">
          
          {/* Customer Service Info */}
          <div className="bg-[#F8F9FA] p-10 sm:p-14 lg:p-16 rounded-[3rem] border border-gray-100 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-8 border-b border-gray-200 pb-4">Client Services</h2>
            <div className="space-y-8 text-sm text-gray-500 font-medium leading-relaxed">
              <p>
                Our client advisors are available to assist you with style advice, detailed product information, delivery questions, and returns. We aim to respond to all inquiries within 24 hours.
              </p>
              
              <div className="pt-6 border-t border-gray-200">
                <p className="font-bold text-[10px] tracking-widest uppercase text-gray-400 mb-2">Email</p>
                <a href="mailto:contact.shahiboutique@gmail.com" className="text-gray-900 font-bold hover:text-[#FF7A00] transition-colors text-base">contact.shahiboutique@gmail.com</a>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <p className="font-bold text-[10px] tracking-widest uppercase text-gray-400 mb-2">Phone</p>
                <a href="tel:+919217890060" className="text-gray-900 font-bold hover:text-[#FF7A00] transition-colors text-base">+91 9217890060</a>
                <p className="text-xs mt-2 text-gray-400">Monday to Friday, 9am - 6pm IST</p>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <p className="font-bold text-[10px] tracking-widest uppercase text-gray-400 mb-2">WhatsApp</p>
                <a href="https://wa.me/919041762820" className="text-gray-900 font-bold hover:text-[#FF7A00] transition-colors text-base">+91 9041762820</a>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <p className="font-bold text-[10px] tracking-widest uppercase text-gray-400 mb-2">Flagship Boutique</p>
                <p className="text-gray-900 font-bold text-base leading-snug">Telian Bazar<br/>Malerkotla, Punjab 148023<br/>India</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:pl-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-10 border-b border-gray-200 pb-4">Send a Message</h2>
            <ContactForm />
          </div>

        </div>
      </div>
    </div>
  )
}
