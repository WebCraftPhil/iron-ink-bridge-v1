import { useEffect, useMemo, useRef, useState } from 'react'
import AdminAuthGate from './components/AdminAuthGate'
import FAQ from './components/FAQ'
import MaintenanceCalculator from './components/MaintenanceCalculator'
import ClientScanDashboard from './components/ClientScanDashboard'

const defaultTown = 'Goffstown'
const campaignPhone = '16036986286'
const campaignDial = '+16036986286'
const adminPath = '/admin'

const offers = [
  {
    id: 'landscaping',
    vendor: 'GraniteStateLandscaping',
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
    vendor: 'NHElectrical',
    vendorSlug: 'nh-electrical',
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
    vendor: 'NHRoofSolutions',
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
    vendor: 'GraniteStatePlumbing',
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
    vendor: '603PressureWashing',
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
  { label: 'Front image', href: '/docs/Front.png', type: 'PNG' },
  { label: 'Back image', href: '/docs/Back.png', type: 'PNG' },
  { label: 'Mailer PDF', href: '/docs/Copy of Geoffstown Mailer.pdf', type: 'PDF' },
]

const heroStats = [
  ['5', 'local service offers'],
  ['1', 'fast lead-capture flow'],
  ['<1s', 'lightweight mobile-first build target'],
]

const verifiedBadges = ['Licensed', 'Insured', 'Local']

const serviceSteps = [
  ['1', 'Tap or scan the QR code.'],
  ['2', 'Pick the service and open the offer modal.'],
  ['3', 'Submit your contact info or text the offer instantly.'],
]

function parseUrlParams(search = '') {
  const params = new URLSearchParams(search)

  return {
    vendor: params.get('vendor')?.trim() ?? '',
    id: params.get('id')?.trim() ?? '',
    town: params.get('town')?.trim() ?? '',
    ref: params.get('ref')?.trim() ?? '',
  }
}

function useSearchParams() {
  const [search, setSearch] = useState(() => {
    if (typeof window === 'undefined') {
      return ''
    }

    return window.location.search
  })

  useEffect(() => {
    const handlePopState = () => {
      setSearch(window.location.search)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return useMemo(() => new URLSearchParams(search), [search])
}

function getWindowLocation() {
  if (typeof window === 'undefined') {
    return { pathname: '/', search: '' }
  }

  return {
    pathname: window.location.pathname,
    search: window.location.search,
  }
}

function getInitialTown() {
  if (typeof window === 'undefined') {
    return defaultTown
  }

  const { town } = parseUrlParams(window.location.search)
  return town || defaultTown
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function buildMessage(offer, town) {
  return `Hi, I saw the ${offer.business} offer on the ${town} Homeowner Savings page. Please text me the details for: ${offer.headline}`
}

function getOfferMatch(offer, params) {
  const normalizedVendor = params.vendor.toLowerCase()
  const vendorMatch =
    normalizedVendor === offer.vendor.toLowerCase() ||
    normalizedVendor === (offer.vendorSlug ?? '').toLowerCase()
  const idMatch = params.id.toLowerCase() === offer.id.toLowerCase()
  return vendorMatch || idMatch
}

function App() {
  const [location, setLocation] = useState(getWindowLocation)
  const [town, setTown] = useState(getInitialTown)
  const [activeOffer, setActiveOffer] = useState(null)
  const [leadContext, setLeadContext] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const offerRefs = useRef({})
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  })

  const searchParams = useSearchParams()
  const params = useMemo(() => parseUrlParams(`?${searchParams.toString()}`), [searchParams])
  const isAdminView = location.pathname === adminPath
  const isInformedDeliveryRef = params.ref.toLowerCase() === 'informed-delivery'

  useEffect(() => {
    const handlePopState = () => {
      setLocation(getWindowLocation())
      setTown(getInitialTown())
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    document.title = isAdminView ? 'Client Scan Dashboard | Private Preview' : `${town} Homeowner Savings`
  }, [isAdminView, town])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveOffer(null)
        setLeadContext(null)
        setSubmitted(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const heroMessage = useMemo(() => `A local savings page made for ${town} homeowners`, [town])
  const highlightedOffer = offers.find((offer) => getOfferMatch(offer, params)) ?? null

  useEffect(() => {
    if (!highlightedOffer) {
      return
    }

    const target = offerRefs.current[highlightedOffer.id]

    if (!target) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [highlightedOffer?.id])

  const smsText = (offer) => `sms:?&body=${encodeURIComponent(buildMessage(offer, town))}`

  const openLeadModal = (offer) => {
    setSubmitted(false)
    setLeadContext(null)
    setForm({
      name: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
    })
    setActiveOffer(offer)
  }

  const openMaintenanceLead = ({ homeValue, homeAge, climate, priority, estimate }) => {
    setSubmitted(false)
    setLeadContext({
      type: 'maintenance',
      homeValue,
      homeAge,
      climate,
      priority,
      estimate,
    })
    setForm({
      name: '',
      phone: '',
      email: '',
      address: '',
      notes: `Maintenance plan request for a ${formatCurrency(homeValue)} home, ${homeAge} years old. Climate: ${climate}. Style: ${priority}. Estimated annual reserve: ${formatCurrency(estimate.annual)}.`,
    })
    setActiveOffer({
      id: 'maintenance-plan',
      vendor: 'MaintenancePlanner',
      business: 'Maintenance Plan Review',
      category: 'Budget planning',
      headline: `Review a ${formatCurrency(estimate.annual)} annual reserve`,
      description:
        'Turn this estimate into a seasonal maintenance plan, a service schedule, or a quote for the work you want to prioritize next.',
      proof: `About ${formatCurrency(estimate.monthly)} per month keeps the reserve on track.`,
      accent: 'from-cyan-700 to-blue-900',
      highlight: 'Estimate to action',
    })
  }

  const handleLeadSubmit = (event) => {
    event.preventDefault()

    if (!activeOffer) {
      return
    }
    setSubmitted(true)
  }

  const navLink = isAdminView ? '/' : adminPath

  if (isAdminView) {
    return (
      <AdminAuthGate>
        <ClientScanDashboard onBackHref={navLink} />
      </AdminAuthGate>
    )
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      {isInformedDeliveryRef ? (
        <div className="border-b border-emerald-400/20 bg-emerald-500/15 text-emerald-50">
          <div className="mx-auto w-full max-w-6xl px-4 py-3 text-sm font-semibold sm:px-6 lg:px-8">
            Welcome Informed Delivery User! Your 1% Bonus Discount has been applied.
          </div>
        </div>
      ) : null}

      <header className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,#17223a_0%,#070b14_42%,#060910_100%)]">
        <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-14">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-200">
              <span
                aria-hidden="true"
                className="grid h-8 w-8 place-items-center rounded-md border border-white/15 bg-white p-1 shadow-[0_10px_24px_-18px_rgba(255,255,255,0.9)]"
              >
                <img
                  src="/iron-ink-logo.png"
                  alt=""
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="hidden sm:inline">Exclusive {town} Homeowner Savings</span>
              <span className="sm:hidden">Exclusive {town}</span>
            </div>
            <a
              href="https://www.ironandinkdigital.com/"
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 transition hover:border-cyan-300/40 hover:bg-white/10 hover:text-cyan-100"
            >
              Iron &amp; Ink Digital
            </a>
          </div>

          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.36em] text-blue-200/80">{heroMessage}</p>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                {town} homeowners, unlock five local savings offers in one place.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Scan the QR code on your mailer, review the offers below, and claim the one that matches the work you want to get done first.
              </p>
              {params.vendor || params.id ? (
                <div className="mt-6 inline-flex flex-wrap gap-2 rounded-xl border border-blue-300/25 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
                  <span className="font-semibold text-white">QR context:</span>
                  <span>vendor={params.vendor || 'n/a'}</span>
                  <span>id={params.id || 'n/a'}</span>
                </div>
              ) : null}

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <a
                  href="#offers"
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:from-blue-400 hover:to-blue-200"
                >
                  Explore Services →
                </a>
                <a
                  href="#mailer-assets"
                  className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-black/25 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-black/45"
                >
                  View Directory
                </a>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {heroStats.map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="mt-1 text-sm text-slate-300">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section className="mb-10">
          <div className="mb-4 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Planning tool</p>
            <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">
              Estimate what it costs to stay ahead of home maintenance.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Use this as a quick budget check before a seasonal project, repair backlog, or annual tune-up.
            </p>
          </div>
          <MaintenanceCalculator onRequestQuote={openMaintenanceLead} />
        </section>

        <section id="offers" className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Core disciplines</p>
            <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">Choose the service that matters most right now.</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {offers.map((offer) => {
              const isSelected = highlightedOffer?.id === offer.id
              const isVerifiedQr = isSelected && params.vendor.toLowerCase() === 'nh-electrical'

              return (
                <article
                  key={offer.id}
                  aria-label={`${offer.business} offer${isSelected ? ', selected' : ''}`}
                  ref={(node) => {
                    if (node) {
                      offerRefs.current[offer.id] = node
                      return
                    }

                    delete offerRefs.current[offer.id]
                  }}
                  className={`rounded-2xl border bg-white/[0.03] p-5 shadow-2xl transition-transform duration-300 hover:-translate-y-1 sm:p-6 ${
                    isSelected
                      ? 'border-cyan-300/80 ring-2 ring-cyan-300/60 shadow-[0_0_0_1px_rgba(34,211,238,0.18),0_0_36px_rgba(34,211,238,0.22)]'
                      : 'border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      aria-hidden="true"
                      className="grid h-9 w-9 place-items-center rounded-md bg-white/10 text-sm text-blue-200"
                    >
                      ⚡
                    </span>
                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <span className="rounded-full border border-cyan-300/60 bg-cyan-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
                          {isVerifiedQr ? 'Verified QR Scan' : 'Selected'}
                        </span>
                      ) : null}
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">{offer.highlight}</span>
                    </div>
                  </div>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">{offer.category}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{offer.business}</h3>
                  <p className="mt-4 text-lg font-semibold text-blue-200">{offer.headline}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{offer.description}</p>
                  <p className="mt-4 rounded-lg bg-black/35 px-3 py-3 text-sm text-slate-200">{offer.proof}</p>

                  <div className="mt-5 grid gap-3">
                    <button
                      type="button"
                      onClick={() => openLeadModal(offer)}
                      className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:from-blue-400 hover:to-blue-200"
                    >
                      Claim Offer <span aria-hidden="true">&nbsp;⚡</span>
                    </button>
                    <a
                      href={smsText(offer)}
                      className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                    >
                      Text Me This Offer
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <h3 className="text-3xl font-display font-semibold text-white">Verified Local Licensed Professionals</h3>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            Every partner is vetted for architectural compliance and local standing.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {verifiedBadges.map((label) => (
              <div key={label} className="rounded-lg border border-white/10 bg-black/30 p-3 text-center">
                <div aria-hidden="true" className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-white/10 text-sm text-blue-200">
                  ✓
                </div>
                <div className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 lg:grid-cols-3">
          {serviceSteps.map(([step, copy]) => (
            <div key={step} className="rounded-lg border border-white/10 bg-black/30 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Step {step}</div>
              <p className="mt-2 text-sm leading-7 text-slate-200">{copy}</p>
            </div>
          ))}
        </section>

        <section id="mailer-assets" className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Mailer assets</p>
            <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">Front, back, and PDF assets are ready in the docs folder.</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              These files can be linked from the live campaign, shared with print vendors, or used as quick previews for stakeholders.
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {mailerAssets.map((asset) => (
              <a
                key={asset.label}
                href={asset.href}
                className="rounded-xl border border-white/10 bg-black/30 p-4 transition hover:bg-black/45"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">{asset.type}</div>
                <div className="mt-2 text-lg font-semibold text-white">{asset.label}</div>
                <div className="mt-2 text-sm text-slate-300">Open the asset in the browser or download it for production review.</div>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <FAQ />
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black/30">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-300 sm:px-6 lg:px-8">
          <p>Designed for local mailer tracking, simple lead capture, and fast mobile conversion.</p>
          <p className="mt-2 text-slate-400">
            Built by{' '}
            <a
              href="https://www.ironandinkdigital.com/"
              target="_blank"
              rel="noreferrer noopener"
              className="font-semibold text-cyan-200 transition hover:text-cyan-100"
            >
              Iron &amp; Ink Digital
            </a>
            .
          </p>
        </div>
      </footer>

      <a
        href={`tel:${campaignDial}`}
        className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-4 text-sm font-semibold text-white shadow-2xl transition hover:bg-ink-800 sm:hidden"
        aria-label={`Call now at ${campaignPhone}`}
      >
        Call Now
      </a>

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
                  onClick={() => {
                    setActiveOffer(null)
                    setLeadContext(null)
                  }}
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
                  {leadContext?.type === 'maintenance' ? (
                    <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-950">
                      <p className="font-semibold">Maintenance estimate summary</p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <div>
                          <span className="font-semibold">Annual reserve:</span> {formatCurrency(leadContext.estimate.annual)}
                        </div>
                        <div>
                          <span className="font-semibold">Monthly target:</span> {formatCurrency(leadContext.estimate.monthly)}
                        </div>
                        <div>
                          <span className="font-semibold">Climate:</span> {leadContext.climate}
                        </div>
                        <div>
                          <span className="font-semibold">Priority:</span> {leadContext.priority}
                        </div>
                      </div>
                    </div>
                  ) : null}

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

                  <label className="grid gap-2 text-sm font-medium text-ink-800">
                    Notes
                    <textarea
                      rows="4"
                      value={form.notes}
                      onChange={(event) => setForm({ ...form, notes: event.target.value })}
                      className="rounded-2xl border border-ink-200 px-4 py-3 outline-none transition focus:border-ink-500"
                      placeholder="Tell us what work you want to tackle first."
                    />
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-full bg-ink-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-800"
                    >
                      {leadContext?.type === 'maintenance' ? 'Request My Maintenance Plan' : 'Submit Offer Request'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveOffer(null)
                        setLeadContext(null)
                      }}
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
export { parseUrlParams }
