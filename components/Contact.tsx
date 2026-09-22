import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, AlertCircle } from 'lucide-react';
import { TextReveal } from './TextReveal';
import { RevealOnScroll } from './RevealOnScroll';

interface ContactProps {
  prefillData?: { details?: string };
}

export const Contact: React.FC<ContactProps> = ({ prefillData }) => {
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'succeeded' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (prefillData?.details) {
      setDetails(prefillData.details);
    }
  }, [prefillData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Convert FormData to standard JSON payload
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    try {
      const response = await fetch('https://formspree.io/f/xeeweynw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setStatus('succeeded');
        form.reset();
        setDetails('');
      } else {
        const result = await response.json();
        if (result.errors) {
          setErrorMessage(result.errors.map((err: any) => err.message).join(', '));
        } else {
          setErrorMessage('Failed to send consultation request. Please try again.');
        }
        setStatus('failed');
      }
    } catch (err) {
      setErrorMessage('A network error occurred. Please check your connection.');
      setStatus('failed');
    }
  };

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
                Let us elevate your home. Contact us for a complimentary professional design consultation and detailed quotation.
              </p>

              {/* Disclaimer */}
              <div className="flex items-start gap-3.5 p-4 bg-amber-50/70 border border-amber-200/80 rounded-sm mb-8">
                <AlertCircle className="text-[#8c6517] shrink-0 mt-0.5" size={18} />
                <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed">
                  <span className="font-bold text-stone-900">Please Note:</span> We specialize in bespoke commissions such as custom built-in cupboards, luxury kitchens, dining tables, cabinetry, beds, and <span className="font-bold">custom wooden benches</span>. We do not manufacture standalone chairs, metal frames, or upholstery.
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
                    <p className="text-stone-600 text-xs sm:text-sm mt-0.5">Whitehall Close, Portland, Cape Town</p>
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
                    <Phone size={18} />
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-stone-900 font-semibold">
                      Phone & WhatsApp
                    </h3>
                    <a href="tel:0734851573" className="text-stone-600 hover:text-[#8c6517] text-xs sm:text-sm mt-0.5 block transition-colors">
                      073 485 1573
                    </a>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          <div className="lg:col-span-7">
            <RevealOnScroll className="bg-white p-7 sm:p-10 border border-stone-200 rounded-sm shadow-lg relative min-h-[500px] flex flex-col justify-between">
              {status === 'succeeded' ? (
                <div className="flex flex-col items-center justify-center text-center py-16 px-4 animate-fade-in my-auto">
                  <div className="w-16 h-16 bg-[#c5a059]/15 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-[#c5a059]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-serif text-stone-900 mb-4 tracking-wide font-medium">
                    Proposal Received
                  </h3>
                  <p className="text-stone-600 font-light max-w-sm mb-6 leading-relaxed text-sm sm:text-base">
                    Thank you. Your custom commission inquiry has been securely delivered to our master workshop in Cape Town.
                  </p>
                  <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#8c6517]">
                    “We respond within 24 hours”
                  </p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="mt-8 px-6 py-3 text-xs uppercase tracking-[0.18em] font-bold border border-stone-300 text-stone-700 hover:text-stone-900 hover:border-stone-900 transition-all duration-300 rounded-sm cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  {status === 'failed' && (
                    <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2.5 rounded-sm">
                      <AlertCircle className="shrink-0 text-rose-600" size={18} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="firstName" className="block text-xs font-bold text-stone-700 uppercase tracking-[0.14em] mb-1.5">
                        First Name *
                      </label>
                      <input 
                        id="firstName"
                        name="firstName" 
                        type="text" 
                        required 
                        placeholder="e.g. Eleanor"
                        className="w-full px-4 py-3 border border-stone-300 rounded-sm text-stone-900 text-sm focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] outline-none transition-colors" 
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-xs font-bold text-stone-700 uppercase tracking-[0.14em] mb-1.5">
                        Last Name *
                      </label>
                      <input 
                        id="lastName"
                        name="lastName" 
                        type="text" 
                        required 
                        placeholder="e.g. Vance"
                        className="w-full px-4 py-3 border border-stone-300 rounded-sm text-stone-900 text-sm focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] outline-none transition-colors" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-stone-700 uppercase tracking-[0.14em] mb-1.5">
                        Email Address *
                      </label>
                      <input 
                        id="email"
                        name="email" 
                        type="email" 
                        required 
                        placeholder="name@example.com"
                        className="w-full px-4 py-3 border border-stone-300 rounded-sm text-stone-900 text-sm focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] outline-none transition-colors" 
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold text-stone-700 uppercase tracking-[0.14em] mb-1.5">
                        Phone / WhatsApp *
                      </label>
                      <input 
                        id="phone"
                        name="phone" 
                        type="tel" 
                        required 
                        placeholder="073 000 0000"
                        className="w-full px-4 py-3 border border-stone-300 rounded-sm text-stone-900 text-sm focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] outline-none transition-colors" 
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-xs font-bold text-stone-700 uppercase tracking-[0.14em] mb-1.5">
                      Commission Category *
                    </label>
                    <select 
                      id="type"
                      name="type" 
                      required 
                      className="w-full px-4 py-3 border border-stone-300 rounded-sm text-stone-900 text-sm focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] outline-none bg-white transition-colors cursor-pointer"
                    >
                      <option value="">Select project type...</option>
                      <option value="cupboards">Built-in Cupboards & Wardrobes</option>
                      <option value="kitchen">Custom Kitchen Installation</option>
                      <option value="table">Solid Hardwood Dining / Coffee Table</option>
                      <option value="bench">Custom Wooden Bench</option>
                      <option value="restoration">Antique Furniture Restoration</option>
                      <option value="other">Other Bespoke Wood Creation</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="dimensions" className="block text-xs font-bold text-stone-700 uppercase tracking-[0.14em] mb-1.5">
                        Approx. Dimensions
                      </label>
                      <input 
                        id="dimensions"
                        name="dimensions" 
                        type="text" 
                        placeholder="e.g. 2.4m x 1.0m or room size" 
                        className="w-full px-4 py-3 border border-stone-300 rounded-sm text-stone-900 text-sm focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] outline-none transition-colors" 
                      />
                    </div>
                    <div>
                      <label htmlFor="finish" className="block text-xs font-bold text-stone-700 uppercase tracking-[0.14em] mb-1.5">
                        Wood / Finish Choice
                      </label>
                      <select 
                        id="finish"
                        name="finish" 
                        className="w-full px-4 py-3 border border-stone-300 rounded-sm text-stone-900 text-sm focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] outline-none bg-white transition-colors cursor-pointer"
                      >
                        <option value="">Select Preferred Finish...</option>
                        <option value="walnut">American Walnut (Natural Satin)</option>
                        <option value="french-oak">French Oak (Warm Honey)</option>
                        <option value="nordic-ash">Nordic Ash (Pale Linen)</option>
                        <option value="teak">Burmese Teak (Golden Amber)</option>
                        <option value="other">Other / Undecided</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="details" className="block text-xs font-bold text-stone-700 uppercase tracking-[0.14em] mb-1.5">
                      Project Vision & Space Details
                    </label>
                    <textarea 
                      id="details"
                      name="details" 
                      rows={4}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Describe your room, aesthetic preferences, special requirements, or inspiration..." 
                      className="w-full px-4 py-3 border border-stone-300 rounded-sm text-stone-900 text-sm focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] outline-none resize-none transition-colors"
                    />
                  </div>

                  <button 
                    id="contact-submit-button"
                    type="submit"
                    disabled={status === 'submitting'}
                    className={`w-full min-h-[50px] py-4 uppercase tracking-[0.18em] text-xs sm:text-[13px] font-bold rounded-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98] ${
                      status === 'submitting' 
                        ? 'bg-[#c5a059] text-white opacity-85 cursor-wait' 
                        : 'bg-stone-950 text-white hover:bg-[#c5a059]'
                    }`}
                  >
                    {status === 'submitting' ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Transmitting Request...</span>
                      </>
                    ) : (
                      <span>Submit Commission Request &rarr;</span>
                    )}
                  </button>
                </form>
              )}
            </RevealOnScroll>
          </div>

        </div>
      </div>
    </section>
  );
};
