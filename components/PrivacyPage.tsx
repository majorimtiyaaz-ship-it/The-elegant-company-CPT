import React from 'react';

const gold = 'text-[#8c6517]';
const EMAIL = 'elegantcompanythe@gmail.com';
const PHONE_DISPLAY = '073 485 1573';
const PHONE_TEL = '0734851573';
export const PRIVACY_UPDATED = '15 November 2026';

type Section = { title: string; body: React.ReactNode };

const SECTIONS: Section[] = [
  {
    title: '1. Who we are',
    body: (
      <>
        <p>
          The Elegant Company is a bespoke furniture, kitchen installation and furniture restoration business in Cape Town.
          We are the “responsible party” under the Protection of Personal Information Act 4 of 2013 (POPIA), which means we
          decide why and how your personal information is used.
        </p>
        <p className="mt-3">
          Whitehall Close, Portland, Mitchells Plain, Cape Town, 7785, Western Cape, South Africa.
          <br />
          Email: <a href={`mailto:${EMAIL}`} className={gold}>{EMAIL}</a>
          <br />
          Phone and WhatsApp: <a href={`tel:${PHONE_TEL}`} className={gold}>{PHONE_DISPLAY}</a>
        </p>
        <p className="mt-3">Our Information Officer is the owner, Imtiyaaz Jacobs. Use the contact details above.</p>
      </>
    ),
  },
  {
    title: '2. What information we collect',
    body: (
      <>
        <p>When you send us a quote request through the website form, we collect:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>your name and your phone or WhatsApp number;</li>
          <li>your email address (optional);</li>
          <li>the service you want and your suburb or area;</li>
          <li>project details you choose to share, such as dimensions, finish and notes;</li>
          <li>a record that you agreed to us using your details to respond to you.</li>
        </ul>
        <p className="mt-3">
          If you contact us by WhatsApp, phone or email instead, we keep the messages and details you send us.
        </p>
        <p className="mt-3">
          We also record how you found us, so we know which channels bring enquiries. This is limited to campaign tags in the
          link you clicked, the name of the website that referred you, and whether a Google or Meta ad click was present
          (not the click ID itself). It is kept in your browser and attached to your enquiry only if you send one.
        </p>
        <p className="mt-3">
          To block spam, our server turns your IP address into a scrambled code (a salted hash) and uses it to limit how
          many forms can be sent in a short time. We do not store your IP address in readable form.
        </p>
        <p className="mt-3">Please do not send us ID numbers, banking details or card numbers. We never need them to give you a quote.</p>
      </>
    ),
  },
  {
    title: '3. Why we use your information',
    body: (
      <>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>to reply to your enquiry and arrange a site visit or quote;</li>
          <li>to design, make, restore or install your project and keep our business and tax records;</li>
          <li>to protect the website and our forms from spam and abuse;</li>
          <li>to understand which channels bring enquiries, so we can run the business better.</li>
        </ul>
        <p className="mt-3">
          We rely on your consent (the tick box on our form), on what is needed to respond to you and carry out a project
          for you, and on our legitimate interest in running and protecting the business. We do not sell your information
          and we do not use it for marketing messages unless you ask for them.
        </p>
      </>
    ),
  },
  {
    title: '4. Who we share it with',
    body: (
      <>
        <p>We use trusted service providers to run the website and our records. They handle your information only to provide their service to us:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li><strong>Vercel</strong> hosts this website.</li>
          <li><strong>Neon</strong> hosts the database where we keep our enquiries.</li>
          <li><strong>Formspree</strong> emails us a copy of each form submission.</li>
          <li><strong>Google</strong> provides our email (Gmail) and the fonts used on this site. Loading fonts means your browser contacts Google servers, which can see your IP address.</li>
          <li><strong>WhatsApp (Meta)</strong> carries any WhatsApp chat you start with us.</li>
        </ul>
        <p className="mt-3">
          Some of these providers store or process information outside South Africa. By using the form you accept this,
          and we choose providers that protect data with security and contractual commitments. We may also share
          information if the law requires it.
        </p>
      </>
    ),
  },
  {
    title: '5. Cookies and tracking',
    body: (
      <p>
        We do not use advertising or analytics cookies. The only thing saved in your browser is the “how you found us” note
        described in section 2. If we add analytics or advertising tools later, we will update this page and ask for your
        consent where the law requires it.
      </p>
    ),
  },
  {
    title: '6. How long we keep it',
    body: (
      <p>
        We keep your information only as long as we need it for the purposes above, for example while we deal with your
        enquiry and project, and afterwards for business, warranty and tax records. We then delete or anonymise it. If you
        ask us to delete your details sooner, we will do so unless the law requires us to keep them.
      </p>
    ),
  },
  {
    title: '7. How we protect it',
    body: (
      <p>
        The website uses an encrypted (HTTPS) connection. Our enquiry records sit in a private system that only
        authorised people can open, and the form includes spam and abuse controls. No online system is perfectly secure,
        but we take reasonable steps to keep your information safe. If we ever suffer a breach that puts your information
        at risk, we will tell you and the Information Regulator as the law requires.
      </p>
    ),
  },
  {
    title: '8. Your rights',
    body: (
      <>
        <p>Under POPIA you may ask us to:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>tell you what information we hold about you and give you a copy;</li>
          <li>correct information that is wrong or out of date;</li>
          <li>delete your information or stop using it;</li>
          <li>withdraw your consent at any time (this does not affect what we did before you withdrew).</li>
        </ul>
        <p className="mt-3">
          Email or call us using the details in section 1. We may need to confirm your identity first. If you are unhappy with how we
          handle your information, please talk to us first. You also have the right to complain to the Information
          Regulator (South Africa): <a href="https://inforegulator.org.za" className={gold} rel="noopener">inforegulator.org.za</a>,
          {' '}<a href="mailto:POPIAComplaints@inforegulator.org.za" className={gold}>POPIAComplaints@inforegulator.org.za</a>.
        </p>
      </>
    ),
  },
  {
    title: '9. Children',
    body: <p>Our services and this website are meant for adults. We do not knowingly collect information from anyone under 18.</p>,
  },
  {
    title: '10. Changes to this policy',
    body: (
      <p>
        We may update this policy when our practices change. The date at the top shows when it was last revised. The version
        on this page is the current one.
      </p>
    ),
  },
];

export const PrivacyPage: React.FC = () => (
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
        <h1 className="font-serif text-4xl leading-tight text-white sm:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-sm font-light text-stone-400">Last updated {PRIVACY_UPDATED}</p>
      </div>
    </section>

    <main className="px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-base font-light leading-relaxed text-stone-700">
          This policy explains, in plain language, what personal information The Elegant Company collects through this
          website, why, and what your rights are under South Africa’s Protection of Personal Information Act (POPIA).
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
      <div className="mx-auto max-w-3xl space-y-3">
        <p>
          The Elegant Company · Whitehall Close, Portland, Mitchells Plain, Cape Town
          <br />
          <a href={`tel:${PHONE_TEL}`} className="text-stone-300">{PHONE_DISPLAY}</a>
          {' · '}
          <a href="/" className="text-stone-300">Home</a>
          {' · '}
          <a href="/terms-and-conditions/" className="text-stone-300">Terms</a>
        </p>
      </div>
    </footer>
  </div>
);
