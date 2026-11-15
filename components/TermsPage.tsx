import React from 'react';

const gold = 'text-[#8c6517]';
const EMAIL = 'elegantcompanythe@gmail.com';
const PHONE_DISPLAY = '073 485 1573';
const PHONE_TEL = '0734851573';
export const TERMS_UPDATED = '15 November 2026';

type Section = { title: string; body: React.ReactNode };

const SECTIONS: Section[] = [
  {
    title: '1. About these terms',
    body: (
      <>
        <p>
          These terms apply to all quotes and work from The Elegant Company, Whitehall Close, Portland, Mitchells Plain,
          Cape Town, 7785. They cover our three services: custom furniture, kitchen installation and furniture
          restoration. When you accept a written quote or pay a deposit, you agree to these terms.
        </p>
        <p className="mt-3">
          Questions? Email <a href={`mailto:${EMAIL}`} className={gold}>{EMAIL}</a> or call{' '}
          <a href={`tel:${PHONE_TEL}`} className={gold}>{PHONE_DISPLAY}</a>.
        </p>
      </>
    ),
  },
  {
    title: '2. Site visits and quotes',
    body: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>
          A site visit costs R550 (R700 in Stellenbosch and Paarl). If you go ahead with the work, this fee is deducted
          from your final price.
        </li>
        <li>After the visit we send a written quote, usually within 3 to 5 days.</li>
        <li>A written quote is valid for 30 days. After that, material prices may have changed and we may need to requote.</li>
        <li>
          For restoration, you can choose a quote from WhatsApp photos or a site visit. The price depends on the condition
          of the piece, so photos give an estimate and the final price is confirmed once we have seen it in person.
        </li>
        <li>We quote what is in the quote. Extra work or changes you ask for later are priced separately and agreed with you first.</li>
      </ul>
    ),
  },
  {
    title: '3. Deposit and payment',
    body: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>We take a 60% deposit before we start. This applies to kitchens, custom furniture and restoration.</li>
        <li>
          The balance is due when the work is complete. For kitchens, that is once the installation is finished.
        </li>
        <li>We accept EFT, cash and card.</li>
      </ul>
    ),
  },
  {
    title: '4. Cancellations',
    body: (
      <>
        <p>
          If you cancel before we have ordered materials, we will refund your deposit. Once materials have been ordered
          for your job, the deposit is not refundable, because those materials are bought specifically for you and
          cannot be returned.
        </p>
        <p className="mt-3">
          Nothing in this section limits any right you have under the Consumer Protection Act.
        </p>
      </>
    ),
  },
  {
    title: '5. Timelines',
    body: (
      <>
        <p>The times below are our usual estimates, not guaranteed dates:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>Custom furniture: normally 2 to 4 weeks to make a piece.</li>
          <li>Restoration: about 2 weeks.</li>
          <li>Kitchens: about a week of workshop assembly, then 1 to 3 days of installation depending on the size of the kitchen.</li>
        </ul>
        <p className="mt-3">
          Delays can happen, for example when a supplier is late or a piece needs more work than expected. We will tell you
          as soon as we know.
        </p>
      </>
    ),
  },
  {
    title: '6. Kitchen installations',
    body: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>
          We supply the cabinets, assemble them in our workshop and install them at your home. You choose each element
          yourself (board, handles, drawer runners, hinges and so on), usually together with us at the supplier.
        </li>
        <li>
          We do not do granite or marble countertops, plumbing, electrical work or appliance fitting. You arrange your
          own plumber and electrician. We install normal wooden countertops.
        </li>
        <li>
          You can remove your old kitchen yourself, or we can arrange removal for R1,200. Removal is done by an outside
          driver, not by our own team. Either way, the old kitchen must be emptied of plates and contents before we arrive.
        </li>
        <li>Someone must be home while we install. We clean up and take away the packaging, and we will ask if you want the offcuts.</li>
      </ul>
    ),
  },
  {
    title: '7. Custom furniture',
    body: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Each piece is made to order in our own workshop, from the timber and finish you choose with us.</li>
        <li>
          Timber is a natural material. Grain, knots and colour vary from board to board, so your piece will not look
          identical to a photo or sample. That variation is part of solid wood.
        </li>
        <li>Finishes are water-based wood stain with a protective final coat in matt, satin or gloss, as agreed with you.</li>
        <li>Prices follow timber prices, which change often. That is why quotes are time-limited (see section 2).</li>
      </ul>
    ),
  },
  {
    title: '8. Furniture restoration',
    body: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Pickup and delivery back to you costs R600, added on top of the quote.</li>
        <li>
          Old furniture can hide problems that only show once the old finish is stripped, such as weak joints, previous
          repairs or damage under the varnish. If we find something that changes the work or the price, we will tell you
          before going further.
        </li>
        <li>We cannot be responsible for damage or defects that were already in the piece when we collected it.</li>
        <li>Please tell us if a piece is an antique or has special value to you, so we can discuss the safest approach first.</li>
        <li>Stain takes differently on old timber, so the final colour may differ slightly from a sample.</li>
      </ul>
    ),
  },
  {
    title: '9. Our 3-month workmanship promise',
    body: (
      <>
        <p>
          For custom furniture and restoration, if something fails because of how we made or finished it, for example a
          joint coming apart or the finish peeling, we will fix it free of charge for 3 months after you receive the piece.
        </p>
        <p className="mt-3">
          The promise does not cover water damage, heavy knocks, misuse or normal wear and tear. Kitchen installations do
          not carry this promise. It does not replace or limit your rights under the Consumer Protection Act.
        </p>
      </>
    ),
  },
  {
    title: '10. Your part',
    body: (
      <p>
        Please give us accurate information about your project and your space, make sure we can reach the place where the
        work is happening, and tell us early about anything that could affect the job. We cannot be responsible for
        problems caused by incorrect information.
      </p>
    ),
  },
  {
    title: '11. Limits of our responsibility',
    body: (
      <p>
        To the extent the law allows, our responsibility for a job is limited to the amount you paid us for that job. We
        are not responsible for indirect losses. Nothing here limits responsibility that the law does not allow us to
        limit.
      </p>
    ),
  },
  {
    title: '12. Privacy',
    body: (
      <p>
        How we handle your personal information is explained in our <a href="/privacy-policy/" className={gold}>Privacy Policy</a>.
      </p>
    ),
  },
  {
    title: '13. Law and disputes',
    body: (
      <p>
        These terms are governed by the laws of South Africa. If you are unhappy with anything, please talk to us first.
        We would rather fix it than argue about it.
      </p>
    ),
  },
  {
    title: '14. Changes to these terms',
    body: (
      <p>
        We may update these terms from time to time. The date at the top shows the latest version. The terms that applied
        when you accepted your quote are the ones that apply to your job.
      </p>
    ),
  },
];

