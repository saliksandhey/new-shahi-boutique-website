import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Returns & Exchanges | SHAHI',
  description: 'Learn about our returns and exchanges policy.',
}

export default function ReturnsPage() {
  return (
    <div className="bg-white min-h-screen pb-20 md:pb-32">
      {/* Header Section */}
      <div className="bg-[#F8F9FA] py-16 md:py-24 px-6 text-center rounded-b-[2rem] md:rounded-b-[3rem] mb-12 md:mb-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-black tracking-tighter text-gray-900 uppercase mb-4 md:mb-6 leading-none">
          RETURNS & EXCHANGES
        </h1>
        <p className="text-gray-500 font-medium max-w-xl mx-auto text-sm md:text-base">
          Not perfectly satisfied? We've got you covered. Here is everything you need to know about returning or exchanging your SHAHI pieces.
        </p>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="space-y-12 md:space-y-16">
          
          {/* Section 1 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center text-xs shadow-sm shrink-0">01</span>
              Our Return Policy
            </h2>
            <div className="bg-[#F8F9FA] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 text-sm md:text-base text-gray-500 leading-relaxed font-medium">
              <p>
                We accept returns up to <strong className="text-gray-900">14 days after delivery</strong>, if the item is unused and in its original condition, and we will refund the full order amount minus the shipping costs for the return. 
              </p>
              <ul className="list-disc pl-5 mt-4 space-y-2">
                <li>Items must be unworn, unwashed, and have original tags attached.</li>
                <li>Shoes must be tried on indoors and free of any scuffs or wear.</li>
                <li>For hygiene reasons, underwear, swimwear, and pierced jewelry cannot be returned unless faulty.</li>
                <li>Items marked as "Final Sale" cannot be returned or exchanged.</li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center text-xs shadow-sm shrink-0">02</span>
              How to Start a Return
            </h2>
            <div className="bg-[#F8F9FA] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 text-sm md:text-base text-gray-500 leading-relaxed font-medium">
              <p className="mb-6">
                To initiate a return, please follow these simple steps:
              </p>
              <ol className="space-y-6">
                <li className="flex items-start">
                  <span className="font-bold text-[#FF7A00] mr-4 block">1.</span>
                  <div>
                    <strong className="block text-gray-900 mb-1">Email Us</strong>
                    Reach out to <a href="mailto:contact.shahiboutique@gmail.com" className="text-[#FF7A00] hover:text-[#1C1C1C] transition-colors underline">contact.shahiboutique@gmail.com</a> with your order number and the reason for the return.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-[#FF7A00] mr-4 block">2.</span>
                  <div>
                    <strong className="block text-gray-900 mb-1">Receive Authorization</strong>
                    Once approved, we will provide you with a Return Merchandise Authorization (RMA) number and a return shipping address.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-[#FF7A00] mr-4 block">3.</span>
                  <div>
                    <strong className="block text-gray-900 mb-1">Ship It Back</strong>
                    Pack the items securely in the original packaging, include the RMA number, and ship it using a trackable shipping method.
                  </div>
                </li>
              </ol>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center text-xs shadow-sm shrink-0">03</span>
              Exchanges
            </h2>
            <div className="bg-[#F8F9FA] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 text-sm md:text-base text-gray-500 leading-relaxed font-medium">
              <p>
                If you need a different size or color, the fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item. We process exchanges as a return followed by a new order.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center text-xs shadow-sm shrink-0">04</span>
              Refunds
            </h2>
            <div className="bg-[#F8F9FA] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 text-sm md:text-base text-gray-500 leading-relaxed font-medium">
              <p>
                We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method within <strong className="text-gray-900">5-7 business days</strong>.
              </p>
              <p className="mt-4">
                Please remember it can take some time for your bank or credit card company to process and post the refund. If more than 15 business days have passed since we approved your return, please contact us.
              </p>
              <div className="mt-6 p-4 rounded-xl bg-gray-100 border border-gray-200">
                <span className="font-bold text-gray-900 block mb-1 uppercase tracking-widest text-[10px]">Damaged Items</span>
                In the event that your order arrives damaged in any way, please email us as soon as possible with your order number and a photo of the item's condition. We address these on a case-by-case basis but will try our best to work towards a satisfactory solution.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
