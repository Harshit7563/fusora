import { Link, useParams } from 'react-router-dom'
import {
  COMPANY_NAME,
  GRIEVANCE_EMAIL,
  GRIEVANCE_OFFICER,
  POLICY_EFFECTIVE_DATE,
  SUPPORT_EMAIL,
  SUPPORT_MAILTO,
} from '../brand'
import { usePageTitle } from '../hooks/usePageTitle'
import { getPolicy, policies } from '../policies'

const FOOTER_POLICY_ORDER = [
  'privacy-policy',
  'terms-and-conditions',
  'shipping-policy',
  'return-refund-policy',
  'disclaimer',
] as const

function orderedPolicies() {
  const primary = FOOTER_POLICY_ORDER.map((slug) =>
    policies.find((p) => p.slug === slug),
  ).filter(Boolean) as typeof policies
  const rest = policies.filter(
    (p) => !(FOOTER_POLICY_ORDER as readonly string[]).includes(p.slug),
  )
  return [...primary, ...rest]
}

export function PoliciesIndexPage() {
  usePageTitle('Legal Policies')
  const list = orderedPolicies()

  return (
    <main className="mx-auto max-w-[900px] px-4 py-10 lg:px-6">
      <p className="text-xs font-semibold tracking-[0.16em] text-[#cf2028] uppercase">
        {COMPANY_NAME}
      </p>
      <h1 className="font-heading mt-2 text-4xl tracking-[0.04em] text-[#070001] uppercase">
        Legal Policies
      </h1>
      <p className="mt-2 text-sm text-[#6a6667]">
        Full policy documents for Fusora customers. Effective date:{' '}
        <span className="font-semibold text-[#070001]">
          {POLICY_EFFECTIVE_DATE}
        </span>
        .
      </p>

      <ul className="mt-8 space-y-3">
        {list.map((p) => (
          <li key={p.slug}>
            <Link
              to={`/policies/${p.slug}`}
              className="flex items-center justify-between border border-[#d9d9d9] bg-white px-5 py-4 text-sm font-semibold text-[#cf2028] transition hover:border-[#cf2028]"
            >
              <span>
                {p.title}
                <span className="mt-0.5 block text-xs font-normal text-[#6a6667]">
                  {p.sections.length} sections · detailed policy
                </span>
              </span>
              <span aria-hidden>→</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 border border-[#d9d9d9] bg-[#f7f5f5] p-5 text-sm text-[#6a6667]">
        <p className="font-semibold text-[#070001]">Grievance Officer</p>
        <p className="mt-1">
          {GRIEVANCE_OFFICER} ·{' '}
          <a href={SUPPORT_MAILTO} className="font-semibold text-[#cf2028]">
            {GRIEVANCE_EMAIL}
          </a>
        </p>
      </div>
    </main>
  )
}

export function PolicyPage() {
  const { slug } = useParams()
  const policy = getPolicy(slug)
  usePageTitle(policy?.title || 'Policy')

  if (!policy) {
    return (
      <main className="mx-auto max-w-[900px] px-4 py-16 text-center lg:px-6">
        <h1 className="text-2xl font-bold">Policy not found</h1>
        <Link
          to="/policies"
          className="mt-4 inline-block text-[#cf2028] hover:underline"
        >
          View all policies
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[960px] px-4 py-10 lg:px-6">
      <nav className="mb-4 text-sm text-[#6a6667]">
        <Link to="/" className="hover:text-[#cf2028]">
          Home
        </Link>
        {' / '}
        <Link to="/policies" className="hover:text-[#cf2028]">
          Policies
        </Link>
        {' / '}
        <span className="text-[#070001]">{policy.title}</span>
      </nav>

      <p className="text-xs font-semibold tracking-[0.16em] text-[#cf2028] uppercase">
        {COMPANY_NAME}
      </p>
      <h1 className="font-heading mt-2 text-4xl tracking-[0.04em] text-[#070001] uppercase">
        {policy.title}
      </h1>
      <div className="mt-4 border border-[#d9d9d9] bg-white px-4 py-3 text-xs text-[#6a6667] sm:text-sm">
        <p>
          <span className="font-semibold text-[#070001]">Document type:</span>{' '}
          Legal policy ·{' '}
          <span className="font-semibold text-[#070001]">Effective:</span>{' '}
          {POLICY_EFFECTIVE_DATE} ·{' '}
          <span className="font-semibold text-[#070001]">Clauses:</span>{' '}
          {policy.sections.length} ·{' '}
          <span className="font-semibold text-[#070001]">Governing law:</span>{' '}
          India
        </p>
        <p className="mt-1">
          Issued by {COMPANY_NAME} for the Fusora Platform. Please read in full
          before using the website or placing an order.
        </p>
      </div>

      <aside className="mt-6 border border-[#d9d9d9] bg-[#f8f6ee] p-4 sm:p-5">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#6a6667] uppercase">
          Table of contents
        </p>
        <ol className="mt-3 list-decimal columns-1 gap-x-8 pl-5 text-sm text-[#070001] sm:columns-2">
          {policy.sections.map((section) => (
            <li key={section.heading} className="mb-1.5 break-inside-avoid pl-1">
              <a
                href={`#${section.heading.replace(/\s+/g, '-').toLowerCase()}`}
                className="hover:text-[#cf2028]"
              >
                {section.heading.replace(/^\d+[A-Z]?\.\s*/, '')}
              </a>
            </li>
          ))}
        </ol>
      </aside>

      <article className="mt-8 space-y-9 border border-[#d9d9d9] bg-white px-4 py-6 sm:px-8 sm:py-8">
        {policy.sections.map((section) => (
          <section
            key={section.heading}
            id={section.heading.replace(/\s+/g, '-').toLowerCase()}
            className="scroll-mt-28 border-b border-[#eee] pb-8 last:border-b-0 last:pb-0"
          >
            <h2 className="text-base font-bold tracking-wide text-[#070001] uppercase sm:text-lg">
              {section.heading}
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-[#3a3334] sm:text-[0.95rem] sm:leading-8">
              {section.body.map((para, i) => (
                <p key={`${section.heading}-${i}`}>{para}</p>
              ))}
            </div>
          </section>
        ))}
      </article>

      <div className="mt-10 border border-[#d9d9d9] bg-[#f7f5f5] p-5 text-sm">
        <p className="font-semibold text-[#070001]">Need help?</p>
        <p className="mt-1 text-[#6a6667]">
          Email{' '}
          <a href={SUPPORT_MAILTO} className="font-semibold text-[#cf2028]">
            {SUPPORT_EMAIL}
          </a>
          {policy.slug === 'grievance-redressal-policy' && (
            <>
              {' '}
              · Grievance Officer: {GRIEVANCE_OFFICER} (
              <a href={SUPPORT_MAILTO} className="font-semibold text-[#cf2028]">
                {GRIEVANCE_EMAIL}
              </a>
              )
            </>
          )}
        </p>
        <Link
          to="/policies"
          className="mt-3 inline-block text-sm font-semibold text-[#cf2028] hover:underline"
        >
          ← All policies
        </Link>
      </div>
    </main>
  )
}
