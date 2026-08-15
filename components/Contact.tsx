import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, AlertCircle } from 'lucide-react';
import { TextReveal } from './TextReveal';
import { RevealOnScroll } from './RevealOnScroll';
import { useLanguage } from './LanguageContext';

interface ContactProps {
  prefillData?: { details?: string };
}

export const Contact: React.FC<ContactProps> = ({ prefillData }) => {
  const { language, t } = useLanguage();
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
          setErrorMessage(
            language === 'en' 
              ? 'Failed to send consultation request. Please try again.' 
              : 'Kon nie u konsultasieversoek stuur nie. Probeer asseblief weer.'
          );
        }
        setStatus('failed');
      }
    } catch (err) {
      setErrorMessage(
        language === 'en' 
          ? 'A network error occurred. Please check your connection.' 
          : "'n Netwerkfout het voorgekom. Kontroleer asseblief u verbinding."
      );
      setStatus('failed');
    }
  };

  return (
    <div className="bg-white py-24 px-6 border-t border-gray-100">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <RevealOnScroll>
            <h2 className="text-elegant-gold font-bold tracking-widest uppercase mb-3 text-xs md:text-sm">
              {t.contactTitle}
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif text-elegant-dark mb-8">
              <TextReveal text={language === 'en' ? "Start Your Commission" : "Begin U Kommissie"} />
            </h3>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed font-light">
              {t.contactSub}
            </p>

            {/* Disclaimer */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-sm mb-10">
              <AlertCircle className="text-elegant-gold shrink-0 mt-1" size={20} />
              <p className="text-sm text-gray-600">
                {language === 'en' ? (
                  <>
                    <span className="font-bold text-elegant-dark">Please Note:</span> We specialize in large custom pieces such as tables, cabinetry, beds, and <span className="font-bold">custom wooden benches</span>. 
                    However, we <strong>do not design or manufacture dining chairs</strong> or standard wooden chairs.
                  </>
                ) : (
                  <>
                    <span className="font-bold text-elegant-dark">Let Wel:</span> Ons spesialiseer in groot pasgemaakte meubels soos kaste, kombuise, tafels, beddens en <span className="font-bold">pasgemaakte houtbankies</span>. 
                    Ons ontwerp of vervaardig egter <strong>nie gewone eetkamerstoele nie</strong>.
                  </>
                )}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-elegant-gray p-3 rounded-full text-elegant-gold">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-serif text-xl text-elegant-dark">
                    {language === 'en' ? 'Office Address' : 'Kantooradres'}
                  </h4>
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
                  <h4 className="font-serif text-xl text-elegant-dark">
                    {language === 'en' ? 'Phone' : 'Telefoon'}
                  </h4>
                  <p className="text-gray-500">0734851573</p>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="bg-elegant-gray p-10 shadow-lg relative min-h-[500px] flex flex-col justify-between">
            {status === 'succeeded' ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-4 animate-fade-in my-auto">
                <div className="w-16 h-16 bg-[#c5a059]/10 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-[#c5a059]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h4 className="text-2xl font-serif text-elegant-dark mb-4 tracking-wide">
                  {language === 'en' ? 'Proposal Received' : 'Voorstel Ontvang'}
                </h4>
                <p className="text-gray-600 font-light max-w-sm mb-6 leading-relaxed">
                  {language === 'en' 
                    ? 'Thank you. Your custom commission inquiry has been securely delivered to our master workshop.' 
                    : 'Dankie. U pasgemaakte kommissie-navraag is veilig by ons werkswinkel afgelewer.'}
                </p>
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-elegant-gold">
                  {language === 'en' ? '“We respond within 24 hours”' : '“Ons reageer binne 24 uur”'}
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-8 px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold border border-gray-300 text-gray-500 hover:text-elegant-gold hover:border-elegant-gold transition-all duration-300 rounded-sm"
                >
                  {language === 'en' ? 'Submit Another Request' : 'Stuur Nog \'n Navraag'}
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {status === 'failed' && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 rounded-sm mb-4">
                    <AlertCircle className="shrink-0" size={18} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                      {language === 'en' ? 'First Name' : 'Voornaam'}
                    </label>
                    <input name="firstName" type="text" required className="w-full p-3 border border-gray-300 focus:border-elegant-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                      {language === 'en' ? 'Last Name' : 'Van'}
                    </label>
                    <input name="lastName" type="text" required className="w-full p-3 border border-gray-300 focus:border-elegant-gold outline-none" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                      {language === 'en' ? 'Email Address' : 'E-posadres'}
                    </label>
                    <input name="email" type="email" required className="w-full p-3 border border-gray-300 focus:border-elegant-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                      {language === 'en' ? 'Phone Number' : 'Telefoonnommer'}
                    </label>
                    <input name="phone" type="tel" required className="w-full p-3 border border-gray-300 focus:border-elegant-gold outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                    {language === 'en' ? 'Preferred Furniture Type' : 'Verkose Meubeltipe'}
                  </label>
                  <select name="type" className="w-full p-3 border border-gray-300 focus:border-elegant-gold outline-none bg-white">
                    <option value="">{language === 'en' ? 'Select a type...' : 'Kies \'n tipe...'}</option>
                    <option value="bench">{language === 'en' ? 'Custom Wooden Bench' : 'Pasgemaakte Houtbankie'}</option>
                    <option value="table">{language === 'en' ? 'Dining / Coffee Table' : 'Eetkamer- / Koffietafel'}</option>
                    <option value="storage">{language === 'en' ? 'Storage / Cabinetry' : 'Kaste & Ingeboude Kaste'}</option>
                    <option value="bed">{language === 'en' ? 'Bed Frame / Headboard' : 'Bedraam / Kopstuk'}</option>
                    <option value="other">{language === 'en' ? 'Other Custom Wood Piece' : 'Ander Pasgemaakte Houtstuk'}</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1 italic">
                    {language === 'en' ? '* We do not manufacture standard chairs.' : '* Ons vervaardig nie gewone eetkamerstoele nie.'}
                  </p>
                </div>

                <div>
                   <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                     {language === 'en' ? 'Desired Dimensions' : 'Verlangde Afmetings'}
                   </label>
                   <input name="dimensions" type="text" placeholder={language === 'en' ? 'e.g. 8ft x 3ft' : 'b.v. 2.4m x 1m'} className="w-full p-3 border border-gray-300 focus:border-elegant-gold outline-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                        {language === 'en' ? 'Wood Preference' : 'Hout-Voorkeur'}
                      </label>
                      <input name="wood" type="text" placeholder={language === 'en' ? 'e.g. Walnut, Oak, Cherry' : 'b.v. Okkerneuthout, Eikehout'} className="w-full p-3 border border-gray-300 focus:border-elegant-gold outline-none" />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                        {language === 'en' ? 'Preferred Finish' : 'Verkose Afwerking'}
                      </label>
                      <select name="finish" className="w-full p-3 border border-gray-300 focus:border-elegant-gold outline-none bg-white">
                        <option value="">{language === 'en' ? 'Select Finish...' : 'Kies Afwerking...'}</option>
                        <option value="natural">{language === 'en' ? 'Natural Oil' : 'Natuurlike Olie'}</option>
                        <option value="matte">{language === 'en' ? 'Matte' : 'Mat'}</option>
                        <option value="satin">{language === 'en' ? 'Satin' : 'Satyn'}</option>
                        <option value="gloss">{language === 'en' ? 'High Gloss' : 'Hoëglans'}</option>
                      </select>
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                    {language === 'en' ? 'Specific Details & Ideas' : 'Spesifieke Besonderhede & Idees'}
                  </label>
                  <textarea 
                    name="details" 
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder={language === 'en' ? 'Tell us more about your vision...' : 'Vertel ons meer van u visie...'} 
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
                      <span>{language === 'en' ? 'Transmitting Proposal...' : 'Besig met Versending...'}</span>
                    </>
                  ) : (
                    language === 'en' ? 'Submit Inquiry Proposal' : 'Dien Navraag-Voorstel In'
                  )}
                </button>
              </form>
            )}
          </RevealOnScroll>

        </div>
      </div>
    </div>
  );
};
