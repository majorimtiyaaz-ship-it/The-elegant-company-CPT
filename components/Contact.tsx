import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, AlertCircle } from 'lucide-react';

interface ContactProps {
  prefillData?: { details?: string };
}

export const Contact: React.FC<ContactProps> = ({ prefillData }) => {
  const [details, setDetails] = useState('');

  useEffect(() => {
    if (prefillData?.details) {
      setDetails(prefillData.details);
    }
  }, [prefillData]);

  return (
    <div className="bg-white py-24 px-6 border-t border-gray-100">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div className="reveal-on-scroll">
            <h2 className="text-elegant-gold font-bold tracking-widest uppercase mb-3 text-xs md:text-sm">Get in Touch</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-elegant-dark mb-8">Start Your Commission</h3>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed font-light">
              Whether you have a specific design in mind or need guidance for your space, our master artisans are ready to bring your vision to life. 
              Fill out the form below to request a quote or visit our showroom.
            </p>

            {/* Disclaimer */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-sm mb-10">
              <AlertCircle className="text-elegant-gold shrink-0 mt-1" size={20} />
              <p className="text-sm text-gray-600">
                <span className="font-bold text-elegant-dark">Please Note:</span> We specialize in large custom pieces such as tables, cabinetry, beds, and <span className="font-bold">custom wooden benches</span>. 
                However, we <strong>do not design or manufacture dining chairs</strong> or standard wooden chairs.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-elegant-gray p-3 rounded-full text-elegant-gold">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-serif text-xl text-elegant-dark">Office Address</h4>
                  <p className="text-gray-500">Whitehall Close, Portland<br/>Cape Town</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-elegant-gray p-3 rounded-full text-elegant-gold">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-serif text-xl text-elegant-dark">Email</h4>
                  <p className="text-gray-500">elegantcompanythe@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-elegant-gray p-3 rounded-full text-elegant-gold">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-serif text-xl text-elegant-dark">Phone</h4>
                  <p className="text-gray-500">0734851573</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-elegant-gray p-10 shadow-lg reveal-on-scroll relative min-h-[500px] flex flex-col justify-between">
            {(() => {
              const [status, setStatus] = useState<'idle' | 'submitting' | 'succeeded' | 'failed'>('idle');
              const [errorMessage, setErrorMessage] = useState('');

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

              if (status === 'succeeded') {
                return (
                  <div className="flex flex-col items-center justify-center text-center py-16 px-4 animate-fade-in my-auto">
                    <div className="w-16 h-16 bg-[#c5a059]/10 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-8 h-8 text-[#c5a059]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-serif text-elegant-dark mb-4 tracking-wide">Proposal Received</h4>
                    <p className="text-gray-600 font-light max-w-sm mb-6 leading-relaxed">
                      Thank you. Your custom commission inquiry has been securely delivered to our master workshop.
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] font-bold text-elegant-gold">
                      “We respond within 24 hours”
                    </p>
                    <button 
                      onClick={() => setStatus('idle')}
                      className="mt-8 px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold border border-gray-300 text-gray-500 hover:text-elegant-gold hover:border-elegant-gold transition-all duration-300 rounded-sm"
                    >
                      Submit Another Request
                    </button>
                  </div>
                );
              }

              return (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {status === 'failed' && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 rounded-sm mb-4">
                      <AlertCircle className="shrink-0" size={18} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">First Name</label>
                      <input name="firstName" type="text" required className="w-full p-3 border border-gray-300 focus:border-elegant-gold outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Last Name</label>
                      <input name="lastName" type="text" required className="w-full p-3 border border-gray-300 focus:border-elegant-gold outline-none" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Email Address</label>
                      <input name="email" type="email" required className="w-full p-3 border border-gray-300 focus:border-elegant-gold outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Phone Number</label>
                      <input name="phone" type="tel" required className="w-full p-3 border border-gray-300 focus:border-elegant-gold outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Preferred Furniture Type</label>
                    <select name="type" className="w-full p-3 border border-gray-300 focus:border-elegant-gold outline-none bg-white">
                      <option value="">Select a type...</option>
                      <option value="bench">Custom Wooden Bench</option>
                      <option value="table">Dining / Coffee Table</option>
                      <option value="storage">Storage / Cabinetry</option>
                      <option value="bed">Bed Frame / Headboard</option>
                      <option value="other">Other Custom Wood Piece</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1 italic">* We do not manufacture standard chairs.</p>
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Desired Dimensions</label>
                     <input name="dimensions" type="text" placeholder="e.g. 8ft x 3ft" className="w-full p-3 border border-gray-300 focus:border-elegant-gold outline-none" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Wood Preference</label>
                        <input name="wood" type="text" placeholder="e.g. Walnut, Oak, Cherry" className="w-full p-3 border border-gray-300 focus:border-elegant-gold outline-none" />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Preferred Finish</label>
                        <select name="finish" className="w-full p-3 border border-gray-300 focus:border-elegant-gold outline-none bg-white">
                          <option value="">Select Finish...</option>
                          <option value="natural">Natural Oil</option>
                          <option value="matte">Matte</option>
                          <option value="satin">Satin</option>
                          <option value="gloss">High Gloss</option>
                        </select>
                     </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Specific Details & Ideas</label>
                    <textarea 
                      name="details" 
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Tell us more about your vision..." 
                      className="w-full h-32 p-3 border border-gray-300 focus:border-elegant-gold outline-none resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={status === 'submitting'}
                    className={`w-full py-4 tracking-widest uppercase text-xs shadow-md font-bold transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ${
                      status === 'submitting' 
                        ? 'bg-[#c5a059] text-white opacity-80 cursor-wait' 
                        : 'bg-elegant-dark text-white hover:bg-elegant-gold hover:shadow-lg'
                    }`}
                  >
                    {status === 'submitting' ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Transmitting Proposal...</span>
                      </>
                    ) : (
                      'Submit Inquiry Proposal'
                    )}
                  </button>
                </form>
              );
            })()}
          </div>

        </div>
      </div>
    </div>
  );
};