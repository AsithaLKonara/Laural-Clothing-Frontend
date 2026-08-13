import React from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-[#FAFAF9] pt-[83px]">
      
      {/* Header Banner */}
      <div className="w-full bg-[#1C1917] py-16 px-4 flex flex-col items-center justify-center text-center">
        <h1 className="font-poppins font-semibold text-[32px] md:text-[48px] text-[#FAFAF9] leading-tight mb-4">
          Privacy Policy
        </h1>
        <p className="font-poppins text-[15px] text-[#FAFAF9]/70 max-w-[600px]">
          Last updated: August 2026. Your privacy is critically important to us at Laural Clothing.
        </p>
      </div>

      {/* Content */}
      <div className="w-full max-w-[900px] mx-auto px-6 md:px-12 py-16 md:py-24 flex flex-col gap-10">
        
        <section className="flex flex-col gap-4">
          <h2 className="font-poppins font-medium text-[24px] text-[#1C1917]">1. Information We Collect</h2>
          <p className="font-poppins text-[15px] leading-[26px] text-stone-600">
            We collect information you provide directly to us when you create an account, make a purchase, sign up for our newsletter, or contact customer support. This information may include your name, email address, phone number, shipping and billing address, and payment details.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-poppins font-medium text-[24px] text-[#1C1917]">2. How We Use Your Information</h2>
          <p className="font-poppins text-[15px] leading-[26px] text-stone-600">
            We use the information we collect to process your transactions, manage your orders, communicate with you about products, services, and promotional offers, and improve our store's performance. Your data helps us deliver a more personalized luxury shopping experience.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-poppins font-medium text-[24px] text-[#1C1917]">3. Data Security</h2>
          <p className="font-poppins text-[15px] leading-[26px] text-stone-600">
            We implement high-grade security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. All payment transactions are encrypted using secure socket layer (SSL) technology.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-poppins font-medium text-[24px] text-[#1C1917]">4. Cookies & Tracking</h2>
          <p className="font-poppins text-[15px] leading-[26px] text-stone-600">
            We use cookies to help us remember and process the items in your shopping cart, understand and save your preferences for future visits, and keep track of advertisements. You can choose to turn off all cookies via your browser settings, but doing so may affect the functionality of our website.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-poppins font-medium text-[24px] text-[#1C1917]">5. Third-Party Disclosure</h2>
          <p className="font-poppins text-[15px] leading-[26px] text-stone-600">
            We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties unless we provide you with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-poppins font-medium text-[24px] text-[#1C1917]">6. Contact Us</h2>
          <p className="font-poppins text-[15px] leading-[26px] text-stone-600">
            If there are any questions regarding this privacy policy, you may contact us using the information on our <Link href="/contact" className="text-[#C19A5B] hover:underline underline-offset-4">Contact Us</Link> page.
          </p>
        </section>

      </div>
    </main>
  );
}
