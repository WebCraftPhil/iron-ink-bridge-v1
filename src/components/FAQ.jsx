import { useState } from 'react'

const faqs = [
  {
    question: '1. Is direct mail still a relevant channel for modern business growth?',
    answer: [
      'Direct mail is currently experiencing a strategic shift from a legacy tactic to a core pillar of performance-based physical media. According to the Lob "State of Direct Mail 2026" report, 90% of marketing and operations leaders increased their direct mail allocation this year, with companies now dedicating an average of 25% of their total marketing budgets to this channel.',
      'The differentiator between baseline performance and market leadership lies in operational precision. High-ROI teams are 3x as likely to integrate advanced analytics (54% vs. 17%) and third-party data (54% vs. 20%) to ensure the medium functions as a full-funnel channel.',
      'Its effectiveness is documented across the entire customer lifecycle: winback and dormant customer campaigns achieved a 98% effectiveness rating among business leaders, customer retention remains highly rated for maintaining brand salience and reducing churn, and customer acquisition is used as a high-intent driver for new business through data-driven targeting.',
    ],
  },
  {
    question: '2. How does direct mail perform compared to digital-only marketing strategies?',
    answer: [
      'Direct mail is most powerful when it functions as the physical anchor of an omni-channel ecosystem. Data confirms that 94% of leaders believe direct mail significantly enhances engagement and conversions within digital channels.',
      'The industry is moving away from isolated mail pieces toward personalized journeys. Approximately 2 in 3 leaders report that these integrated journeys are more effective in moving a customer through the conversion funnel than standalone efforts.',
      'A critical bridge in this journey is the USPS Informed Delivery platform, which allows physical mail to trigger digital notifications. This synchronization ensures the message hits the consumer’s inbox and mailbox simultaneously, creating a multi-touch reinforcement that isolated digital ads cannot replicate.',
    ],
  },
  {
    question: '3. Isn\'t direct mail too expensive to scale in the current economy?',
    answer: [
      'While executional complexity and postage rates are valid concerns, sophisticated mailers mitigate these costs through USPS strategic incentives. High-volume mailers leverage the Mail Growth Incentive (MGI), which provides specific credits to eDoc submitters who grow their volume year-over-year. By aligning campaign mechanics with the 2026 Promotions Calendar, brands can significantly offset production costs.',
    ],
    table: [
      {
        category: 'Integrated Technology',
        discountRate: '5% Discount',
        mailClass: 'First-Class & Marketing Mail',
        detail: 'Includes advanced tech like AR or video-in-print.',
      },
      {
        category: 'Tactile, Sensory, and Interactive',
        discountRate: '5% Discount',
        mailClass: 'Marketing Mail',
        detail: 'Leverages physical engagement to drive response.',
      },
      {
        category: 'Informed Delivery',
        discountRate: '1% Discount',
        mailClass: 'First-Class & Marketing Mail',
        detail: 'An Add-On credit requiring eligibility in a primary promotion.',
      },
      {
        category: 'Sustainability',
        discountRate: '0.5% Credit',
        mailClass: 'First-Class & Marketing Mail',
        detail: 'Applied to eDoc submitters for eco-certified mailings.',
      },
      {
        category: 'Catalog Insights',
        discountRate: '5% Discount',
        mailClass: 'Marketing Mail',
        detail: 'Drives engagement through data-enriched catalog formats.',
      },
    ],
  },
  {
    question: '4. How are AI and automation being used to modernize traditional mail?',
    answer: [
      'Technology has transitioned direct mail from a batch-and-blast medium to an automated, trigger-based system. While 99% of leaders now use AI or automation, high-ROI teams apply these tools with greater intent, specifically for attribution, send-timing optimization, and delivery accuracy rather than just creative generation.',
      'Automation enables perfectly timed mail based on real-time customer milestones or behavioral triggers. 96% of leaders report that this level of relevance significantly lifts response rates. By using AI to guide creative decisions and refine attribution models, marketers can treat physical mail with the same iterative agility as a search or social campaign.',
    ],
  },
  {
    question: '5. How can I track the ROI of a physical mailer as accurately as a digital ad?',
    answer: [
      'Modern mailers utilize digital response signals to eliminate the measurement gap. As demonstrated by the visual standard set in the Goffstown Homeowner Guide, effective mailers now utilize action-oriented QR codes, direct call-to-actions, and PURLs or promo codes to capture immediate mobile intent and 1:1 attribution within a CRM or CDP.',
      'Despite these tools, the logistics blind spot remains a significant risk; 87% of leaders admit that printing, shipping, and delivery are major blind spots, leading to surprise costs for 82% of teams. Currently, only 39% of teams have real-time visibility into delivery status.',
      'To achieve measurable success in 2026, four essential moves matter most: build logistics intelligence, assign clear internal ownership, connect data and delivery, and broaden your measurement mix so QR scans, PURLs, and digital lift are tracked together.',
    ],
  },
]

function AccordionContent({ faq }) {
  return (
    <div className="grid gap-4 pb-5 pt-1 text-sm leading-7 text-slate-200">
      {faq.answer.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}

      {faq.table ? (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <table className="min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-[0.22em] text-slate-400">
                <th className="pb-3 pr-4 font-semibold">Promotion Category</th>
                <th className="pb-3 pr-4 font-semibold">Discount Rate</th>
                <th className="pb-3 pr-4 font-semibold">Eligible Mail Class</th>
                <th className="pb-3 font-semibold">Strategic Detail</th>
              </tr>
            </thead>
            <tbody>
              {faq.table.map((row) => (
                <tr key={row.category} className="border-b border-white/10 last:border-b-0 align-top">
                  <td className="py-3 pr-4 text-slate-100">{row.category}</td>
                  <td className="py-3 pr-4 font-semibold text-[#4cc9ff]">{row.discountRate}</td>
                  <td className="py-3 pr-4 text-slate-200">{row.mailClass}</td>
                  <td className="py-3 text-slate-300">{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-[0_30px_80px_-40px_rgba(11,18,32,0.85)] backdrop-blur-xl backdrop-saturate-150 sm:p-6 lg:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.22),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.18),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_55%)]" />
      <div className="absolute inset-px rounded-[2rem] border border-white/10" />

      <div className="relative">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-200/80">FAQ</p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-white sm:text-4xl">
            The Evolution and Effectiveness of Direct Mail in 2026
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            A concise view of what is driving direct mail performance, how USPS incentives change the economics, and
            how to measure the channel with the same rigor as digital.
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          {faqs.map((faq, index) => {
            const isOpen = index === openIndex

            return (
              <article key={faq.question} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/35 shadow-panel backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold leading-7 text-white sm:text-lg">{faq.question}</span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-lg text-blue-200">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen ? <AccordionContent faq={faq} /> : null}
              </article>
            )
          })}
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-cyan-300/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-100/80">Next step</p>
          <p className="mt-3 font-display text-2xl leading-tight text-white sm:text-3xl">
            Ready to Erase Your Logistics Blind Spot? Book a Demo of the Iron &amp; Ink Dashboard.
          </p>
          <div className="mt-5">
            <a
              href="/admin"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:from-cyan-300 hover:to-blue-200"
            >
              Book a Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}