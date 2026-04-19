import { useEffect, useMemo, useState } from 'react'

const BASE_SCAN_DATA = {
  updatedAt: '2026-04-19T14:15:00.000Z',
  totalScans: 1842,
  conversionRate: 14.8,
  averageScanTimeSeconds: 11,
  visibilityGap: 82,
  neighborhoods: [
    { name: 'Pinardville', scans: 482, velocity: 9, hue: 'from-cyan-400/70 to-cyan-500/20' },
    { name: 'Grasmere', scans: 366, velocity: 7, hue: 'from-blue-400/70 to-blue-500/20' },
    { name: 'Goffstown Center', scans: 291, velocity: 5, hue: 'from-emerald-400/70 to-emerald-500/20' },
    { name: 'Eliot Acres', scans: 214, velocity: 4, hue: 'from-amber-400/70 to-amber-500/20' },
    { name: 'South Merrimack', scans: 181, velocity: 3, hue: 'from-violet-400/70 to-violet-500/20' },
  ],
  recentScans: [
    { neighborhood: 'Pinardville', business: 'Roof inspection ad', minutesAgo: 2, status: 'Hot lead' },
    { neighborhood: 'Grasmere', business: 'Landscaping coupon', minutesAgo: 6, status: 'In review' },
    { neighborhood: 'Goffstown Center', business: 'Drain clearing offer', minutesAgo: 11, status: 'Qualified' },
    { neighborhood: 'Eliot Acres', business: 'Electrical safety check', minutesAgo: 18, status: 'Viewed twice' },
  ],
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value)
}

function formatPercent(value) {
  return `${value.toFixed(1)}%`
}

function formatTimestamp(value) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      month: 'short',
      day: 'numeric',
    }).format(new Date(value))
  } catch {
    return value
  }
}

function buildLiveSnapshot(tick) {
  const totalScans = BASE_SCAN_DATA.totalScans + tick * 17
  const conversionRate = Math.max(
    9.2,
    Math.min(21.4, Number((BASE_SCAN_DATA.conversionRate + Math.sin(tick / 2.5) * 0.8).toFixed(1))),
  )

  const neighborhoods = BASE_SCAN_DATA.neighborhoods.map((neighborhood, index) => ({
    ...neighborhood,
    scans: neighborhood.scans + tick * neighborhood.velocity + index * (tick % 2),
    intensity: Math.min(100, neighborhood.scans / 5 + tick * 2 + index * 4),
  }))

  const recentScans = BASE_SCAN_DATA.recentScans.map((scan, index) => ({
    ...scan,
    minutesAgo: Math.max(1, scan.minutesAgo - Math.floor(tick / (index + 3))),
  }))

  return {
    ...BASE_SCAN_DATA,
    totalScans,
    conversionRate,
    neighborhoods,
    recentScans,
    updatedAt: new Date(Date.now() + tick * 3200).toISOString(),
  }
}

export default function ClientScanDashboard({ onBackHref = '/' }) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTick((value) => value + 1)
    }, 3200)

    return () => window.clearInterval(timer)
  }, [])

  const scanData = useMemo(() => buildLiveSnapshot(tick), [tick])

  const topNeighborhood = scanData.neighborhoods[0]

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5f9ff_0%,#ffffff_54%,#eef5ff_100%)] text-ink-950">
      <header className="relative overflow-hidden border-b border-ink-100 bg-ink-950 text-white">
        <div className="absolute inset-0 bg-hero-grid bg-[length:22px_22px] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,108,237,0.38),transparent_30%),radial-gradient(circle_at_right,rgba(17,24,39,0.05),transparent_40%)]" />

        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-blue-100">
              Private Preview
            </div>
            <a
              href={onBackHref}
              className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/14"
            >
              Back to site
            </a>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.36em] text-blue-200/80">Client Scan Dashboard</p>
              <h1 className="mt-4 font-display text-4xl leading-[1.02] sm:text-5xl lg:text-6xl">
                Make the logistics blind spot visible before it turns into surprise cost.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                This dashboard shows businesses how many scans are happening, where attention is clustering, and
                how often interest turns into action.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  ['Total scans', formatNumber(scanData.totalScans)],
                  ['Conversion rate', formatPercent(scanData.conversionRate)],
                  ['Visibility gap', `${scanData.visibilityGap}%`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{label}</div>
                    <div className="mt-2 text-2xl font-bold text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-5 shadow-panel backdrop-blur-md sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Live snapshot</p>
                  <div className="mt-2 text-4xl font-semibold text-white">{formatNumber(scanData.totalScans)}</div>
                  <p className="mt-2 text-sm text-slate-300">Scans captured across the current campaign window</p>
                </div>
                <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-right">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">Updated</div>
                  <div className="mt-1 text-sm font-semibold text-white">{formatTimestamp(scanData.updatedAt)}</div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">Top neighborhood</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Highest scan density</p>
                </div>
                <div className="mt-4 rounded-2xl bg-gradient-to-r from-cyan-500/18 to-blue-500/8 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/80">
                        {topNeighborhood.name}
                      </div>
                      <div className="mt-1 text-2xl font-semibold text-white">{formatNumber(topNeighborhood.scans)}</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-right">
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Scan share</div>
                      <div className="mt-1 text-sm font-semibold text-white">
                        {formatPercent((topNeighborhood.scans / scanData.totalScans) * 100)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-300 transition-all duration-500"
                      style={{ width: `${Math.min(100, topNeighborhood.intensity)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-white/70 bg-white p-5 shadow-panel sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-600">Neighborhood heatmap</p>
                <h2 className="mt-2 font-display text-2xl text-ink-950 sm:text-3xl">
                  Pinardville vs. Grasmere, with the rest of the footprint mapped out.
                </h2>
              </div>
              <div className="rounded-full border border-ink-100 bg-ink-50 px-4 py-2 text-sm font-semibold text-ink-700">
                {formatPercent(scanData.conversionRate)} conversion
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {scanData.neighborhoods.map((neighborhood) => (
                <div
                  key={neighborhood.name}
                  className="rounded-2xl border border-ink-100 bg-gradient-to-r from-white to-ink-50 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-ink-950">{neighborhood.name}</div>
                      <div className="mt-1 text-sm text-ink-600">
                        {formatNumber(neighborhood.scans)} scans, velocity +{neighborhood.velocity}/tick
                      </div>
                    </div>
                    <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-ink-700 shadow-sm">
                      Heat {Math.round(neighborhood.intensity)}
                    </div>
                  </div>

                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-ink-100">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${neighborhood.hue} transition-all duration-500`}
                      style={{ width: `${Math.min(100, neighborhood.intensity)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/70 bg-ink-950 p-5 text-white shadow-panel sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-200/80">Why owners care</p>
              <h2 className="mt-2 font-display text-2xl leading-tight text-white sm:text-3xl">
                82 percent of teams only notice cost problems after the bill shows up.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                This view gives them a simple story: which neighborhoods are responding, which offers are converting,
                and where to shift spend before the surprise hits.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white p-5 shadow-panel sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-600">Recent scans</p>
                  <h3 className="mt-2 font-display text-2xl text-ink-950">Live activity feed</h3>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Active
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {scanData.recentScans.map((scan) => (
                  <article key={`${scan.neighborhood}-${scan.business}`} className="rounded-2xl border border-ink-100 bg-ink-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-ink-950">{scan.neighborhood}</p>
                        <p className="mt-1 text-sm text-ink-700">{scan.business}</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink-700">
                        {scan.status}
                      </span>
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-[0.24em] text-ink-500">
                      {scan.minutesAgo} min ago
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
