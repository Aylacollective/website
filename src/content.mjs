// ─────────────────────────────────────────────────────────────
// AYLA Collective: every line of copy on the site lives here.
// *word* renders as the red Instrument Serif italic accent.
// [PLACEHOLDER] values render as clearly marked placeholder chips.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: 'AYLA Collective',
  short: 'AYLA',
  email: 'hello@aylacollective.co',
  url: 'https://aylacollective.co', // DEPLOY STEP: confirm the live domain
  description:
    'AYLA Collective connects content, paid advertising, websites, and lead follow-up into one growth system for automotive, hospitality, and service businesses.',
  // Form handling. Leave empty for the preview (nothing is sent).
  // Set to a form service URL (Formspree, Netlify Forms, a CRM webhook) to go live.
  formEndpoint: '',
  // Booking link for step 3 of the contact form. [CONFIRM] AYLA's Cal.com link.
  bookingUrl: '',
  // Accent color: 'champagne' | 'ice' | 'pearl' | 'clay' | 'red'
  palette: 'ice',
};

export const nav = [
  { id: 'services', label: 'Services' },
  { id: 'industries', label: 'Industries' },
  { id: 'work', label: 'Work' },
  { id: 'approach', label: 'Approach' },
  { id: 'about', label: 'About' },
  { id: 'insights', label: 'Insights' },
];

export const cta = { label: 'Get a growth diagnosis', id: 'contact' };

// ── The four pillars ─────────────────────────────────────────
export const pillars = [
  {
    n: '01',
    id: 'create',
    name: 'Create',
    promise: 'Make attention worth earning.',
    leak: 'Content that reaches people who will never buy.',
    body: 'A strong idea should look as good as it performs. We bring strategy, production, and distribution together so every film, photograph, and post has a job to do.',
    items: ['Brand content', 'Commercial video', 'Short-form video', 'Photography', 'Creator content direction', 'Ad creative and testing', 'Content and social strategy'],
    connects: 'Gives Acquire creative worth paying to show, gives Convert pages worth staying on, and gives Automate something worth sending.',
    question: 'Does your creative give people a reason to care?',
    motif: 'viewfinder',
  },
  {
    n: '02',
    id: 'acquire',
    name: 'Acquire',
    promise: 'Put it in front of people who can buy.',
    leak: 'Spend that buys clicks instead of customers.',
    body: 'Reach is cheap. The right reach is not. We plan where your budget goes around the customers you actually want, the areas you actually serve, and the outcomes you actually count.',
    items: ['Paid social', 'Paid search', 'Local and map visibility', 'Retargeting', 'Budget and bidding strategy', 'Audience and offer testing'],
    connects: 'Runs on creative from Create, sends traffic to pages built by Convert, and hands every inquiry straight to Automate.',
    question: 'Is your spend reaching people who can actually buy?',
    motif: 'radar',
  },
  {
    n: '03',
    id: 'convert',
    name: 'Convert',
    promise: 'Give every visitor a next step.',
    leak: 'Traffic that lands, looks around, and leaves.',
    body: 'A website is a salesperson that never sleeps, or a brochure nobody reads. We build pages with one clear job: turn interest into a booked appointment, a reservation, or a request.',
    items: ['Websites', 'Landing pages', 'Offers and booking flows', 'Conversion testing', 'Tracking and attribution setup'],
    connects: 'Turns Acquire traffic into inquiries, carries Create content at full quality, and feeds every lead into Automate.',
    question: 'Does your site give visitors a clear next step?',
    motif: 'page',
  },
  {
    n: '04',
    id: 'automate',
    name: 'Automate',
    promise: 'Answer first. Follow up always.',
    leak: 'Leads that go cold before anyone calls back.',
    body: 'The space between an inquiry and a useful reply is part of the customer experience. We build follow-up that answers in seconds, books the next step, and keeps customers coming back.',
    items: ['Instant lead response', 'CRM setup', 'Text and email follow-up', 'Missed-call text-back', 'Reviews and retention flows', 'Revenue reporting'],
    connects: 'Closes the loop on every lead Acquire and Convert produce, and tells Create which messages actually bring customers back.',
    question: 'How fast does a new lead hear back from you?',
    motif: 'reply',
  },
];

