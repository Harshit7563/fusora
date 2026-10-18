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
  `This ${title} is issued by ${COMPANY_NAME} ("Company", "we", "us", or "our"), operating the brand Fusora and the online store at ${SITE_DOMAIN} (${SITE_URL}). This document is effective from ${POLICY_EFFECTIVE_DATE} and applies to all visitors, registered users, and customers in India unless a product page or checkout screen states otherwise.`

export const policies: PolicyDoc[] = [
  {
    slug: 'terms-and-conditions',
    title: 'Terms & Conditions',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        body: [
          intro('Terms and Conditions'),
          `By browsing ${SITE_DOMAIN}, creating an account, verifying your mobile number, adding products to cart, placing an order, or using any Fusora service, you confirm that you have read, understood, and agree to be bound by these Terms and Conditions together with our Privacy Policy, Shipping Policy, Return & Refund Policy, Cancellation Policy, Disclaimer, and Grievance Redressal Policy.`,
          'If you do not agree with any part of these Terms, you must stop using the website immediately and should not place an order.',
          `We may update these Terms from time to time. The revised version will be posted on this page with an updated effective date. Continued use of ${SITE_DOMAIN} after changes are posted constitutes acceptance of the updated Terms.`,
        ],
      },
      {
        heading: '2. About the Company & Platform',
        body: [
          `${COMPANY_NAME} operates Fusora as an online multi-category marketplace / retail store offering apparel, luggage, jewellery, and related lifestyle products as listed on ${SITE_DOMAIN}.`,
          'Product assortment, brands, and catalogues may change without prior notice. Some products may be sourced from third-party suppliers or brand partners; however, your contract of sale for orders placed on Fusora is with the Company unless expressly stated otherwise on the product or invoice.',
          `Official customer support email: ${SUPPORT_EMAIL}. Brand domain: ${SITE_DOMAIN}.`,
        ],
      },
      {
        heading: '3. Eligibility',
        body: [
          'You must be at least 18 years of age and competent to contract under the Indian Contract Act, 1872, to register an account or purchase products from us.',
          'If you are under 18, you may use the website only with the involvement and consent of a parent or legal guardian who accepts these Terms on your behalf.',
          'If you are using the site on behalf of a company, partnership, or other legal entity, you represent that you are authorised to bind that entity to these Terms.',
          'We reserve the right to refuse service, close accounts, or cancel orders if we reasonably believe you are ineligible, providing false information, or misusing the platform.',
        ],
      },
      {
        heading: '4. Account Registration & Security',
        body: [
          'To place orders you may be required to create an account using your name, email address, mobile number, and password. Mobile numbers may be verified via One-Time Password (OTP) sent through our SMS service provider.',
          'You agree to provide accurate, current, and complete information and to keep it updated. You are solely responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.',
          `Notify us immediately at ${SUPPORT_EMAIL} if you suspect unauthorised access, OTP misuse, or any security breach. We are not liable for losses arising from your failure to safeguard account credentials, except where required by applicable law.`,
          'We may suspend or terminate accounts that remain inactive for a prolonged period, or that are used for fraud, abuse, chargebacks in bad faith, or violation of these Terms.',
        ],
      },
      {
        heading: '5. Products, Descriptions & Pricing',
        body: [
          'We make commercially reasonable efforts to display product titles, descriptions, sizes, materials, colours, images, and prices accurately. However, actual colours may vary slightly due to screen settings, photography, lighting, and manufacturing batches.',
          'Sizes and measurements follow the size chart shown on the product page where available. Customers are responsible for checking size charts before ordering apparel.',
          'All prices are quoted in Indian Rupees (INR / ₹) inclusive or exclusive of applicable taxes as shown at checkout. GST and other statutory levies, if applicable, will be indicated on the invoice.',
          'We reserve the right to correct pricing errors, withdraw listings, or refuse orders even after an order is submitted, if a product was listed at an incorrect price due to typographical error, system glitch, or supplier issue. In such cases, any amount already paid will be refunded.',
          'Promotional prices, coupons, and member discounts are subject to the specific campaign terms and may be withdrawn at any time.',
        ],
      },
      {
        heading: '6. Orders, Acceptance & Payment',
        body: [
          'When you place an order, you make an offer to purchase the selected products. Order confirmation by email/SMS or display of an order ID does not by itself guarantee acceptance if stock, payment, address, or fraud checks fail.',
          'Acceptance of an order occurs when we confirm processing, dispatch, or readiness for fulfilment. We may cancel orders as described in our Cancellation Policy.',
          'Payment methods may include Cash on Delivery / pay at hub (where enabled), UPI, cards, net banking, wallets, or other gateways displayed at checkout. Payment gateways are operated by third-party providers; their terms also apply.',
          'You authorise us and our payment partners to process the transaction amount for your order. For COD orders, the exact amount payable will be collected at delivery or as communicated.',
          'Title to goods passes to you upon full payment and successful delivery (or handover at pickup, if offered). Risk of loss passes on delivery to the address / recipient named in the order, subject to applicable law.',
        ],
      },
      {
        heading: '7. Delivery & Fulfilment',
        body: [
          'Standard delivery timelines for most products are approximately 2–5 days after order confirmation, subject to pin-code serviceability, stock availability, courier performance, public holidays, and unforeseen events. Please see our Shipping Policy for full details.',
          'Delivery estimates shown on the site are indicative, not guarantees. Delays caused by courier partners, weather, strikes, natural calamities, or incorrect address details are beyond our sole control; we will still endeavour to assist you.',
          'You must provide a complete and accurate delivery address and a reachable mobile number. Failed delivery attempts may result in return to origin and additional charges or refund processing as per policy.',
        ],
      },
      {
        heading: '8. Returns, Refunds & Cancellations',
        body: [
          'Returns, exchanges, refunds, and cancellations are governed by our Return & Refund Policy and Cancellation Policy. By placing an order you agree to those policies.',
          'Certain categories may be non-returnable for hygiene, customisation, or legal reasons. Always check the product page and invoice notes.',
        ],
      },
      {
        heading: '9. User Conduct & Prohibited Use',
        body: [
          `You agree not to: (a) use ${SITE_DOMAIN} for any unlawful purpose; (b) attempt unauthorised access to systems, accounts, or data; (c) interfere with site security or performance; (d) scrape, crawl, or harvest data without written permission; (e) upload malware or harmful content; (f) impersonate another person; (g) engage in fraudulent orders, false chargebacks, or abuse of promotions; or (h) harass our staff or other users.`,
          'Violation may result in account suspension, order cancellation, reporting to authorities, and pursuit of legal remedies.',
        ],
      },
      {
        heading: '10. Intellectual Property',
        body: [
          `All content on ${SITE_DOMAIN} — including trademarks (including “Fusora”), logos, text, graphics, product images, UI design, software, and compilations — is owned by ${COMPANY_NAME} or its licensors and is protected under Indian copyright and trademark laws.`,
          'You are granted a limited, non-exclusive, non-transferable licence to access and use the site for personal shopping only. You may not copy, modify, reverse engineer, republish, or commercially exploit site content without prior written consent.',
          'Product brand names and images belonging to third parties remain the property of their respective owners and are used for identification / retail purposes.',
        ],
      },
      {
        heading: '11. Third-Party Services',
        body: [
          'The website may use or link to third-party services such as payment gateways, SMS OTP providers, analytics, maps/location, and logistics companies. Your use of those services may be subject to their own terms and privacy policies.',
          'We are not responsible for outages, errors, or data practices of third-party providers beyond our reasonable contractual controls, except as required by law.',
        ],
      },
      {
        heading: '12. Disclaimer of Warranties',
        body: [
          `Except as expressly stated in writing or required under the Consumer Protection Act, 2019 and other applicable laws, ${SITE_DOMAIN} and products are provided on an “as is” and “as available” basis.`,
          'Manufacturer warranties, if any, will apply as per the brand documentation supplied with the product. Please retain invoices for warranty claims.',
        ],
      },
      {
        heading: '13. Limitation of Liability',
        body: [
          `To the maximum extent permitted by Indian law, ${COMPANY_NAME} shall not be liable for any indirect, incidental, special, punitive, or consequential damages, including loss of profits, data, goodwill, or business opportunity, arising out of or related to your use of the website or any product purchased.`,
          'Our aggregate liability for any claim arising from a particular order shall not exceed the amount actually paid by you to us for that order.',
          'Nothing in these Terms excludes liability for fraud, wilful misconduct, or any liability that cannot be limited under applicable consumer protection law.',
        ],
      },
      {
        heading: '14. Indemnity',
        body: [
          `You agree to indemnify and hold harmless ${COMPANY_NAME}, its directors, employees, and agents from claims, losses, and expenses (including reasonable legal fees) arising from your breach of these Terms, misuse of the website, or violation of any law or third-party right.`,
        ],
      },
      {
        heading: '15. Force Majeure',
        body: [
          'We shall not be liable for delay or failure to perform obligations due to events beyond our reasonable control, including natural disasters, epidemics, war, terrorism, riots, government actions, labour disputes, power/internet failures, or courier network disruptions.',
        ],
      },
      {
        heading: '16. Governing Law & Dispute Resolution',
        body: [
          'These Terms are governed by the laws of India. Subject to consumer rights under applicable law, courts having competent jurisdiction at the place where the Company maintains its registered office shall have exclusive jurisdiction over disputes arising from these Terms.',
          'Before initiating formal proceedings, you agree to attempt amicable resolution by writing to our support / Grievance Officer as described in the Grievance Redressal Policy.',
        ],
      },
      {
        heading: '17. Severability & Entire Agreement',
        body: [
          'If any provision of these Terms is held invalid or unenforceable, the remaining provisions shall continue in full force. These Terms, together with the policies linked on this website, constitute the entire agreement between you and the Company regarding use of Fusora online services, and supersede prior understandings on the same subject.',
        ],
      },
      {
        heading: '18. Contact',
        body: [
          `For questions regarding these Terms and Conditions, contact:`,
          `Company: ${COMPANY_NAME}`,
          `Brand / Website: Fusora · ${SITE_URL}`,
          `Email: ${SUPPORT_EMAIL}`,
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
          `We respect your privacy and are committed to protecting personal data in accordance with applicable Indian laws, including the Information Technology Act, 2000, applicable IT Rules, and the Digital Personal Data Protection Act, 2023 (DPDP Act) as and when applicable to our processing activities.`,
          `This Privacy Policy describes what information we collect on ${SITE_DOMAIN}, why we collect it, how we use and share it, how long we keep it, and the choices available to you.`,
        ],
      },
      {
        heading: '2. Whose Data We Process',
        body: [
          'This Policy applies to: website visitors; registered account holders; customers placing orders; persons contacting support; and individuals whose details are provided for delivery (e.g., gift recipients), to the extent we process their data to fulfil an order.',
        ],
      },
      {
        heading: '3. Information We Collect',
        body: [
          'Identity & contact data: full name, email address, mobile number, and account credentials.',
          'Address & fulfilment data: shipping / billing address, landmark, pin code, preferred hub/city, and delivery instructions.',
          'Transaction data: products ordered, order IDs, amounts, payment method type, invoices, returns/refunds history, and related timestamps.',
          'Verification data: OTP requests and verification status for mobile authentication (we do not store plaintext OTPs longer than needed for verification).',
          'Technical data: IP address, device type, browser type, approximate location (if you grant permission), pages visited, referring URL, and cookies/identifiers needed for site function and analytics.',
          'Communications: emails, WhatsApp/SMS threads, and support tickets you send to us.',
          'We do not knowingly collect sensitive personal data beyond what is necessary for e-commerce fulfilment, account security, and legal compliance. We do not ask for your full card/UPI PIN/password — those are handled by payment partners on their secure pages.',
        ],
      },
      {
        heading: '4. How We Collect Information',
        body: [
          'Directly from you when you register, log in, checkout, update profile, or contact support.',
          'Automatically through cookies, logs, and similar technologies when you browse the site.',
          'From service providers (payment gateways, SMS providers, courier partners) as needed to complete transactions and deliveries.',
          'From device location APIs if you allow location access to find a nearby hub or improve delivery estimates.',
        ],
      },
      {
        heading: '5. Purpose & Legal Basis of Processing',
        body: [
          'We process personal data to: create and manage accounts; verify mobile numbers; process and fulfil orders; arrange shipping; provide customer support; send transactional alerts (order, OTP, delivery); improve website performance and security; detect and prevent fraud; comply with tax, accounting, and legal obligations; and — where you consent or as otherwise permitted — send promotional offers about Fusora products and memberships.',
          'You may withdraw marketing consent at any time by writing to ' +
            SUPPORT_EMAIL +
            '. Transactional messages required for orders and security will continue.',
        ],
      },
      {
        heading: '6. Sharing & Disclosure',
        body: [
          'We may share data with: logistics and courier partners; payment gateway / banking partners; SMS / OTP providers (including Zone Digital / Anilax AuthSecure or similar); cloud hosting and IT vendors; professional advisors (legal, accounting); and government / law-enforcement agencies when required by law or court order.',
          'We require service providers to use personal data only for contracted purposes and to apply reasonable security safeguards.',
          'We do not sell your personal data to third parties for their independent marketing.',
          'In the event of a merger, acquisition, or business transfer, personal data may be transferred as part of business assets, subject to continued protection consistent with this Policy.',
        ],
      },
      {
        heading: '7. Cookies & Similar Technologies',
        body: [
          'We use essential cookies for login sessions, cart persistence, and security. We may also use analytics cookies to understand traffic and improve UX.',
          'You can block or delete cookies via browser settings. Disabling essential cookies may break checkout, login, or cart features.',
        ],
      },
      {
        heading: '8. Data Retention',
        body: [
          'We retain account and order data for as long as your account is active and thereafter as required for legal, tax, accounting, dispute-resolution, and fraud-prevention purposes (typically for periods mandated under Indian tax and commercial laws).',
          'OTP session data is retained only for a short period needed to complete verification.',
          'When data is no longer required, we delete or anonymise it in a commercially reasonable manner.',
        ],
      },
      {
        heading: '9. Security Measures',
        body: [
          'We implement reasonable technical and organisational measures such as access controls, encrypted transport (HTTPS), and restricted staff access to personal data.',
          'No method of transmission or storage is 100% secure. You are responsible for keeping your password confidential and for securing devices you use to access Fusora.',
        ],
      },
      {
        heading: '10. Children’s Privacy',
        body: [
          'Our services are directed to adults. We do not knowingly collect personal data from children under 18 without guardian involvement. If you believe a minor has provided data without consent, contact us to request deletion.',
        ],
      },
      {
        heading: '11. Your Rights',
        body: [
          'Subject to applicable law, you may request: access to personal data we hold about you; correction of inaccurate data; deletion / erasure where legally permissible; withdrawal of consent for consent-based processing; and grievance redressal.',
          `To exercise rights, email ${SUPPORT_EMAIL} from your registered email/mobile with sufficient details for us to verify your identity. We may ask for additional information to prevent unauthorised disclosure.`,
          'We will respond within reasonable timelines prescribed under applicable law.',
        ],
      },
      {
        heading: '12. Cross-Border Transfers',
        body: [
          'Primary processing is intended within India. If any processor stores or processes data outside India, we will take steps consistent with applicable law to ensure appropriate safeguards.',
        ],
      },
      {
        heading: '13. Changes to this Policy',
        body: [
          'We may update this Privacy Policy periodically. Material changes will be reflected by revising the effective date on this page. We encourage you to review this Policy regularly.',
        ],
      },
      {
        heading: '14. Contact & Grievance Officer',
        body: [
          `Privacy / data requests: ${SUPPORT_EMAIL}`,
          `Grievance Officer: ${GRIEVANCE_OFFICER}`,
          `Grievance email: ${GRIEVANCE_EMAIL}`,
          `Company: ${COMPANY_NAME}`,
          `Website: ${SITE_URL}`,
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
        heading: '1. General Disclaimer',
        body: [
          intro('Disclaimer'),
          `All content, materials, product information, pricing, and services on ${SITE_DOMAIN} are provided by ${COMPANY_NAME} for general shopping and informational purposes on an “as is” and “as available” basis.`,
          'While we take care to keep information accurate, we do not warrant that the website will always be uninterrupted, error-free, virus-free, or that content will meet your specific expectations.',
        ],
      },
      {
        heading: '2. Product Information & Imagery',
        body: [
          'Product photographs, videos, and illustrations are representative. Actual products may differ slightly in shade, texture, embroidery, embellishment placement, stitching, or packaging due to manufacturing variations and display settings.',
          'Fabric composition, care instructions, and size charts are based on information available from suppliers/brands at the time of listing. Always follow care labels attached to the garment.',
          'Jewellery, accessories, and fashion items are sold as lifestyle / fashion products unless a specific hallmark, purity certificate, or warranty is expressly stated on the product page or invoice.',
        ],
      },
      {
        heading: '3. Pricing & Availability',
        body: [
          'Prices, discounts, stock status, and delivery estimates may change without prior notice. An item in your cart is not reserved until payment is successful and the order is accepted.',
          'In rare cases of listing errors (including incorrect price or description), we may cancel the order and refund any amount paid, as explained in our Terms and Cancellation Policy.',
        ],
      },
      {
        heading: '4. Medical / Professional Advice',
        body: [
          'Nothing on this website constitutes medical, legal, financial, or other professional advice. Product claims (if any) are not substitutes for professional consultation.',
        ],
      },
      {
        heading: '5. Third-Party Links & Tools',
        body: [
          'The website may contain links to third-party websites, payment pages, maps, or social platforms. We do not control and are not responsible for their content, availability, or privacy practices.',
          'Use of third-party tools is at your own risk and subject to their terms.',
        ],
      },
      {
        heading: '6. User Responsibility',
        body: [
          'You are responsible for evaluating the suitability of products before purchase (including size, material, occasion, and care). Please read product details, size charts, and policies carefully.',
          'You are also responsible for ensuring that the delivery address and contact number provided are correct and that someone is available to receive the shipment.',
        ],
      },
      {
        heading: '7. Limitation of Liability under this Disclaimer',
        body: [
          `To the fullest extent permitted by law, ${COMPANY_NAME} disclaims liability for any loss or damage arising from reliance on website content, delay or inability to use the site, or interactions with third-party services, except where liability cannot be excluded under Indian consumer protection or other mandatory law.`,
          'Statutory rights available to consumers under the Consumer Protection Act, 2019 remain unaffected where they cannot be waived.',
        ],
      },
      {
        heading: '8. Updates',
        body: [
          'This Disclaimer may be updated periodically. The effective date above indicates the latest version. Continued use of the website after updates constitutes acceptance of the revised Disclaimer.',
        ],
      },
      {
        heading: '9. Contact',
        body: [
          `For clarification regarding this Disclaimer, write to ${SUPPORT_EMAIL}.`,
          `Company: ${COMPANY_NAME} · Website: ${SITE_URL}`,
          `Effective date: ${POLICY_EFFECTIVE_DATE}.`,
        ],
      },
    ],
  },
  {
    slug: 'return-refund-policy',
    title: 'Return & Refund',
    sections: [
      {
        heading: '1. Overview',
        body: [
          intro('Return & Refund Policy'),
          `${COMPANY_NAME} wants you to be satisfied with your Fusora purchase. This Policy explains when returns are allowed, how to raise a return request, product condition requirements, refund timelines, and exceptions.`,
          'This Policy should be read with our Shipping Policy, Cancellation Policy, and Terms and Conditions.',
        ],
      },
      {
        heading: '2. Return Eligibility Window',
        body: [
          'Unless a specific product page states a different window, most eligible products can be returned within 7 (seven) calendar days from the date of delivery.',
          'Return requests must be initiated within this window by emailing support with your order ID. Requests raised after the window may be declined.',
          'For damaged, defective, or wrong-item complaints, please notify us within 48 hours of delivery with clear photos/videos for faster resolution.',
        ],
      },
      {
        heading: '3. Eligible vs Non-Returnable Items',
        body: [
          'Generally eligible (if unused and in original condition): apparel such as T-shirts, shirts, jeans, sarees (subject to hygiene checks), luggage (unused), and fashion jewellery sold as returnable on the product page.',
          'Typically non-returnable / non-exchangeable: innerwear, lingerie, socks, personal-care or hygiene products once opened/unsealed; pierced jewellery or items marked “final sale”; customised / made-to-order products; free gifts / samples; products without original tags, packaging, or invoice; and items damaged due to misuse, improper washing, or alteration by the customer.',
          'If a product is marked non-returnable on the product page at the time of purchase, that marking will prevail.',
        ],
      },
      {
        heading: '4. Condition Requirements',
        body: [
          'Returned products must be unused, unwashed, unaltered, and in original packaging with all tags, labels, dust bags, authenticity cards, freebies, and accessories intact.',
          'Footwear (if sold) must be returned in original box without signs of outdoor use.',
          'We reserve the right to reject returns that fail quality check, show signs of use, smell of perfume/detergent, have missing parts, or appear tampered.',
        ],
      },
      {
        heading: '5. How to Initiate a Return',
        body: [
          `Send an email to ${SUPPORT_EMAIL} with: (1) Order ID; (2) Product name / SKU; (3) Reason for return; (4) Clear photos of product, tags, and packaging (mandatory for damage/defect/wrong item); (5) Your registered mobile number.`,
          'Our team will review and share next steps — courier pickup, self-ship instructions, or hub drop-off if available in your city.',
          'Do not send products back without approval; unapproved returns may not be refunded or may be refused.',
        ],
      },
      {
        heading: '6. Reverse Pickup & Self-Ship',
        body: [
          'Where reverse pickup is available for your pin code, our logistics partner may collect the package from your address after approval.',
          'If reverse pickup is unavailable, we may ask you to self-ship the product to the address we provide, using a trackable courier. Keep the shipping receipt until the refund is completed.',
          'For returns due to our error (wrong/damaged/defective item), reasonable reverse shipping cost may be reimbursed or borne by us as communicated in approval.',
          'For “change of mind” returns (size/colour preference), reverse shipping charges may be deducted from the refund or payable by you, as informed during approval.',
        ],
      },
      {
        heading: '7. Refund Process & Timelines',
        body: [
          'After we receive the returned product and it passes quality inspection, refunds are initiated to the original payment method.',
          'Typical initiation timeline after successful QC: 5–10 business days. Actual credit to your bank/UPI/card wallet may take additional time depending on your bank or payment provider.',
          'For Cash on Delivery orders, refunds may be issued via UPI / bank transfer to the account details you provide, or as store credit, as mutually agreed.',
          'Refund amount generally covers the product price paid. Shipping charges are refunded only when the return is because of our error or a defective/wrong product.',
          'Once a refund is initiated, we will notify you by email/SMS where possible. For delayed credits after initiation, please check with your bank and share a payment reference with us for follow-up.',
        ],
      },
      {
        heading: '8. Exchanges',
        body: [
          'Exchanges (size/colour) depend on stock availability. Where direct exchange is not possible, we may ask you to return the item for refund and place a fresh order for the preferred variant.',
          'Price differences on exchange, if any, will be charged or refunded accordingly.',
        ],
      },
      {
        heading: '9. Failed QC / Rejected Returns',
        body: [
          'If a return fails quality check, we will inform you. The product may be shipped back to you; reverse/return shipping costs in such cases may be borne by you.',
          'Repeated abusive return behaviour may lead to refusal of future returns or account restrictions.',
        ],
      },
      {
        heading: '10. Contact',
        body: [
          `Returns & refunds desk: ${SUPPORT_EMAIL}`,
          `Company: ${COMPANY_NAME} · ${SITE_URL}`,
          `Please allow reasonable time for investigation involving courier partners before escalation.`,
          `Effective date: ${POLICY_EFFECTIVE_DATE}.`,
        ],
      },
    ],
  },
  {
    slug: 'shipping-policy',
    title: 'Shipping & Delivery',
    sections: [
      {
        heading: '1. Overview',
        body: [
          intro('Shipping Policy'),
          `${COMPANY_NAME} ships orders placed on ${SITE_DOMAIN} through reputed courier / logistics partners across serviceable locations in India.`,
          'This Policy covers processing times, estimated delivery, shipping charges, tracking, and issues related to failed delivery.',
        ],
      },
      {
        heading: '2. Serviceable Areas',
        body: [
          'We deliver to pin codes covered by our logistics partners. Serviceability is checked at checkout or during order processing.',
          'If your pin code is not serviceable, we will notify you and may cancel the order with a full refund of any amount paid, or offer an alternate fulfilment option if available.',
          'Remote, restricted, or high-risk locations may have longer delivery times or additional charges, which will be communicated where known in advance.',
        ],
      },
      {
        heading: '3. Order Processing',
        body: [
          'Orders are typically processed within 1–2 business days after successful payment confirmation / COD acceptance (excluding Sundays and public holidays).',
          'Processing may take longer during sale events, festive seasons, or when products need quality checks / sourcing from partner warehouses.',
          'You will receive an order confirmation with an Order ID. Please keep this ID handy for support and tracking.',
        ],
      },
      {
        heading: '4. Delivery Timelines',
        body: [
          'Standard estimated delivery for most products is 2–5 days after order confirmation, depending on your location, courier routing, and stock location.',
          'Metro and Tier-1 cities often fall on the quicker side of this range; remote or North-East / special category regions may take longer than 5 days in some cases.',
          'Delivery timelines are estimates, not guarantees. Delays can occur due to weather, political events, courier backlog, incorrect address, or force majeure.',
          'If there is an unusual delay, write to us with your Order ID and we will follow up with the courier partner.',
        ],
      },
      {
        heading: '5. Shipping Charges',
        body: [
          'Applicable shipping charges (if any) are displayed at checkout before you confirm the order.',
          'Free shipping may be offered on selected products, categories, membership benefits, or above a minimum order value during campaigns. Campaign rules will be stated on the site.',
          'Any change in shipping charge due to address update after placing the order will be communicated and may require additional payment or refund adjustment.',
        ],
      },
      {
        heading: '6. Order Tracking',
        body: [
          `Tracking links or AWB numbers (when available) are shared by email/SMS after dispatch. You can also track orders from your Fusora account under My Orders.`,
          `If tracking is not updating, wait 24–48 hours after dispatch and then contact ${SUPPORT_EMAIL} with your Order ID.`,
        ],
      },
      {
        heading: '7. Delivery Attempts & Failed Delivery',
        body: [
          'Couriers usually attempt delivery 1–3 times. Please ensure someone is available at the delivery address and that your phone is reachable.',
          'If delivery fails because of wrong/incomplete address, customer refusal (other than damaged shipment), or repeated unavailability, the shipment may return to origin (RTO).',
          'For RTO caused by customer-side reasons, refunds (if applicable) may be processed after we receive the product back, and outbound/return shipping costs may be deducted as per policy.',
          'If the package appears tampered or damaged at the doorstep, please refuse delivery and ask the courier to mark it as damaged, then notify us with photos immediately.',
        ],
      },
      {
        heading: '8. Address Changes',
        body: [
          'Address changes are possible only before dispatch. After dispatch, changes depend on courier capability and may not be guaranteed.',
          `Request changes quickly by emailing ${SUPPORT_EMAIL} with your Order ID and the corrected address.`,
        ],
      },
      {
        heading: '9. International Shipping',
        body: [
          'Unless explicitly stated on the website, Fusora currently ships within India only. International orders are not accepted by default.',
        ],
      },
      {
        heading: '10. Contact',
        body: [
          `Shipping support: ${SUPPORT_EMAIL}`,
          `Company: ${COMPANY_NAME} · ${SITE_URL}`,
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
          `This Policy explains when you can cancel an order placed on ${SITE_DOMAIN}, when ${COMPANY_NAME} may cancel an order, and how refunds are handled after cancellation.`,
        ],
      },
      {
        heading: '2. Customer-Initiated Cancellation',
        body: [
          'You may request cancellation of an order before it is shipped / handed to the courier, by writing to ' +
            SUPPORT_EMAIL +
            ' with your Order ID and registered mobile/email.',
          'Cancellation requests are processed on business days. If the order is already packed or in the handover queue, cancellation may not be possible.',
          'Once an order is shipped, it cannot be cancelled online. You may refuse delivery at the doorstep (subject to courier rules) or raise a return after delivery as per the Return & Refund Policy, if eligible.',
          'Partial cancellation of multi-item orders may be allowed only if those items have not been packed/shipped and stock systems permit; otherwise the full order status will apply.',
        ],
      },
      {
        heading: '3. Instant / Auto Cancellation Cases',
        body: [
          'Orders may be auto-cancelled if payment is not completed within the gateway timeout (for prepaid orders), if COD verification fails, or if duplicate orders are detected.',
          'In prepaid payment-pending cases, unused authorisations are released by the payment provider as per their timelines.',
        ],
      },
      {
        heading: '4. Company-Initiated Cancellation',
        body: [
          `${COMPANY_NAME} reserves the right to cancel orders in situations including but not limited to: product out of stock; quality hold; pricing or promotional error; incomplete or unverifiable address; suspected fraud or misuse of payment instruments; failure of OTP/account verification where required; or restrictions under law.`,
          'If we cancel an order after payment, we will initiate a refund of the amount received for that order (excluding non-refundable charges only where clearly disclosed and legally permissible).',
        ],
      },
      {
        heading: '5. Refunds on Cancellation',
        body: [
          'For prepaid orders cancelled before dispatch and approved by us, a full refund of the product amount (and shipping charges if collected and not incurred) is generally issued.',
          'Refund initiation typically takes 5–10 business days after cancellation approval. Banks/UPI providers may take additional time to reflect the credit.',
          'For COD orders cancelled before dispatch, no payment is collected; hence no refund is due.',
          'If cancellation is requested after dispatch and the shipment returns to us as RTO due to customer refusal, refund (if any) will follow receipt of the shipment and deduction of applicable logistics costs as communicated.',
        ],
      },
      {
        heading: '6. How to Request Cancellation',
        body: [
          `Email ${SUPPORT_EMAIL} with subject line “Cancel Order – <Order ID>” and include: Order ID, registered phone/email, and reason for cancellation.`,
          'We will confirm whether cancellation succeeded or if the order has already moved to shipped status.',
        ],
      },
      {
        heading: '7. Abuse of Cancellation',
        body: [
          'Frequent cancellations, fraudulent COD refusals, or misuse of promotions may lead to COD restrictions, account review, or refusal of future orders.',
        ],
      },
      {
        heading: '8. Contact',
        body: [
          `Cancellation desk: ${SUPPORT_EMAIL}`,
          `Company: ${COMPANY_NAME} · ${SITE_URL}`,
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
        heading: '1. Purpose & Commitment',
        body: [
          intro('Grievance Redressal Policy'),
          `${COMPANY_NAME} is committed to transparent, fair, and timely resolution of customer grievances relating to Fusora purchases and use of ${SITE_DOMAIN}.`,
          'This Policy outlines the process for raising complaints, escalation levels, timelines, and contact details of our Grievance Officer.',
        ],
      },
      {
        heading: '2. Scope of Grievances',
        body: [
          'This Policy covers complaints regarding: order placement and payment; shipping delays or non-delivery; damaged / defective / wrong products; returns and refunds; cancellations; account access and OTP issues; privacy / personal data concerns; promotional offers and billing discrepancies; and staff / service conduct.',
          'Issues solely attributable to third-party banks, UPI apps, or telecom SMS delivery may require parallel follow-up with those providers; we will still assist within our control.',
        ],
      },
      {
        heading: '3. Level 1 — Customer Support',
        body: [
          `As a first step, please contact Fusora Customer Support at ${SUPPORT_EMAIL}.`,
          'Include: your full name; registered email and mobile; Order ID (if applicable); clear description of the issue; relevant dates; and supporting documents/photos/screenshots.',
          'Acknowledgement: we aim to acknowledge grievances within 48 hours on business days.',
          'Resolution target: most Level-1 issues are resolved within 7 business days. Complex cases involving courier investigation, payment chargebacks, or warehouse QC may take up to 14 business days or longer with interim updates.',
        ],
      },
      {
        heading: '4. Level 2 — Grievance Officer Escalation',
        body: [
          'If you are not satisfied with the Level-1 response, or if you do not receive a response within the stated timelines, you may escalate to our Grievance Officer.',
          `Grievance Officer Name: ${GRIEVANCE_OFFICER}`,
          `Email: ${GRIEVANCE_EMAIL}`,
          `Company: ${COMPANY_NAME}`,
          `Website: ${SITE_URL}`,
          'Please mark the subject as “Escalation – Grievance Officer” and attach your previous support ticket / email thread, Order ID, and a summary of the unresolved issue.',
          'The Grievance Officer (or a delegated team under the Officer’s supervision) will review the matter and provide a decision / action plan as soon as practicable, and in any event within timelines required under applicable Indian laws and platform guidelines.',
        ],
      },
      {
        heading: '5. Information We May Need',
        body: [
          'To investigate effectively we may request: proof of purchase; payment reference; unboxing videos; package photos showing AWB labels; bank statements (masked) for refund tracing; and ID verification for account-related issues.',
          'Failure to provide reasonably requested information may delay or limit resolution.',
        ],
      },
      {
        heading: '6. Frivolous or Abusive Complaints',
        body: [
          'We reserve the right to decline or close grievances that are abusive, threatening, repetitive without new facts, or filed in bad faith. However, genuine consumer concerns will always be examined on merits.',
        ],
      },
      {
        heading: '7. External Remedies',
        body: [
          'If you remain dissatisfied after the Grievance Officer’s final response, you may pursue remedies available under the Consumer Protection Act, 2019 (including consumer commissions) or other competent forums under Indian law.',
          'Nothing in this Policy limits your statutory rights as a consumer.',
        ],
      },
      {
        heading: '8. Record Keeping',
        body: [
          'We maintain records of grievances received, actions taken, and outcomes for internal audit, quality improvement, and compliance purposes, for periods consistent with applicable law and our retention practices.',
        ],
      },
      {
        heading: '9. Policy Updates',
        body: [
          'We may revise this Grievance Redressal Policy periodically. The updated version will be published on this page with a revised effective date.',
        ],
      },
      {
        heading: '10. Contact Summary',
        body: [
          `Support (Level 1): ${SUPPORT_EMAIL}`,
          `Grievance Officer (Level 2): ${GRIEVANCE_OFFICER} · ${GRIEVANCE_EMAIL}`,
          `Company: ${COMPANY_NAME}`,
          `Website: ${SITE_URL}`,
          `Effective date: ${POLICY_EFFECTIVE_DATE}.`,
        ],
      },
    ],
  },
]

export function getPolicy(slug: string | undefined) {
  return policies.find((p) => p.slug === slug)
}
