import { useMemo, useState } from 'react'

const climateOptions = [
  { value: 'mild', label: 'Mild', multiplier: 1 },
  { value: 'mixed', label: 'Mixed seasons', multiplier: 1.12 },
  { value: 'harsh', label: 'Harsh winter', multiplier: 1.24 },
]

const priorityOptions = [
  { value: 'preventive', label: 'Preventive care', multiplier: 0.92 },
  { value: 'balanced', label: 'Balanced', multiplier: 1 },
  { value: 'catchup', label: 'Catch-up mode', multiplier: 1.18 },
]

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export default function MaintenanceCalculator({
  initialHomeValue = 350000,
  initialHomeAge = 18,
}) {
  const [homeValue, setHomeValue] = useState(initialHomeValue)
  const [homeAge, setHomeAge] = useState(initialHomeAge)
  const [climate, setClimate] = useState('mixed')
  const [priority, setPriority] = useState('balanced')

  const resetCalculator = () => {
    setHomeValue(initialHomeValue)
    setHomeAge(initialHomeAge)
    setClimate('mixed')
    setPriority('balanced')
  }

  const currentClimate = climateOptions.find((option) => option.value === climate) ?? climateOptions[1]
  const currentPriority = priorityOptions.find((option) => option.value === priority) ?? priorityOptions[1]

  const estimate = useMemo(() => {
    const ageMultiplier =
      homeAge < 10 ? 0.92 : homeAge < 25 ? 1.12 : homeAge < 40 ? 1.28 : 1.42
    const valueBase = homeValue * 0.01
    const annual = Math.max(
      1200,
      Math.round(valueBase * ageMultiplier * currentClimate.multiplier * currentPriority.multiplier),
    )

    return {
      annual,
      monthly: Math.round(annual / 12),
      emergency: Math.round(annual * 0.28),
      exterior: Math.round(annual * 0.34),
      systems: Math.round(annual * 0.28),
      interiors: Math.round(annual * 0.18),
    }
  }, [climate, currentClimate.multiplier, currentPriority.multiplier, homeAge, homeValue, priority])

  const ageLabel =
    homeAge < 10 ? 'Newer home' : homeAge < 25 ? 'Established home' : homeAge < 40 ? 'Older home' : 'High-maintenance home'

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-[0_30px_80px_-40px_rgba(11,18,32,0.85)] backdrop-blur-xl backdrop-saturate-150 sm:p-6 lg:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.22),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.18),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_55%)]" />
      <div className="absolute inset-px rounded-[2rem] border border-white/10" />

      <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
              Maintenance calculator
            </div>
            <button
              type="button"
              onClick={resetCalculator}
              className="rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:border-white/25 hover:bg-white/12"
            >
              Reset
            </button>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-200/80">Glassmorphism estimator</p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-white sm:text-4xl">
              Estimate a realistic annual maintenance budget before the small fixes become expensive.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              This uses a simple homeowner rule of thumb and adjusts for age, climate, and whether you are in
              preventive mode or playing catch-up.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Home value</span>
              <input
                type="range"
                min="150000"
                max="950000"
                step="5000"
                value={homeValue}
                onChange={(event) => setHomeValue(clampNumber(Number(event.target.value), 150000, 950000))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-cyan-300"
              />
              <div className="flex items-center justify-between text-sm text-slate-200">
                <span>{formatCurrency(homeValue)}</span>
                <span className="text-slate-400">Base estimate driver</span>
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Home age</span>
              <input
                type="range"
                min="0"
                max="60"
                step="1"
                value={homeAge}
                onChange={(event) => setHomeAge(clampNumber(Number(event.target.value), 0, 60))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-blue-300"
              />
              <div className="flex items-center justify-between text-sm text-slate-200">
                <span>{homeAge} years</span>
                <span className="text-slate-400">{ageLabel}</span>
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Climate</span>
              <select
                value={climate}
                onChange={(event) => setClimate(event.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-slate-950/35 px-4 py-3 text-sm text-white shadow-inner outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/20"
              >
                {climateOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-slate-950">
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Maintenance style</span>
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-slate-950/35 px-4 py-3 text-sm text-white shadow-inner outline-none transition focus:border-blue-300/70 focus:ring-2 focus:ring-blue-300/20"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-slate-950">
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-5 shadow-panel backdrop-blur-md sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Estimated budget</p>
                <div className="mt-2 text-4xl font-semibold text-white sm:text-5xl">{formatCurrency(estimate.annual)}</div>
                <p className="mt-2 text-sm text-slate-300">About {formatCurrency(estimate.monthly)} per month</p>
              </div>
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-right">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">Risk level</div>
                <div className="mt-1 text-lg font-semibold text-white">Moderate</div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Exterior', value: estimate.exterior, accent: 'from-cyan-300/25 to-cyan-300/5' },
                { label: 'Systems', value: estimate.systems, accent: 'from-blue-300/25 to-blue-300/5' },
                { label: 'Interior reserve', value: estimate.interiors, accent: 'from-slate-200/20 to-slate-200/5' },
              ].map((item) => (
                <div key={item.label} className={`rounded-2xl border border-white/10 bg-gradient-to-b ${item.accent} p-4`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">{item.label}</p>
                  <p className="mt-3 text-xl font-semibold text-white">{formatCurrency(item.value)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">What drives the estimate</p>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  {currentClimate.label} · {currentPriority.label}
                </p>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  ['Home value baseline', 78],
                  ['Age adjustment', homeAge < 10 ? 46 : homeAge < 25 ? 64 : homeAge < 40 ? 82 : 92],
                  ['Climate pressure', currentClimate.multiplier === 1 ? 52 : currentClimate.multiplier === 1.12 ? 72 : 88],
                ].map(([label, width]) => (
                  <div key={label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{label}</span>
                      <span>{width}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-300"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 text-xs leading-6 text-slate-400">
              This is a planning tool, not a quote. Use it to set aside cash for inspections, tune-ups, seals,
              cleaning, and the repairs that prevent bigger bills later.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