// ── Industries ───────────────────────────────────────────────
export const industries = [
  {
    id: 'automotive',
    name: 'Automotive',
    who: 'Dealerships, detailers, and auto service',
    pains: [
      'Internet leads sit for hours before anyone replies.',
      'Ad spend chases clicks, not test drives or booked service.',
      'Your inventory and offers look like the store down the road.',
    ],
    build: 'Video that sells the store, campaigns tied to appointments, and instant follow-up on every inquiry.',
    h1: 'More test drives. Fewer cold *leads.*',
    sub: 'Content, ads, websites, and follow-up for dealerships, detailers, and auto service shops, built as one system that ends in an appointment.',
    system: {
      create: 'Walkaround and inventory video, service lane content, and team spotlights that make the store feel worth the drive.',
      acquire: 'Local campaigns built around your inventory, service specials, and trade-ins, aimed at the radius you actually sell in.',
      convert: 'Vehicle and service pages that book a test drive or appointment in a few taps.',
      automate: 'Instant replies to every internet lead, appointment reminders, and service follow-up that brings cars back.',
    },
    faq: [
      ['Do you work with franchise and independent stores?', 'Yes. We build around your brand requirements and the tools your store already uses.'],
      ['Can you connect follow-up to our CRM?', 'In most cases, yes. Part of the diagnosis is mapping the tools you already use, so follow-up runs inside the systems your team already works in.'],
      ['Do you market the service department too?', 'Yes. Service is often where retention and repeat revenue live, so it is usually part of the plan.'],
    ],
    media: 'automotive',
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    who: 'Restaurants, hotels, and venues',
    pains: [
      'Beautiful rooms and plates. Flat photos.',
      'Bookings depend on platforms that take a cut.',
      'Guests come once and never hear from you again.',
    ],
    build: 'Content people want to share, direct booking paths, and follow-up that brings guests back.',
    h1: 'Full tables. Booked rooms. *Return* guests.',
    sub: 'Content, ads, websites, and follow-up for restaurants, hotels, and venues, built to fill seats directly and bring guests back.',
    system: {
      create: 'Food, room, and event content that makes people want to be there tonight.',
      acquire: 'Local reach for the nights you need filled, your events, and your seasonal offers.',
      convert: 'A direct booking and reservation path, so fewer guests go through platforms that take a cut.',
      automate: 'Confirmations, reminders, review requests, and return-visit offers that run on their own.',
    },
    faq: [
      ['Can you help us rely less on third-party booking platforms?', 'That is often a priority. We build a direct booking path and give guests a reason to use it.'],
      ['Do you shoot the content yourselves?', 'Yes. Creative direction and production are part of Create, from food and rooms to events and team.'],
      ['We are a single location. Is this for us?', 'Yes. The system scales down as well as up. A venue with full weekends and empty weeknights has a clear leak to work on.'],
    ],
    media: 'hospitality',
  },
  {
    id: 'services',
    name: 'Service businesses',
    who: 'Home services, clinics, studios, and local pros',
    pains: [
      'The customer hires whoever replied first.',
      'You pay for leads that were never a fit.',
      'Nights and weekends go unanswered.',
    ],
    build: 'Local visibility, a site that books the job, and replies that go out in seconds, day or night.',
    h1: 'Be the first reply. Win the *job.*',
    sub: 'Content, ads, websites, and follow-up for home services and local pros, built so every inquiry gets an answer in seconds, day or night.',
    system: {
      create: 'Before-and-after content, crew and process video, and proof that builds trust in seconds.',
      acquire: 'Local search, map visibility, and paid campaigns in the areas you serve.',
      convert: 'A site built to book the job: clear services, honest pricing cues, and a quote form that works on a phone.',
      automate: 'Instant text replies, missed-call text-back, estimate follow-up, and review requests.',
    },
    faq: [
      ['We already get leads from platforms. Can you help?', 'Yes. The fastest win is often replying faster to the leads you already pay for, then building your own lead flow so you depend on platforms less.'],
      ['What if we cannot answer the phone on a job site?', 'That is what Automate is for. Missed calls get a text back in seconds, and every inquiry gets a useful reply, day or night.'],
      ['Do you work only in our service area?', 'Yes. Campaigns and visibility are built around the areas you actually serve.'],
    ],
    media: 'services',
  },
];

