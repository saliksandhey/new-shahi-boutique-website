import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | SHAHI',
  description: 'Our terms and conditions of service.',
}

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen pb-20 md:pb-32">
      {/* Header Section */}
      <div className="bg-[#F8F9FA] py-16 md:py-24 px-6 text-center rounded-b-[2rem] md:rounded-b-[3rem] mb-12 md:mb-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-black tracking-tighter text-gray-900 uppercase mb-4 md:mb-6 leading-none">
          TERMS OF SERVICE
        </h1>
        <p className="text-gray-500 font-medium max-w-xl mx-auto text-sm md:text-base">
          Please read these Terms of Service carefully before accessing or using our website.
        </p>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="space-y-12 md:space-y-16">
          
          {/* Section 1 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center text-xs shadow-sm shrink-0">01</span>
              Overview
            </h2>
            <div className="bg-[#F8F9FA] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 text-sm md:text-base text-gray-500 leading-relaxed font-medium">
              <p>
                This website is operated by SHAHI. Throughout the site, the terms “we”, “us” and “our” refer to SHAHI. SHAHI offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
              </p>
              <p className="mt-4">
                By visiting our site and/ or purchasing something from us, you engage in our “Service” and agree to be bound by the following terms and conditions.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center text-xs shadow-sm shrink-0">02</span>
              Online Store Terms
            </h2>
            <div className="bg-[#F8F9FA] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 text-sm md:text-base text-gray-500 leading-relaxed font-medium">
              <p>
                By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.
              </p>
              <p className="mt-4">
                You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center text-xs shadow-sm shrink-0">03</span>
              Modifications to the Service and Prices
            </h2>
            <div className="bg-[#F8F9FA] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 text-sm md:text-base text-gray-500 leading-relaxed font-medium">
              <p>
                Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
              </p>
              <p className="mt-4">
                We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center text-xs shadow-sm shrink-0">04</span>
              Products or Services
            </h2>
            <div className="bg-[#F8F9FA] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 text-sm md:text-base text-gray-500 leading-relaxed font-medium">
              <p>
                Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.
              </p>
              <p className="mt-4">
                We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate. All descriptions of products or product pricing are subject to change at anytime without notice, at the sole discretion of us.
              </p>
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-2">Contact Information</h3>
                <p>
                  Questions about the Terms of Service should be sent to us at <a href="mailto:contact.shahiboutique@gmail.com" className="font-bold text-[#FF7A00] hover:text-[#1C1C1C] transition-colors">contact.shahiboutique@gmail.com</a>.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
