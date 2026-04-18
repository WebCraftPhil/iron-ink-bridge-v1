import { useEffect, useMemo, useState } from 'react'

const defaultTown = 'Goffstown'

const offers = [
  {
    id: 'landscaping',
    business: 'Granite State Landscaping',
    category: 'Seasonal yard care',
    headline: '$75 off spring cleanup',
    description:
      'Refresh your curb appeal with mowing, edging, pruning, and storm debris removal from a local crew that knows New Hampshire yards.',
    proof: 'Fast estimates and flexible weekly service windows.',
    accent: 'from-sky-700 to-ink-900',
    highlight: 'Best for first impressions',
  },
  {
    id: 'electrical',
    business: 'NH Electrical Services',
    category: 'Home safety upgrade',
    headline: 'Free safety check with any repair',
    description:
      'Take care of outlets, lighting, panels, and fixture updates before they become a bigger issue. Licensed, tidy, and easy to schedule.',
    proof: 'Perfect for older homes and quick fixes.',
    accent: 'from-blue-700 to-ink-950',
    highlight: 'Most urgent home need',
  },
  {
    id: 'roof',
    business: 'NH Roof Solutions',
    category: 'Leak prevention',
    headline: '$150 inspection credit',
    description:
      'Protect your roof before the next storm season with shingle checks, flashing repairs, and replacement guidance you can trust.',
    proof: 'Photo documentation included on every visit.',
    accent: 'from-indigo-700 to-blue-950',
    highlight: 'Highest-value repair',
  },
  {
    id: 'plumbing',
    business: 'Granite State Plumbing',
    category: 'Comfort and reliability',
    headline: 'No-service-fee drain clearing',
    description:
      'Solve slow drains, fixture leaks, and water pressure problems with a clean, local plumbing team focused on fast turnaround.',
    proof: 'Upfront pricing before work begins.',
    accent: 'from-cyan-700 to-ink-900',
    highlight: 'Quickest to redeem',
  },
  {
    id: 'pressure-washing',
    business: '603 Pressure Washing',
    category: 'Instant curb appeal',
    headline: '$50 off house wash service',
    description:
      'Lift grime from siding, walkways, decks, and driveways with a low-pressure wash that makes the whole property look renewed.',
    proof: 'Great before listings, gatherings, or summer cleanup.',
    accent: 'from-slate-700 to-blue-900',
    highlight: 'Visual wow factor',
  },
]

const mailerAssets = [
  {
    label: 'Front image',
    href: '/docs/Front.png',
    type: 'PNG',
  },
  {
    label: 'Back image',
    href: '/docs/Back.png',
    type: 'PNG',
  },
  {
    label: 'Mailer PDF',
    href: '/docs/Copy of Geoffstown Mailer.pdf',
    type: 'PDF',
  },
]

function getInitialTown() {
  if (typeof window === 'undefined') {
    return defaultTown
  }

  const params = new URLSearchParams(window.location.search)
  const town = params.get('town')?.trim()

  return town || defaultTown
}

function buildMessage(offer, town) {
  return `Hi, I saw the ${offer.business} offer on the ${town} Homeowner Savings page. Please text me the details for: ${offer.headline}`
}