// ── The customer journey (services page strip) ───────────────
export const journey6 = [
  ['Attention', 'Creative and distribution earn the attention of the right audience.', 'Content reaches people who will never become customers.'],
  ['Leads', 'Clear offers and pages turn interest into an inquiry.', 'Visitors look around and leave without a way to act.'],
  ['Follow-up', 'Every inquiry gets a fast, useful reply.', 'Leads wait hours and go cold.'],
  ['Customers', 'Conversations become appointments and sales.', 'No one owns the handoff, so deals stall.'],
  ['Retention', 'Customers hear from you after the first visit.', 'One purchase, then silence.'],
  ['Revenue', 'Repeat business and referrals compound.', 'Nothing is measured, so no one knows what worked.'],
];

// ── The 8-stage journey (approach page diagram) ──────────────
export const journey8 = [
  ['Attention', 'Creative blends in, so the right people scroll past.'],
  ['Traffic', 'Clicks come from people who were never going to buy.'],
  ['Lead', 'Visitors land, look around, and leave without a way to act.'],
  ['Response', 'Inquiries wait hours for a reply and go cold.'],
  ['Appointment', 'Leads say yes, then never show up.'],
  ['Sale', 'No one owns the handoff, so conversations stall.'],
  ['Repeat customer', 'One purchase, then silence.'],
  ['Referral', 'Happy customers are never asked to share.'],
];

// ── Process ──────────────────────────────────────────────────
export const steps = [
  {
    n: '01', name: 'Diagnose',
    body: 'We map the whole journey, from first impression to repeat visit, and find where attention, leads, or revenue are slipping.',
    get: 'A written growth diagnosis: the leak, the fix, and the order to do it in.',
    time: '[PLACEHOLDER] timing',
  },
  {
    n: '02', name: 'Build',
    body: 'We build only what the diagnosis calls for: the content, the campaigns, the pages, the follow-up.',
    get: 'A connected system, tested end to end before it goes live.',
    time: '[PLACEHOLDER] timing',
  },
  {
    n: '03', name: 'Launch',
    body: 'Everything goes live together, tracked from the first click to the closed sale.',
    get: 'One view of what is working, in plain numbers.',
    time: '[PLACEHOLDER] timing',
  },
  {
    n: '04', name: 'Optimize',
    body: 'We watch the numbers that matter, fix the next constraint, then scale what works.',
    get: 'A monthly review and a clear next move.',
    time: 'Ongoing',
  },
];

export const pullQuote =
  'If a business already generates enough leads but responds too slowly, buying more traffic does not solve the real problem.';

export const principles = [
  ['Strategy before services', 'We diagnose the problem before prescribing the solution.'],
  ['Revenue over vanity metrics', 'Views and clicks matter only when they contribute to real business outcomes.'],
  ['Creative and performance together', 'Brand quality and measurable growth should not be separate disciplines.'],
  ['Systems that compound', 'The goal is not another temporary campaign. The goal is infrastructure that keeps creating value.'],
];

export const founders = [
  {
    name: 'Ayaan', role: 'Co-founder', initial: 'A',
    bio: '[PLACEHOLDER] Two-sentence bio: background, focus area, and what Ayaan owns at AYLA.',
    linkedin: '',
  },
  {
    name: 'Luqmaan', role: 'Co-founder', initial: 'L',
    bio: '[PLACEHOLDER] Two-sentence bio: background, focus area, and what Luqmaan owns at AYLA.',
    linkedin: '',
  },
];

export const stats = [
  ['[X]%', 'faster lead response'],
  ['[X]x', 'return on ad spend'],
  ['[X]%', 'more booked appointments'],
  ['[X]', 'businesses connected'],
];

export const cases = [
  {
    slug: 'nodaysoff',
    client: 'NoDaysOff',
    industry: 'Apparel brand',
    url: 'https://stevenodaysoff.com',
    about: 'An apparel brand built for the consistent: hoodies, sets, and accessories for people who show up every day.',
    challenge: '[PLACEHOLDER] The challenge NoDaysOff came to us with.',
    system: '[PLACEHOLDER] What we built for NoDaysOff.',
    metrics: [['[X]%', 'result one'], ['[X]%', 'result two'], ['[X]x', 'result three']],
    media: 'nodaysoff',
  },
];

export const testimonials = [
  { quote: '[PLACEHOLDER] Client quote goes here. One or two sentences about the result, in their own words.', name: '[Name]', role: '[Role], [Business]' },
  { quote: '[PLACEHOLDER] Client quote goes here. One or two sentences about what changed after working together.', name: '[Name]', role: '[Role], [Business]' },
  { quote: '[PLACEHOLDER] Client quote goes here. One or two sentences about speed, clarity, or results.', name: '[Name]', role: '[Role], [Business]' },
  { quote: '[PLACEHOLDER] Client quote goes here. One or two sentences about the team and the process.', name: '[Name]', role: '[Role], [Business]' },
];

