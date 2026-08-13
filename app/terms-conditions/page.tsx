import React from "react";
import Link from "next/link";

export default function TermsConditionsPage() {
  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-[#FAFAF9] pt-[83px]">
      
      {/* Header Banner */}
      <div className="w-full bg-[#1C1917] py-16 px-4 flex flex-col items-center justify-center text-center">
        <h1 className="font-poppins font-semibold text-[32px] md:text-[48px] text-[#FAFAF9] leading-tight mb-4">
          Terms & Conditions
        </h1>
        <p className="font-poppins text-[15px] text-[#FAFAF9]/70 max-w-[600px]">
          Please read these terms and conditions carefully before using our website.
        </p>
      </div>

      {/* Content */}
      <div className="w-full max-w-[900px] mx-auto px-6 md:px-12 py-16 md:py-24 flex flex-col gap-10">
        
        <section className="flex flex-col gap-4">
          <h2 className="font-poppins font-medium text-[24px] text-[#1C1917]">1. General Conditions</h2>
          <p className="font-poppins text-[15px] leading-[26px] text-stone-600">
            By accessing and placing an order with Laural Clothing, you confirm that you are in agreement with and bound by the terms of service contained in the Terms & Conditions outlined below. These terms apply to the entire website and any email or other type of communication between you and Laural Clothing.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-poppins font-medium text-[24px] text-[#1C1917]">2. Products and Services</h2>
          <p className="font-poppins text-[15px] leading-[26px] text-stone-600">
            Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy. We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-poppins font-medium text-[24px] text-[#1C1917]">3. Accuracy of Billing and Account Information</h2>
          <p className="font-poppins text-[15px] leading-[26px] text-stone-600">
            We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-poppins font-medium text-[24px] text-[#1C1917]">4. Pricing and Payment</h2>
          <p className="font-poppins text-[15px] leading-[26px] text-stone-600">
            Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time. We shall not be liable to you or to any third-party for any modification, price change, suspension, or discontinuance of the Service. Payment can be made through our secure checkout via Cash on Delivery, Credit/Debit cards, or integrated "Buy Now Pay Later" partners.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-poppins font-medium text-[24px] text-[#1C1917]">5. Intellectual Property</h2>
          <p className="font-poppins text-[15px] leading-[26px] text-stone-600">
            The website and its original content, features, and functionality are owned by Laural Clothing and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-poppins font-medium text-[24px] text-[#1C1917]">6. Contact Information</h2>
          <p className="font-poppins text-[15px] leading-[26px] text-stone-600">
            Questions about the Terms of Service should be sent to us via our <Link href="/contact" className="text-[#C19A5B] hover:underline underline-offset-4">Contact Us</Link> page.
          </p>
        </section>

      </div>
    </main>
  );
}