export const TermsPage: React.FC = () => (
  <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans">
    <header className="bg-stone-950 px-5 py-5 sm:px-8">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <a href="/" className="font-serif text-lg uppercase tracking-[0.22em] text-[#f8f7f5] sm:text-xl">
          The Elegant Company
        </a>
        <a href="/" className="text-xs uppercase tracking-[0.18em] text-[#c5a059]">
          Home
        </a>
      </div>
    </header>

    <section className="bg-stone-950 px-5 pb-12 pt-6 sm:px-8 sm:pb-16">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#c5a059]">Mitchells Plain · Cape Town</p>
        <h1 className="font-serif text-4xl leading-tight text-white sm:text-5xl">Terms and Conditions</h1>
        <p className="mt-4 text-sm font-light text-stone-400">Last updated {TERMS_UPDATED}</p>
      </div>
    </section>

    <main className="px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-base font-light leading-relaxed text-stone-700">
          Clear terms protect both of us. This page explains, in plain language, how quotes, payment, timelines and our
          workmanship promise work at The Elegant Company.
        </p>
        <div className="mt-10 space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="font-serif text-2xl text-stone-900">{s.title}</h2>
              <div className="mt-3 text-[15px] font-light leading-relaxed text-stone-700">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </main>

    <footer className="bg-stone-950 px-5 py-10 text-sm text-stone-400 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p>
          The Elegant Company · Whitehall Close, Portland, Mitchells Plain, Cape Town
          <br />
          <a href={`tel:${PHONE_TEL}`} className="text-stone-300">{PHONE_DISPLAY}</a>
          {' · '}
          <a href="/" className="text-stone-300">Home</a>
          {' · '}
          <a href="/privacy-policy/" className="text-stone-300">Privacy Policy</a>
        </p>
      </div>
    </footer>
  </div>
);