export const faqs = [
  ['Who do you work with?', 'Automotive, hospitality, and service businesses that already spend on marketing and want to know where it is leaking. Dealerships, detailers, restaurants, hotels, venues, and local service pros.'],
  ['Do I need all four services?', 'No. We diagnose first and only recommend what moves your numbers. Some clients start with follow-up alone. Others need the full system.'],
  ['What does the diagnosis include?', 'A look at your whole journey: traffic, conversion, response time, close rate, retention, and customer value. You get a written summary of where revenue is slipping, what to fix first, and what it should be worth.'],
  ['How fast can we start?', 'As soon as we have talked. The first call tells us whether we are a fit, and the diagnosis starts right after. Build timelines depend on what the diagnosis calls for.'],
  ['How do you report results?', 'In plain numbers tied to revenue: leads, response time, appointments, sales, and cost per customer. You always know what is working and what comes next.'],
  ['How is pricing structured?', 'There are no generic packages. Pricing follows the plan the diagnosis produces, so you only pay for what your business needs. We walk you through it on the first call.'],
];

// ── Leak calculator assumptions (planning assumptions, not industry statistics) ──
export const calc = {
  responseOptions: [
    // label, share of leads lost vs a 5-minute reply (working assumption)
    ['5 min', 0.0],
    ['30 min', 0.1],
    ['1 hour', 0.18],
    ['4 hours', 0.3],
    ['Next day', 0.45],
  ],
  followUpLift: 0.25, // relative lift in closes from consistent follow-up
  followUpCoverage: 0.5, // share of that lift assumed missing today
  targetRepeat: 0.35, // repeat-purchase rate a connected retention flow aims for
  repeatValue: 0.5, // a repeat purchase assumed worth half a first purchase
  defaults: { leads: 200, response: 3, close: 15, value: 1500, repeat: 20 },
};

