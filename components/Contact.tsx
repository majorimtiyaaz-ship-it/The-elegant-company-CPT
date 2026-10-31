import React from 'react';
import { Mail, Phone, MapPin, AlertCircle } from 'lucide-react';
import { TextReveal } from './TextReveal';
import { RevealOnScroll } from './RevealOnScroll';
import { WhatsAppIcon } from './WhatsAppIcon';
import { whatsappUrl, track } from './BookCTA';
import { EnquiryForm } from './EnquiryForm';

interface ContactProps {
  prefillData?: { details?: string };
}

export const Contact: React.FC<ContactProps> = ({ prefillData }) => {
  return (
    <section id="contact-commission-section" className="bg-[#faf8f5] py-24 md:py-28 px-6 border-t border-stone-200/60">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          <div className="lg:col-span-5">
            <RevealOnScroll duration={0.8}>
              <span className="text-[#8c6517] font-semibold tracking-[0.24em] uppercase mb-3 text-xs md:text-sm block">
                COMMISSION A CREATION
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 mb-5 leading-tight">
                <TextReveal text="Start Your Commission" />
              </h2>
              <div className="w-16 h-[1.5px] bg-[#c5a059]/40 mb-5" />
              <p className="text-stone-600 text-sm sm:text-base mb-8 leading-relaxed font-light">
                Based in Mitchells Plain, Cape Town. Contact us for a professional design consultation. It starts with a R550 site visit, deducted from your final price if you go ahead, followed by a detailed written quotation.
              </p>

              {/* Disclaimer */}
              <div className="flex items-start gap-3.5 p-4 bg-amber-50/70 border border-amber-200/80 rounded-sm mb-8">
                <AlertCircle className="text-[#8c6517] shrink-0 mt-0.5" size={18} />
                <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed">
                  <span className="font-bold text-stone-900">Please Note:</span> We specialize in custom work such as built-in cupboards, luxury kitchens, dining tables, cabinetry, beds, and <span className="font-bold">custom wooden benches</span>. We do not manufacture standalone chairs, metal frames, or upholstery.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4 p-4 bg-white border border-stone-200/80 rounded-sm shadow-sm">
                  <div className="w-10 h-10 rounded-sm bg-[#faf8f5] flex items-center justify-center text-[#8c6517] shrink-0 border border-stone-200">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-stone-900 font-semibold">
                      Workshop & Office
                    </h3>
                    <p className="text-stone-600 text-xs sm:text-sm mt-0.5">Whitehall Close, Portland, Mitchells Plain, Cape Town</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white border border-stone-200/80 rounded-sm shadow-sm">
                  <div className="w-10 h-10 rounded-sm bg-[#faf8f5] flex items-center justify-center text-[#8c6517] shrink-0 border border-stone-200">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-stone-900 font-semibold">Email</h3>
                    <a href="mailto:elegantcompanythe@gmail.com" className="text-stone-600 hover:text-[#8c6517] text-xs sm:text-sm mt-0.5 block transition-colors">
                      elegantcompanythe@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white border border-stone-200/80 rounded-sm shadow-sm">
                  <div className="w-10 h-10 rounded-sm bg-[#faf8f5] flex items-center justify-center text-[#8c6517] shrink-0 border border-stone-200">
                    <WhatsAppIcon className="h-[18px] w-[18px]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-stone-900 font-semibold">WhatsApp</h3>
                    <a
                      href={whatsappUrl("Hi, I'd like a quote for a project. (via website: contact)")}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track('contact')}
                      className="text-stone-600 hover:text-[#8c6517] text-xs sm:text-sm mt-0.5 block transition-colors"
                    >
                      073 485 1573
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white border border-stone-200/80 rounded-sm shadow-sm">
                  <div className="w-10 h-10 rounded-sm bg-[#faf8f5] flex items-center justify-center text-[#8c6517] shrink-0 border border-stone-200">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-stone-900 font-semibold">Phone</h3>
                    <a
                      href="tel:0734851573"
                      onClick={() => track('call', 'call_click')}
                      className="text-stone-600 hover:text-[#8c6517] text-xs sm:text-sm mt-0.5 block transition-colors"
                    >
                      073 485 1573
                    </a>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          <div className="lg:col-span-7">
            <RevealOnScroll className="bg-white p-7 sm:p-10 border border-stone-200 rounded-sm shadow-lg relative min-h-[500px] flex flex-col">
              <EnquiryForm prefillDetails={prefillData?.details} />
            </RevealOnScroll>
          </div>

        </div>
      </div>
    </section>
  );
};
