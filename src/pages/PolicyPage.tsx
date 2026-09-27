import { Link, useParams } from 'react-router-dom'
import {
  COMPANY_NAME,
  GRIEVANCE_EMAIL,
  GRIEVANCE_OFFICER,
  POLICY_EFFECTIVE_DATE,
  SUPPORT_EMAIL,
  SUPPORT_MAILTO,
} from '../brand'
import { getPolicy, policies } from '../policies'

export function PoliciesIndexPage() {
  return (
    <main className="mx-auto max-w-[900px] px-4 py-10 lg:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-bb-text">
        Legal Policies
      </h1>
      <p className="mt-2 text-sm text-bb-muted">
        Policies of <span className="font-semibold text-bb-text">{COMPANY_NAME}</span>.
        Effective date: {POLICY_EFFECTIVE_DATE}.
      </p>

      <ul className="mt-8 space-y-3">
        {policies.map((p) => (
          <li key={p.slug}>
            <Link
              to={`/policies/${p.slug}`}
              className="flex items-center justify-between rounded-2xl border border-bb-border bg-white px-5 py-4 text-sm font-semibold text-bb-link transition hover:border-bb-blue"
            >
              {p.title}
              <span aria-hidden>→</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 rounded-2xl border border-bb-border bg-bb-gray/50 p-5 text-sm text-bb-muted">
        <p className="font-semibold text-bb-text">Grievance Officer</p>
        <p className="mt-1">
          {GRIEVANCE_OFFICER} ·{' '}
          <a href={SUPPORT_MAILTO} className="font-semibold text-bb-link">
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

  if (!policy) {
    return (
      <main className="mx-auto max-w-[900px] px-4 py-16 text-center lg:px-6">
        <h1 className="text-2xl font-bold">Policy not found</h1>
        <Link to="/policies" className="mt-4 inline-block text-bb-link hover:underline">
          View all policies
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[900px] px-4 py-10 lg:px-6">
      <nav className="mb-4 text-sm text-bb-muted">
        <Link to="/" className="hover:text-bb-link">
          Home
        </Link>
        {' / '}
        <Link to="/policies" className="hover:text-bb-link">
          Policies
        </Link>
        {' / '}
        <span className="text-bb-text">{policy.title}</span>
      </nav>

      <p className="text-xs font-semibold tracking-wide text-bb-blue uppercase">
        {COMPANY_NAME}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-bb-text">
        {policy.title}
      </h1>
      <p className="mt-2 text-sm text-bb-muted">
        Effective date: <span className="font-semibold text-bb-text">{POLICY_EFFECTIVE_DATE}</span>
      </p>

      <div className="mt-8 space-y-8">
        {policy.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-bold text-bb-text">{section.heading}</h2>
            <div className="mt-2 space-y-3 text-sm leading-relaxed text-bb-muted">
              {section.body.map((para) => (
                <p key={para.slice(0, 48)}>{para}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-bb-border bg-bb-gray/40 p-5 text-sm">
        <p className="font-semibold text-bb-text">Need help?</p>
        <p className="mt-1 text-bb-muted">
          Email{' '}
          <a href={SUPPORT_MAILTO} className="font-semibold text-bb-link">
            {SUPPORT_EMAIL}
          </a>
          {policy.slug === 'grievance-redressal-policy' && (
            <>
              {' '}
              · Grievance Officer: {GRIEVANCE_OFFICER} (
              <a href={SUPPORT_MAILTO} className="font-semibold text-bb-link">
                {GRIEVANCE_EMAIL}
              </a>
              )
            </>
          )}
        </p>
        <Link
          to="/policies"
          className="mt-3 inline-block text-sm font-semibold text-bb-link hover:underline"
        >
          ← All policies
        </Link>
      </div>
    </main>
  )
}