// ── Insights (article drafts for AYLA to review) ─────────────
export const insights = [
  {
    slug: 'more-leads-broken-sales-process',
    cat: 'Growth',
    title: 'Why More Leads Won’t Fix a Broken Sales Process',
    dek: 'Before increasing acquisition, look at what happens to the opportunities you already have.',
    read: '4 min',
    body: [
      ['', 'When growth slows, the first instinct is to buy more of it. More ads, more traffic, more leads. Sometimes that is the right move. Often it is the most expensive way to avoid looking at what happens after someone raises their hand.'],
      ['Start after the click', 'Map the path from inquiry to conversation to customer. Write down who answers a new lead, how long it takes, what the customer hears first, and what is supposed to happen next. Most businesses have never seen this path drawn out end to end.'],
      ['', 'Look for three things: unclear ownership, unanswered questions, and missing next steps. A lead that belongs to everyone belongs to no one. A question that goes unanswered becomes a reason to call a competitor. A conversation with no next step ends on its own.'],
      ['Give every lead a next step', 'Start the fix at the handoff. Decide who responds, what they need to know before they reply, and how the next action gets recorded. Then make the first reply fast and useful, even when nobody is at a desk.'],
      ['Then buy more attention', 'Once the handoff works, more leads become more customers instead of more waste. That is when acquisition starts to compound, and every dollar of spend has somewhere useful to land.'],
    ],
  },
  {
    slug: 'cost-of-slow-lead-response',
    cat: 'Automation',
    title: 'The Real Cost of Slow Lead Response',
    dek: 'The space between an inquiry and a useful reply is part of the customer experience.',
    read: '4 min',
    body: [
      ['', 'A customer who fills out a form or calls after hours is ready to act right now. Every hour they wait, their attention drifts to the next option, the next search result, the business that answered first.'],
      ['The wait is part of the experience', 'We tend to think of the customer experience as starting at the appointment or the sale. It starts at the first reply. A fast, useful answer says the business is organized and wants the work. Silence says the opposite.'],
      ['Speed alone is not enough', 'An instant reply that says nothing is barely better than no reply. The first message should answer the obvious question, confirm what happens next, and make booking easy. Speed earns the attention. Usefulness keeps it.'],
      ['Nights and weekends', 'For many businesses, the leads that arrive outside working hours are the ones that go coldest. An automated first reply, followed by a real person at the start of the next day, closes most of that gap.'],
      ['Measure it', 'Track the time from inquiry to first reply, and from first reply to booked appointment. Those two numbers usually explain more about lost revenue than any ad report.'],
    ],
  },
  {
    slug: 'creative-performance-variable',
    cat: 'Creative',
    title: 'Creative Is a Performance Variable',
    dek: 'What people see influences whether they care enough to take the next step.',
    read: '3 min',
    body: [
      ['', 'Targeting decides who sees an ad. Creative decides whether they stop. Two campaigns with the same budget and the same audience can produce very different results, and the difference is usually what was on the screen.'],
      ['Treat creative like a test', 'Plan creative in sets, not one-offs. Change one thing at a time: the opening second, the offer, the person on camera, the format. Keep what wins and retire what does not.'],
      ['Make it specific', 'Generic footage of a generic business tells people nothing. Show the actual store, the actual dish, the actual crew. Specific creative earns trust faster than polished creative that could belong to anyone.'],
      ['Connect it to the rest', 'The best ad still needs a page that matches its promise and a follow-up that keeps the conversation going. Creative performs best when it is built for the journey it starts.'],
    ],
  },
  {
    slug: 'ai-search-local-discovery',
    cat: 'SEO',
    title: 'Make Your Business Easier to Find',
    dek: 'Clear service descriptions and consistent business details give potential customers a useful starting point.',
    read: '3 min',
    body: [
      ['', 'People find local businesses through maps, search results, review sites, and increasingly through AI assistants that summarize what is out there. All of them depend on the same thing: clear, consistent information about what you do and where you do it.'],
      ['Say what you do, plainly', 'Describe each service in the words customers use, on its own page, with the areas you serve. Vague pages are hard for people to trust and hard for search tools to understand.'],
      ['Keep the details consistent', 'Your name, address, phone, hours, and categories should match everywhere they appear. Small inconsistencies make it harder for customers and search tools to be sure they found the right business.'],
      ['Earn and answer reviews', 'Recent reviews, with real responses from the business, are one of the clearest signals a potential customer sees. Make asking for them part of your follow-up.'],
    ],
  },
  {
    slug: 'find-growth-funnel-leaks',
    cat: 'Strategy',
    title: 'How to Know Where Your Growth Funnel Is Leaking',
    dek: 'A diagnostic view of the entire journey, from attention to repeat business.',
    read: '5 min',
    body: [
      ['', 'Every business has a journey: someone notices you, visits, inquires, hears back, books, buys, comes back, and tells a friend. Revenue leaks wherever one of those steps breaks.'],
      ['Measure each stage', 'You do not need perfect data. Rough numbers for traffic, inquiries, response time, appointments, sales, and repeat customers are enough to see where the drop-off is sharpest.'],
      ['Find the constraint', 'The constraint is the stage that limits everything after it. If plenty of people inquire but few hear back quickly, response is the constraint, and more traffic will not help.'],
      ['Fix one thing first', 'Improving the wrong stage wastes the right resources. Pick the constraint, define what better looks like, fix it, and measure again. Then move to the next one.'],
      ['Repeat', 'Growth comes from working through the journey in order, not from working on everything at once. Each fix makes the next one more valuable.'],
    ],
  },
  {
    slug: 'paid-media-connected-system',
    cat: 'Paid Media',
    title: 'Paid Media Needs More Than a Media Plan',
    dek: 'The offer, destination, and follow-up are part of the campaign.',
    read: '4 min',
    body: [
      ['', 'A media plan decides where the budget goes. It does not decide what happens when someone clicks. That part is usually where campaigns win or lose.'],
      ['The offer is part of the ad', 'People respond to a clear reason to act now. A strong offer makes average targeting work. A weak offer makes great targeting expensive.'],
      ['The destination is part of the ad', 'Send people to a page that continues the exact conversation the ad started, with one clear next step. A homepage is rarely that page.'],
      ['The follow-up is part of the ad', 'A lead from a paid campaign has a real cost. Replying in minutes instead of hours protects that spend more than any bidding change.'],
      ['Judge it on revenue', 'Clicks and cost per lead are useful signals, but the real question is cost per customer. Connect the campaign to what happens after the click and that number becomes visible.'],
    ],
  },
];

export const insightCats = ['All', 'Growth', 'Creative', 'Paid Media', 'Automation', 'SEO', 'Strategy'];

// Stock footage credits (filled in when stock is added). [title, source, url]
export const credits = [];
