import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | SHAHI',
  description: 'Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen pb-20 md:pb-32">
      {/* Header Section */}
      <div className="bg-[#F8F9FA] py-16 md:py-24 px-6 text-center rounded-b-[2rem] md:rounded-b-[3rem] mb-12 md:mb-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-black tracking-tighter text-gray-900 uppercase mb-4 md:mb-6 leading-none">
          PRIVACY POLICY
        </h1>
        <p className="text-gray-500 font-medium max-w-xl mx-auto text-sm md:text-base">
          Your privacy matters to us. Learn exactly how we handle, protect, and use your personal information when you shop with SHAHI.
        </p>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="space-y-12 md:space-y-16">
          
          {/* Section 1 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center text-xs shadow-sm shrink-0">01</span>
              Information We Collect
            </h2>
            <div className="bg-[#F8F9FA] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 text-sm md:text-base text-gray-500 leading-relaxed font-medium">
              <p>
                When you visit our store, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
              </p>
              <p className="mt-4">
                Additionally, when you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, payment information, email address, and phone number. We refer to this information as <strong className="text-gray-900">“Order Information”</strong>.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center text-xs shadow-sm shrink-0">02</span>
              How We Use Your Information
            </h2>
            <div className="bg-[#F8F9FA] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 text-sm md:text-base text-gray-500 leading-relaxed font-medium">
              <ul className="list-disc pl-5 space-y-3">
                <li>
                  <strong className="text-gray-900">Order Fulfillment:</strong> We use the Order Information to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing invoices/order confirmations).
                </li>
                <li>
                  <strong className="text-gray-900">Communication:</strong> We use this information to communicate with you and screen our orders for potential risk or fraud.
                </li>
                <li>
                  <strong className="text-gray-900">Marketing:</strong> When in line with the preferences you have shared with us, we provide you with information or advertising relating to our products or services.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center text-xs shadow-sm shrink-0">03</span>
              Sharing Your Personal Information
            </h2>
            <div className="bg-[#F8F9FA] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 text-sm md:text-base text-gray-500 leading-relaxed font-medium">
              <p>
                We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use third-party payment gateways like Razorpay to securely process your payments.
              </p>
              <p className="mt-4">
                We may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center text-xs shadow-sm shrink-0">04</span>
              Data Retention & Your Rights
            </h2>
            <div className="bg-[#F8F9FA] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 text-sm md:text-base text-gray-500 leading-relaxed font-medium">
              <p>
                When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.
              </p>
              <p className="mt-4">
                If you are a resident of certain regions, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us.
              </p>
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-2">Contact Us</h3>
                <p>
                  For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at <a href="mailto:contact.shahiboutique@gmail.com" className="font-bold text-[#FF7A00] hover:text-[#1C1C1C] transition-colors">contact.shahiboutique@gmail.com</a>.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