function App() {
  const [town, setTown] = useState(getInitialTown)
  const [activeOffer, setActiveOffer] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  })

  useEffect(() => {
    document.title = `${town} Homeowner Savings`
  }, [town])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveOffer(null)
        setSubmitted(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const heroMessage = useMemo(
    () => `A local savings page made for ${town} homeowners`,
    [town],
  )

  const smsText = (offer) =>
    `sms:?&body=${encodeURIComponent(buildMessage(offer, town))}`

  const openLeadModal = (offer) => {
    setSubmitted(false)
    setActiveOffer(offer)
  }

  const handleLeadSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5f9ff_0%,#ffffff_55%,#edf5ff_100%)] text-ink-950">
      <header className="relative overflow-hidden border-b border-ink-100 bg-ink-950 text-white">
        <div className="absolute inset-0 bg-hero-grid bg-[length:22px_22px] opacity-20" />
        <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
            Goffstown Mailer QR Landing Page
          </div>

          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-200">{heroMessage}</p>
            <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {town} homeowners, unlock five local savings offers in one place.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              Scan the QR code on your mailer, review the offers below, and claim the one that matches the work you want to get done first.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['5', 'local service offers'],
              ['1', 'fast lead-capture flow'],
              ['<1s', 'lightweight mobile-first build target'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur">
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="mt-1 text-sm text-blue-100">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-600">Available offers</p>
              <h2 className="mt-2 font-display text-2xl text-ink-950 sm:text-3xl">Choose the service that matters most right now.</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {offers.map((offer) => (
              <article
                key={offer.id}
                className="group overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-panel transition-transform duration-300 hover:-translate-y-1"
              >
                <div className={`h-2 bg-gradient-to-r ${offer.accent}`} />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-500">{offer.category}</p>
                      <h3 className="mt-2 text-xl font-bold text-ink-950">{offer.business}</h3>
                    </div>
                    <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-700">
                      {offer.highlight}
                    </span>
                  </div>

                  <p className="mt-4 text-lg font-semibold text-ink-900">{offer.headline}</p>
                  <p className="mt-2 text-sm leading-6 text-ink-700">{offer.description}</p>

                  <div className="mt-4 rounded-2xl bg-ink-50 p-4 text-sm text-ink-700">
                    {offer.proof}
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => openLeadModal(offer)}
                      className="inline-flex items-center justify-center rounded-full bg-ink-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink-800"
                    >
                      Claim Offer
                    </button>
                    <a
                      href={smsText(offer)}
                      className="inline-flex items-center justify-center rounded-full border border-ink-200 px-4 py-3 text-sm font-semibold text-ink-900 transition hover:border-ink-300 hover:bg-ink-50"
                    >
                      Text Me This Offer
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-4 rounded-3xl border border-ink-100 bg-white p-5 shadow-panel sm:p-6 lg:grid-cols-3">
          {[
            ['1', 'Tap or scan the QR code.'],
            ['2', 'Pick the service and open the offer modal.'],
            ['3', 'Submit your contact info or text the offer instantly.'],
          ].map(([step, copy]) => (
            <div key={step} className="rounded-2xl bg-gradient-to-br from-ink-50 to-white p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-500">Step {step}</div>
              <p className="mt-2 text-sm leading-6 text-ink-800">{copy}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-ink-100 bg-white p-5 shadow-panel sm:p-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-600">Mailer assets</p>
            <h2 className="mt-2 font-display text-2xl text-ink-950 sm:text-3xl">Front, back, and PDF assets are ready in the docs folder.</h2>
            <p className="mt-3 text-sm leading-6 text-ink-700">
              These files can be linked from the live campaign, shared with print vendors, or used as quick previews for stakeholders.
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {mailerAssets.map((asset) => (
              <a
                key={asset.label}
                href={asset.href}
                className="rounded-2xl border border-ink-200 bg-ink-50 p-4 transition hover:border-ink-300 hover:bg-white"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-500">{asset.type}</div>
                <div className="mt-2 text-lg font-semibold text-ink-950">{asset.label}</div>
                <div className="mt-2 text-sm text-ink-700">Open the asset in the browser or download it for production review.</div>
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-ink-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-ink-600 sm:px-6 lg:px-8">
          Designed for local mailer tracking, simple lead capture, and fast mobile conversion.
        </div>
      </footer>

      {activeOffer ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/70 px-4 py-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-panel">
            <div className={`h-2 bg-gradient-to-r ${activeOffer.accent}`} />
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-500">Claim offer</p>
                  <h2 className="mt-2 font-display text-2xl text-ink-950">{activeOffer.business}</h2>
                  <p className="mt-2 text-sm text-ink-700">{activeOffer.headline}</p>
                </div>
                <button
                  type="button"
                  aria-label="Close modal"
                  onClick={() => setActiveOffer(null)}
                  className="rounded-full border border-ink-200 px-3 py-1 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
                >
                  Close
                </button>
              </div>

              {submitted ? (
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                  Thanks. Your request has been captured for {activeOffer.business}. This sample can be wired to your CRM or text provider next.
                </div>
              ) : (
                <form className="mt-6 grid gap-4" onSubmit={handleLeadSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-medium text-ink-800">
                      Full Name
                      <input
                        required
                        value={form.name}
                        onChange={(event) => setForm({ ...form, name: event.target.value })}
                        className="rounded-2xl border border-ink-200 px-4 py-3 outline-none transition focus:border-ink-500"
                        placeholder="Jane Homeowner"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-ink-800">
                      Phone Number
                      <input
                        required
                        value={form.phone}
                        onChange={(event) => setForm({ ...form, phone: event.target.value })}
                        className="rounded-2xl border border-ink-200 px-4 py-3 outline-none transition focus:border-ink-500"
                        placeholder="(603) 555-0123"
                      />
                    </label>
                  </div>

                  <label className="grid gap-2 text-sm font-medium text-ink-800">
                    Street Address
                    <input
                      required
                      value={form.address}
                      onChange={(event) => setForm({ ...form, address: event.target.value })}
                      className="rounded-2xl border border-ink-200 px-4 py-3 outline-none transition focus:border-ink-500"
                      placeholder="123 Main Street"
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-medium text-ink-800">
                    Email Address
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      className="rounded-2xl border border-ink-200 px-4 py-3 outline-none transition focus:border-ink-500"
                      placeholder="you@example.com"
                    />
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-full bg-ink-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-800"
                    >
                      Submit Offer Request
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveOffer(null)}
                      className="inline-flex items-center justify-center rounded-full border border-ink-200 px-5 py-3 text-sm font-semibold text-ink-800 transition hover:bg-ink-50"
                    >
                      Not Now
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App