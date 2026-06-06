import React, { useState, useEffect } from 'react';
import { generateFurnitureConcept } from '../services/geminiService';
import { DesignConcept } from '../types';
import { Sparkles, Loader2, RefreshCw, PenTool, CheckCircle, ArrowRight } from 'lucide-react';

export const DesignStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [concept, setConcept] = useState<DesignConcept | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wishlistSaved, setWishlistSaved] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setConcept(null);
    setWishlistSaved(false);

    try {
      const result = await generateFurnitureConcept(prompt);
      setConcept(result);
    } catch (err) {
      setError("We encountered an issue connecting to our design engine. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToWishlist = () => {
    setWishlistSaved(true);
    // Automatically hide after 4 seconds
    setTimeout(() => {
      setWishlistSaved(false);
    }, 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerate();
  };

  // GSAP scroll and entrance animation for result panel
  useEffect(() => {
    const gsap = (window as any).gsap;
    if (!gsap || !concept) return;

    gsap.fromTo(".design-result-card", 
      { opacity: 0, y: 30, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" }
    );
  }, [concept]);

  return (
    <div className="bg-[#fbfcfa] py-28 px-6 min-h-screen relative overflow-hidden">
      {/* Background soft lighting */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.03),transparent_70%)] pointer-events-none" />
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-16 reveal-on-scroll">
          <div className="inline-flex items-center justify-center p-3.5 bg-elegant-gray rounded-full shadow-sm mb-6 border border-stone-100">
            <Sparkles className="text-elegant-gold w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-elegant-gold font-bold tracking-[0.25em] uppercase mb-4 text-xs md:text-sm">
            AI Design Studio
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif text-elegant-dark mb-6 leading-tight">
            Visualize Your Dream Piece
          </h3>
          <p className="text-gray-500 max-w-2xl mx-auto mb-6 text-base font-light leading-relaxed">
            Describe your ideal wooden furniture piece—wood species, style, era, or function. 
            Our intelligent design assistant will generate a unique visualization and specification concept instantly.
          </p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-normal">
            * We design custom benches, but do not manufacture dining chairs or standard wooden chairs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Input Section */}
          <div className="bg-white p-8 shadow-sm border border-stone-100 rounded-sm reveal-on-scroll">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">
                  Describe your vision
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., A low-profile mid-century modern coffee table made of solid walnut with tapered legs and visible joinery details..."
                  className="w-full h-44 p-4 border border-stone-200 focus:border-elegant-gold focus:ring-1 focus:ring-elegant-gold outline-none resize-none text-gray-700 text-base leading-relaxed bg-stone-50 transition-all duration-300 rounded-sm"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || !prompt.trim()}
                className={`relative w-full overflow-hidden py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 flex justify-center items-center gap-2 cursor-pointer border
                  ${loading 
                    ? 'bg-stone-300 border-stone-300 text-stone-500 cursor-not-allowed' 
                    : 'bg-elegant-dark hover:bg-elegant-gold border-elegant-dark hover:border-elegant-gold text-white shadow-sm hover:shadow-md'
                  }`}
              >
                {loading ? (
                  <><Loader2 className="animate-spin text-stone-500" size={18} /> Designing...</>
                ) : (
                  <><PenTool size={14} className="mr-1" /> Generate Concept</>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-stone-100">
               <h4 className="font-serif text-lg mb-4 text-elegant-dark italic font-semibold">
                 Recent Inspirations
               </h4>
               <div className="flex flex-wrap gap-2">
                 {['Entryway Bench', 'Library Bookshelf', 'Floating Bed Frame'].map(tag => (
                   <button 
                    key={tag}
                    onClick={() => {
                      setPrompt(`A bespoke solid wood ${tag} with custom artisan finishes, minimal modern profile, and rich premium joinery.`);
                    }}
                    className="relative group overflow-hidden px-4 py-2 border border-stone-200 hover:border-elegant-gold hover:text-elegant-gold text-stone-500 text-xs font-bold tracking-wider uppercase transition-all duration-300 rounded-full cursor-pointer bg-transparent"
                   >
                     {tag}
                   </button>
                 ))}
               </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="relative min-h-[500px] flex flex-col">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded mb-6 border border-red-100 text-sm transform transition-all duration-300">
                {error}
              </div>
            )}

            {wishlistSaved && (
              <div className="bg-[#fcfbf9] text-elegant-dark p-4 rounded-sm mb-6 border border-elegant-gold/30 flex items-center gap-3 text-sm animate-fade-in shadow-sm">
                <CheckCircle className="text-elegant-gold shrink-0" size={18} />
                <div>
                  <span className="font-bold">Concept saved!</span> A custom commissioning consultant will review this spec and reach out shortly.
                </div>
              </div>
            )}

            {!concept && !loading && !error && (
              <div className="h-full min-h-[440px] border-2 border-dashed border-stone-200 rounded-sm flex flex-col items-center justify-center text-stone-400 p-12 text-center bg-stone-50/50 reveal-on-scroll">
                <ArmchairPlaceholder />
                <p className="mt-6 font-serif italic text-lg text-stone-500">Your bespoke visualization will appear here</p>
                <p className="text-stone-400 text-xs uppercase tracking-widest mt-2 max-w-xs leading-relaxed">
                  Inputs are compiled by our high-fidelity design models instantly
                </p>
              </div>
            )}

            {loading && (
              <div className="h-full bg-white border border-stone-100 shadow-lg rounded-sm p-8 flex flex-col items-center justify-center min-h-[440px]">
                <div className="w-full h-64 bg-stone-100 mb-6 rounded animate-pulse"></div>
                <div className="w-3/4 h-3 bg-stone-100 mb-3 rounded animate-pulse"></div>
                <div className="w-1/2 h-3 bg-stone-100 mb-3 rounded animate-pulse"></div>
                <div className="w-5/6 h-3 bg-stone-100 rounded animate-pulse"></div>
                <p className="mt-8 text-elegant-gold font-serif italic tracking-wide animate-bounce">
                  Drafting your bespoke vision...
                </p>
              </div>
            )}

            {concept && !loading && (
              <div className="design-result-card bg-white shadow-xl rounded-sm border border-stone-100 overflow-hidden" style={{ opacity: 0 }}>
                {concept.imageUrl ? (
                  <div className="relative h-80 lg:h-96 w-full bg-stone-50">
                    <img 
                      src={concept.imageUrl} 
                      alt="Generated Concept" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-elegant-dark rounded shadow-sm border border-stone-100">
                      Bespoke AI
                    </div>
                  </div>
                ) : (
                   <div className="h-64 bg-stone-50 flex items-center justify-center text-stone-400 italic font-light text-sm">
                     Image generation offline
                   </div>
                )}
                
                <div className="p-8">
                  <h4 className="text-2xl font-serif text-elegant-dark mb-4 border-b border-stone-100 pb-4 italic font-medium">
                    Design Specifications
                  </h4>
                  <div className="text-gray-500 leading-relaxed text-sm font-light whitespace-pre-line prose prose-stone">
                    {concept.description}
                  </div>
                  
                  <div className="mt-10 pt-6 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                     <span className="text-xs font-mono text-stone-400">Spec Ref: EC-{Math.floor(1000 + Math.random() * 9000)}</span>
                     
                     <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                       <button
                         onClick={handleGenerate}
                         className="flex items-center gap-2 text-stone-400 hover:text-elegant-gold transition-colors font-bold uppercase text-[10px] tracking-[0.15em] cursor-pointer"
                         title="Regenerate with same description"
                       >
                         <RefreshCw size={12} className="text-stone-400" /> Regenerate
                       </button>
                       <button 
                          onClick={handleSaveToWishlist}
                          className="relative group overflow-hidden px-5 py-2.5 bg-elegant-gold hover:bg-elegant-dark text-white font-bold uppercase text-[10px] tracking-widest transition-all duration-300 cursor-pointer shadow-sm flex items-center gap-2"
                       >
                         <span>Request Commission Quote</span>
                         <ArrowRight size={12} />
                       </button>
                     </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ArmchairPlaceholder = () => (
  <svg 
    width="54" 
    height="54" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="#c5a059" 
    strokeWidth="1.2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="opacity-80"
  >
    <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
    <path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z" />
    <path d="M5 18v2" />
    <path d="M19 18v2" />
  </svg>
);