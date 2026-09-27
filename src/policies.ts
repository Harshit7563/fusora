import {
  COMPANY_NAME,
  GRIEVANCE_EMAIL,
  GRIEVANCE_OFFICER,
  POLICY_EFFECTIVE_DATE,
  SITE_DOMAIN,
  SITE_URL,
  SUPPORT_EMAIL,
} from './brand'

export type PolicySlug =
  | 'terms-and-conditions'
  | 'privacy-policy'
  | 'disclaimer'
  | 'return-refund-policy'
  | 'shipping-policy'
  | 'cancellation-policy'
  | 'grievance-redressal-policy'

export type PolicyDoc = {
  slug: PolicySlug
  title: string
  sections: { heading: string; body: string[] }[]
}

const intro = (title: string) =>
  `This ${title} is issued by ${COMPANY_NAME} ("Company", "we", "us", or "our"), operating the online store at ${SITE_DOMAIN} (${SITE_URL}). Effective date: ${POLICY_EFFECTIVE_DATE}.`

export const policies: PolicyDoc[] = [
  {
    slug: 'terms-and-conditions',
    title: 'Terms and Conditions',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        body: [
          intro('Terms and Conditions'),
          `By accessing or using ${SITE_DOMAIN}, creating an account, or placing an order, you agree to be bound by these Terms and Conditions and all related policies of ${COMPANY_NAME}. If you do not agree, please do not use our website or services.`,
        ],
      },
      {
        heading: '2. Eligibility',
        body: [
          'You must be at least 18 years of age and capable of entering into a legally binding contract under Indian law to purchase products from us. If you are using the site on behalf of a business, you represent that you are authorised to bind that entity.',
        ],
      },
      {
        heading: '3. Products & Pricing',
        body: [
          'Product descriptions, images, and specifications are provided for information. We strive for accuracy but do not warrant that all content is error-free. Prices are shown in Indian Rupees (₹) unless stated otherwise and may change without prior notice.',
          'We reserve the right to refuse or cancel any order in case of pricing errors, stock unavailability, suspected fraud, or violation of these terms.',
        ],
      },
      {
        heading: '4. Accounts',
        body: [
          'You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. Please notify us immediately at ' +
            SUPPORT_EMAIL +
            ' if you suspect unauthorised use.',
        ],
      },
      {
        heading: '5. Orders & Payment',
        body: [
          'An order is an offer to buy. Acceptance occurs when we confirm the order by email/SMS or begin processing/shipping. Payment must be completed through the methods enabled on the website. Ownership of goods passes to you upon full payment and delivery/pickup, subject to applicable law.',
        ],
      },
      {
        heading: '6. Prohibited Use',
        body: [
          'You agree not to misuse the website, attempt unauthorised access, scrape data unlawfully, post harmful content, or use our services for any illegal purpose.',
        ],
      },
      {
        heading: '7. Intellectual Property',
        body: [
          `All trademarks, logos, content, and software on ${SITE_DOMAIN} are owned by ${COMPANY_NAME} or its licensors. You may not copy, modify, or distribute them without prior written consent.`,
        ],
      },
      {
        heading: '8. Limitation of Liability',
        body: [
          `To the maximum extent permitted by law, ${COMPANY_NAME} shall not be liable for indirect, incidental, special, or consequential damages arising from use of the website or products. Our total liability for any claim relating to an order shall not exceed the amount paid for that order.`,
        ],
      },
      {
        heading: '9. Governing Law',
        body: [
          'These Terms are governed by the laws of India. Courts at the competent jurisdiction where the Company maintains its registered office shall have exclusive jurisdiction, subject to applicable consumer protection laws.',
        ],
      },
      {
        heading: '10. Contact',
        body: [
          `For questions about these Terms, contact ${COMPANY_NAME} at ${SUPPORT_EMAIL}.`,
          `Effective date: ${POLICY_EFFECTIVE_DATE}.`,
        ],
      },
    ],
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    sections: [
      {
        heading: '1. Introduction',
        body: [
          intro('Privacy Policy'),
          `This Privacy Policy explains how ${COMPANY_NAME} collects, uses, stores, and protects your personal information when you use ${SITE_DOMAIN}.`,
        ],
      },
      {
        heading: '2. Information We Collect',
        body: [
          'We may collect: name, email address, mobile number, billing/shipping address, order history, payment-related references (processed via payment partners), device/browser information, approximate location (if you allow), and communications with support.',
          'OTP and account verification data may be processed to secure your account and complete transactions.',
        ],
      },
      {
        heading: '3. How We Use Information',
        body: [
          'We use your information to: process and fulfil orders; provide customer support; send order updates; improve our website and services; prevent fraud; comply with law; and, where permitted, share offers or updates (you may opt out of marketing emails).',
        ],
      },
      {
        heading: '4. Sharing of Information',
        body: [
          'We may share information with: logistics/shipping partners; payment gateways; IT and SMS/OTP service providers; professional advisors; and government authorities when required by law. We do not sell your personal data.',
        ],
      },
      {
        heading: '5. Data Security & Retention',
        body: [
          'We apply reasonable technical and organisational measures to protect personal data. No method of transmission over the internet is 100% secure. We retain data only as long as needed for business, legal, and accounting purposes.',
        ],
      },
      {
        heading: '6. Your Rights',
        body: [
          'Subject to applicable law (including the Digital Personal Data Protection Act, 2023, as applicable), you may request access, correction, or deletion of your personal data, or withdraw consent where processing is consent-based, by writing to ' +
            SUPPORT_EMAIL +
            '.',
        ],
      },
      {
        heading: '7. Cookies',
        body: [
          'We may use cookies and similar technologies for essential site functions, analytics, and preferences. You can control cookies through your browser settings.',
        ],
      },
      {
        heading: '8. Contact / Grievance',
        body: [
          `Privacy questions: ${SUPPORT_EMAIL}.`,
          `Grievance Officer: ${GRIEVANCE_OFFICER}, email: ${GRIEVANCE_EMAIL}.`,
          `Effective date: ${POLICY_EFFECTIVE_DATE}.`,
        ],
      },
    ],
  },
  {
    slug: 'disclaimer',
    title: 'Disclaimer',
    sections: [
      {
        heading: '1. General',
        body: [
          intro('Disclaimer'),
          `The information on ${SITE_DOMAIN} is provided by ${COMPANY_NAME} on an "as is" and "as available" basis for general informational and e-commerce purposes.`,
        ],
      },
      {
        heading: '2. No Warranty',
        body: [
          'While we endeavour to keep information accurate and up to date, we make no warranties or representations about completeness, reliability, or suitability of the website content, product descriptions, or third-party materials. Product colours and packaging may vary slightly from images shown.',
        ],
      },
      {
        heading: '3. External Links & Partners',
        body: [
          'Our website may contain links to third-party sites or services. We are not responsible for the content, policies, or practices of those third parties.',
        ],
      },
      {
        heading: '4. Limitation',
        body: [
          `To the fullest extent permitted by law, ${COMPANY_NAME} disclaims liability for any loss or damage arising from reliance on website content or inability to use the site, except where such liability cannot be excluded under Indian law.`,
        ],
      },
      {
        heading: '5. Contact',
        body: [
          `For clarification, contact ${SUPPORT_EMAIL}.`,
          `Effective date: ${POLICY_EFFECTIVE_DATE}.`,
        ],
      },
    ],
  },
  {
    slug: 'return-refund-policy',
    title: 'Return & Refund Policy',
    sections: [
      {
        heading: '1. Overview',
        body: [
          intro('Return & Refund Policy'),
          `${COMPANY_NAME} aims to make returns simple and fair for eligible products purchased on ${SITE_DOMAIN}.`,
        ],
      },
      {
        heading: '2. Return Window',
        body: [
          'Unless a product page states otherwise, most unused and unopened items may be returned within 7 (seven) days of delivery/pickup. Certain categories (innerwear, personal care opened products, perishables, customised items, and downloadable/digital goods) may be non-returnable for hygiene or legal reasons.',
        ],
      },
      {
        heading: '3. Condition of Returns',
        body: [
          'Returned products must be unused, in original packaging, with all tags, accessories, invoices, and freebies intact. Damaged, used, or incomplete returns may be rejected.',
        ],
      },
      {
        heading: '4. How to Initiate a Return',
        body: [
          `Email ${SUPPORT_EMAIL} with your order ID, product details, reason for return, and clear photos (if damaged/defective). Our team will guide you on pickup, hub drop-off, or courier return.`,
        ],
      },
      {
        heading: '5. Refunds',
        body: [
          'Once the returned product is inspected and approved, refunds are initiated to the original payment method within 5–10 business days (bank/UPI timelines may vary). Store credit may be offered where mutually agreed.',
          'Shipping charges (if any) are refundable only when the return is due to our error or a defective/wrong product.',
        ],
      },
      {
        heading: '6. Damaged or Wrong Items',
        body: [
          'Please report damaged, defective, or incorrect items within 48 hours of delivery with supporting photos/videos for fastest resolution — replacement or refund as applicable.',
        ],
      },
      {
        heading: '7. Contact',
        body: [
          `Returns desk: ${SUPPORT_EMAIL}.`,
          `Effective date: ${POLICY_EFFECTIVE_DATE}.`,
        ],
      },
    ],
  },
  {
    slug: 'shipping-policy',
    title: 'Shipping Policy',
    sections: [
      {
        heading: '1. Overview',
        body: [
          intro('Shipping Policy'),
          `${COMPANY_NAME} delivers orders placed on ${SITE_DOMAIN} through courier partners and/or store/hub pickup where available.`,
        ],
      },
      {
        heading: '2. Serviceable Areas',
        body: [
          'Delivery is available to pin codes serviceable by our logistics partners. If your area is not serviceable, we will notify you and arrange cancellation/refund or alternate fulfilment where possible.',
        ],
      },
      {
        heading: '3. Processing & Delivery Timelines',
        body: [
          'Orders are typically processed within 1–3 business days after payment confirmation (excluding Sundays/public holidays). Estimated delivery is usually 3–10 business days depending on location, product type, and courier performance.',
          'Hub/store pickup (where offered) may be available sooner once the order is marked ready.',
        ],
      },
      {
        heading: '4. Shipping Charges',
        body: [
          'Shipping charges, if applicable, are shown at checkout before payment. Promotional free-shipping offers may apply subject to minimum order value and terms stated on the site.',
        ],
      },
      {
        heading: '5. Order Tracking',
        body: [
          `Tracking details (when available) will be shared by email/SMS. For help, contact ${SUPPORT_EMAIL} with your order ID.`,
        ],
      },
      {
        heading: '6. Failed Delivery',
        body: [
          'If delivery fails due to incorrect address, unreachable phone, or repeated unavailability, the package may be returned to us. Re-shipping may attract additional charges; otherwise a refund may be processed as per our Return & Refund Policy after deduction of applicable shipping costs.',
        ],
      },
      {
        heading: '7. Contact',
        body: [
          `Shipping support: ${SUPPORT_EMAIL}.`,
          `Effective date: ${POLICY_EFFECTIVE_DATE}.`,
        ],
      },
    ],
  },
  {
    slug: 'cancellation-policy',
    title: 'Cancellation Policy',
    sections: [
      {
        heading: '1. Overview',
        body: [
          intro('Cancellation Policy'),
          `This policy explains how orders on ${SITE_DOMAIN} may be cancelled by you or by ${COMPANY_NAME}.`,
        ],
      },
      {
        heading: '2. Customer-Initiated Cancellation',
        body: [
          'You may request cancellation before the order is shipped or marked ready for pickup by emailing ' +
            SUPPORT_EMAIL +
            ' with your order ID. Once shipped, cancellation is not possible; you may instead refuse delivery or request a return as per the Return & Refund Policy.',
        ],
      },
      {
        heading: '3. Company-Initiated Cancellation',
        body: [
          `${COMPANY_NAME} may cancel an order in cases including: stock unavailability; pricing/listing error; payment failure or suspected fraud; incomplete address; or restriction under law. In such cases, any amount received will be refunded to the original payment method.`,
        ],
      },
      {
        heading: '4. Refunds on Cancellation',
        body: [
          'Approved cancellations before dispatch generally receive a full refund of the product amount (and shipping charges, if collected and not incurred). Refund timelines are typically 5–10 business days after approval.',
        ],
      },
      {
        heading: '5. Contact',
        body: [
          `Cancellation requests: ${SUPPORT_EMAIL}.`,
          `Effective date: ${POLICY_EFFECTIVE_DATE}.`,
        ],
      },
    ],
  },
  {
    slug: 'grievance-redressal-policy',
    title: 'Grievance Redressal Policy',
    sections: [
      {
        heading: '1. Purpose',
        body: [
          intro('Grievance Redressal Policy'),
          `${COMPANY_NAME} is committed to resolving customer concerns fairly and promptly in accordance with applicable Indian laws and platform guidelines.`,
        ],
      },
      {
        heading: '2. Scope',
        body: [
          'This policy covers grievances relating to orders, payments, delivery, returns/refunds, product quality, account issues, and privacy/data concerns arising from use of ' +
            SITE_DOMAIN +
            '.',
        ],
      },
      {
        heading: '3. How to Raise a Grievance',
        body: [
          `Please first contact our support team at ${SUPPORT_EMAIL} with: full name, registered mobile/email, order ID (if any), clear description of the issue, and supporting documents/photos.`,
          'We aim to acknowledge grievances within 48 hours on business days and resolve most issues within 7–14 business days, depending on complexity and third-party dependencies (banks, couriers, etc.).',
        ],
      },
      {
        heading: '4. Grievance Officer',
        body: [
          `If your concern is not resolved satisfactorily through regular support, you may escalate to our designated Grievance Officer:`,
          `Name: ${GRIEVANCE_OFFICER}`,
          `Email: ${GRIEVANCE_EMAIL}`,
          `Company: ${COMPANY_NAME}`,
          `Website: ${SITE_URL}`,
          `The Grievance Officer will review the complaint and provide a response within the timelines required under applicable law / intermediary guidelines, as far as practicable.`,
        ],
      },
      {
        heading: '5. Escalation',
        body: [
          'If you remain dissatisfied after the Grievance Officer’s response, you may pursue remedies available under consumer protection laws or other applicable legal forums in India.',
        ],
      },
      {
        heading: '6. Record Keeping',
        body: [
          'We maintain records of grievances and their resolution for internal review and compliance purposes.',
        ],
      },
      {
        heading: '7. Effective Date',
        body: [
          `This Grievance Redressal Policy is effective from ${POLICY_EFFECTIVE_DATE}.`,
          `For all grievance matters, write to ${GRIEVANCE_OFFICER} at ${GRIEVANCE_EMAIL}.`,
        ],
      },
    ],
  },
]

export function getPolicy(slug: string | undefined) {
  return policies.find((p) => p.slug === slug)
}
