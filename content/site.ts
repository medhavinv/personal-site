/**
 * Single source of truth for all site copy and data.
 *
 * Edit anything visitor-facing here: headings, paragraphs, links, timeline
 * entries, flip cards, the AI system prompt, and so on. Components read from
 * this file only, so copy changes never require touching component code.
 *
 * Voice rules (keep these when editing): plain, complete sentences, first
 * person, no em-dashes, no punchy fragments, no bragging or ad-speak.
 */

export type PaletteName = "Indigo" | "Sage" | "Clay" | "Plum" | "Mono";
export const PALETTES: PaletteName[] = ["Indigo", "Sage", "Clay", "Plum", "Mono"];
export const DEFAULT_PALETTE: PaletteName = "Indigo";

/* ------------------------------------------------------------------ Brand */

export const brand = {
  name: "Vin Vadhanasindhu",
  role: "Product Manager",
};

/* -------------------------------------------------------------------- Nav */
/* Section ids observed for active-link highlighting: top, journey, role,
   work, teaching, projects, contact. The assistant is a floating widget, so
   there is no "Ask" link. */

export const navItems: { id: string; label: string }[] = [
  { id: "journey", label: "Journey" },
  { id: "role", label: "Approach" },
  { id: "work", label: "Work" },
  { id: "teaching", label: "Teaching" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export const sectionIds = [
  "top",
  "journey",
  "role",
  "work",
  "teaching",
  "projects",
  "contact",
];

/* ------------------------------------------------------------------- Hero */

export const hero = {
  // The word wrapped in {accent} is rendered in the accent color.
  headingBefore: "Technical ",
  headingAccent: "&",
  headingAfter: " strategic product manager.",
  lead: "Hi there! I'm Vin, a product manager who likes technical platforms and ambiguous product problems. I've worked at large tech companies like Microsoft, Lyft, and Asana, and more recently I've been building in the startup space. I love building tools that help people do their work more efficiently, across data platforms, legal tech and compliance, and developer tools.",
  primaryCta: { label: "See my work ↓", href: "#work" },
  secondaryCta: { label: "Get in touch →", href: "#contact" },
  facts: [
    { label: "Role", value: "Staff Product Manager" },
    { label: "Based", value: "Seattle, USA" },
    { label: "From", value: "Bangkok, Thailand" },
  ],
};

/* ---------------------------------------------------------------- Journey */

export type City = {
  id: string;
  name: string;
  country: string;
  kicker: string;
  years: string;
  text: string;
  link: string;
  linkLabel: string;
  lat: number;
  lng: number;
  labelPos: "top" | "bottom";
};

export const journey = {
  kicker: "01 · Journey",
  heading: "From Thailand to Canada and the US.",
  // Route drawn through cities in life order.
  routeOrder: ["bangkok", "toronto", "sf", "seattle"],
  defaultCity: "seattle",
};

export const cities: City[] = [
  {
    id: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    kicker: "Where it started",
    years: "Home",
    text: "I grew up here and still call it home. I come back each year to teach for a week at Chulalongkorn University.",
    link: "#teaching",
    linkLabel: "See teaching →",
    lat: 13.7563,
    lng: 100.5018,
    labelPos: "bottom",
  },
  {
    id: "toronto",
    name: "Toronto",
    country: "Canada",
    kicker: "Studied & first built",
    years: "2012 – 2014",
    text: "I earned a B.A.Sc. in Computer Engineering (Honors) at the University of Toronto, on the Dean's List every semester. I started my career as a software developer at Motorola Solutions, writing C and C++.",
    link: "#work",
    linkLabel: "See work →",
    lat: 43.6532,
    lng: -79.3832,
    labelPos: "top",
  },
  {
    id: "sf",
    name: "San Francisco",
    country: "USA",
    kicker: "Scaled infra",
    years: "2018 – 2022",
    text: "I was a Senior Technical PM at Lyft and then Asana, leading infrastructure, data platforms, and developer velocity for products used by millions.",
    link: "#work",
    linkLabel: "See work →",
    lat: 37.7749,
    lng: -122.4194,
    labelPos: "bottom",
  },
  {
    id: "seattle",
    name: "Seattle",
    country: "USA",
    kicker: "Now",
    years: "2022 – now",
    text: "I worked at Modern Treasury and Vanta, and most recently as a Staff PM at Atlan, where I build compliance platforms, integrations, and AI infrastructure.",
    link: "#work",
    linkLabel: "See work →",
    lat: 47.6062,
    lng: -122.3321,
    labelPos: "top",
  },
];

/* --------------------------------------------------------------- Approach */

export type Facet = {
  id: string;
  label: string;
  blurb: string;
  proof: string;
};

export const approach = {
  kicker: "02 · The role",
  heading: "What does a product manager actually do?",
  intro:
    "A PM turns technical and business judgment, data, and customer insight into strategy, execution, and alignment, so the work reaches customers as real impact.",
  defaultFacet: "technical",
};

export const facets: Facet[] = [
  {
    id: "technical",
    label: "Technical depth",
    blurb:
      "Knowing the architecture, systems, and constraints well enough to collaborate with engineers and make credible tradeoffs.",
    proof:
      "I started out writing C and C++ at Motorola, and I have stayed close to the technical work ever since, from company-wide Kubernetes at Lyft to AI infrastructure at Atlan.",
  },
  {
    id: "strategy",
    label: "Business & strategy",
    blurb:
      "Connecting every product bet to revenue, cost, and where the company is headed, then choosing what to build and, harder, what to skip.",
    proof:
      "I keep what we ship tied to real business value. At Vanta I built the customization capabilities that let customers create their own custom integrations and tests, opening Vanta up to large enterprise customers and new markets. Earlier I drove multi-million-dollar savings at Lyft and Microsoft.",
  },
  {
    id: "insight",
    label: "Data & customer insight",
    blurb: "Shaping the roadmap around real metrics and real user problems.",
    proof:
      "Built Office's experimentation and telemetry platforms at Microsoft, and shaped Vanta's integration platform and industry-first custom tests through user interviews and design-partner research.",
  },
  {
    id: "execution",
    label: "Execution & alignment",
    blurb:
      "Turning strategy into product that ships fast and holds up, with leadership, engineering, design, and go-to-market rowing in the same direction.",
    proof:
      "I drove GDPR compliance across Microsoft Office, coordinating a 5,000-person organization to deliver data delete and export rights. I also get products to market fast, like working with the team to ship 200+ integrations in six months at Vanta and cutting build-and-deploy time from days to minutes at Atlan.",
  },
];

/* ------------------------------------------------------------------- Work */

export type Role = {
  id: string;
  co: string;
  title: string;
  loc: string;
  years: string;
  tags: string[];
  summary: string;
  bullets: string[];
  metrics: string[];
};

export const work = {
  kicker: "03 · Professional work",
  heading: "A decade of shipping.",
  // "Education" has no dedicated chip; it shows under "All" only.
  filters: ["All", "AI", "Compliance", "Data", "Dev Tools", "Infra"],
  defaultOpenRole: "atlan",
};

export const roles: Role[] = [
  {
    id: "atlan",
    co: "Atlan",
    title: "Staff Product Manager, Builder Experience",
    loc: "Seattle",
    years: "2025 – 2026",
    tags: ["AI", "Data", "Dev Tools", "Infra"],
    summary:
      "Led strategy and roadmap for AI infrastructure and AI agent interfaces, plus the developer tools, frameworks, and CLI that sit on top of Atlan's data platform.",
    bullets: [
      "Led strategy and roadmap for AI infrastructure, AI agent interfaces, developer tools, frameworks, and CLI, which reduced app and integration build and deployment time from days to minutes.",
    ],
    metrics: ["Days → minutes", "AI agent interfaces"],
  },
  {
    id: "vanta",
    co: "Vanta",
    title: "Senior Product Manager, Integrations & Compliance Platform",
    loc: "Seattle",
    years: "2023 – 2024",
    tags: ["AI", "Compliance", "Data", "Infra"],
    summary:
      "Owned strategy for the automated evidence collection platform and launched the industry's first custom tests and integrations, using AI to make test remediation faster.",
    bullets: [
      "Defined and executed product strategy for Vanta's automated evidence collection platform, driving cross-functional alignment across leadership, engineering, and design.",
      "Led 0-to-1 discovery and launch of the industry's first custom tests and integrations, letting customers run any audit on Vanta and driving market expansion.",
      "Revamped the tests page with Design, driving a net +20% customer satisfaction and up to a 10% boost in audit evidence generated within the first hour.",
      "Led research, interviews, and partner collaboration to shape the integration platform, adding 200+ integrations in 6 months to cement Vanta's integrations lead.",
    ],
    metrics: ["+20% CSAT", "200+ integrations", "0→1 launch"],
  },
  {
    id: "mt",
    co: "Modern Treasury",
    title: "Senior Product Manager, Foundations",
    loc: "Seattle",
    years: "2022 – 2023",
    tags: ["Compliance", "Dev Tools", "Infra"],
    summary:
      "Roadmaps for infrastructure, security, compliance, and developer tooling in fintech.",
    bullets: [
      "Partnered with banks and sales to assess the monetization, business, and product implications of higher reliability and new financial compliance standards.",
      "Defined roadmaps for Modern Treasury's infrastructure, security, compliance, and software development tools.",
    ],
    metrics: ["Fintech compliance", "Bank partnerships"],
  },
  {
    id: "asana",
    co: "Asana",
    title: "Senior Product Manager, Infrastructure",
    loc: "San Francisco",
    years: "2020 – 2022",
    tags: ["Dev Tools", "Infra"],
    summary:
      "Made the Asana app scale for enterprise customers by owning performance and load times: defining the thresholds that mattered and building the tooling around them.",
    bullets: [
      "Owned the vision and roadmap for making the Asana app scale for enterprise customers, focused on performance and load times.",
      "Defined strategy by correlating app performance with business impact through research (NPS, churn, competitive analysis) and drove company-wide alignment on the thresholds that mattered.",
      "Reduced performance complaints by 75% through performance improvements, management frameworks, and the tooling built around them.",
      "Mentored PMs and engineering leads and helped define infrastructure PM roles and responsibilities.",
    ],
    metrics: ["−75% perf complaints", "Mentored PMs"],
  },
  {
    id: "lyft",
    co: "Lyft",
    title: "Senior Technical PM, Infrastructure & Data",
    loc: "San Francisco",
    years: "2018 – 2020",
    tags: ["Data", "Dev Tools", "Infra"],
    summary:
      "Led company-wide cost reduction and Kubernetes adoption, and owned data ingestion and storage platforms.",
    bullets: [
      "Led a company-wide initiative to reduce hosting costs by millions, developing execution frameworks, quantitative forecasting methodologies, and shared goals.",
      "Ensured alignment across senior leadership (CEO, VP Engineering) by validating key metrics and communicating progress, risks, and strategic pivots.",
      "Drove company-wide Kubernetes adoption for all Lyft services and owned the roadmap for the Kubernetes compute platform.",
      "Defined metrics, scope, and execution for Lyft's data ingestion and storage platforms and led trade-off analyses across AWS, GCP, and in-house.",
    ],
    metrics: ["Millions saved", "Company-wide K8s"],
  },
  {
    id: "msft",
    co: "Microsoft",
    title: "PM II, Office Data & Experimentation Platform",
    loc: "Redmond",
    years: "2014 – 2018",
    tags: ["Compliance", "Data", "Dev Tools", "Infra"],
    summary:
      "Delivered GDPR data rights, $2.1M in infra savings, and telemetry and feedback systems across Office.",
    bullets: [
      "Crystallized GDPR requirements, drove cross-functional dependencies, and designed data systems to enable GDPR data delete and export rights.",
      "Saved $2.1M in data infrastructure cost by streamlining the platform and designing the UX for cost-control and analytics tools.",
      "Spearheaded the vision, roadmap, and execution for an in-app feedback system and diagnostic telemetry across all Office applications.",
      "Boosted pipeline data quality by designing new APIs, metrics, dashboards, and alerts.",
    ],
    metrics: ["$2.1M saved", "GDPR rights"],
  },
  {
    id: "motorola",
    co: "Motorola Solutions",
    title: "Jr. Software Developer",
    loc: "Toronto",
    years: "2012 – 2013",
    tags: ["Infra"],
    summary: "Engineered C and C++ applications for input peripherals and scanners.",
    bullets: [
      "Engineered C and C++ applications for input peripherals and scanners.",
      "Moderated, authored, and edited the company innovation blog and newsletter.",
    ],
    metrics: ["C / C++"],
  },
  {
    id: "uoft",
    co: "University of Toronto",
    title: "B.A.Sc. Computer Engineering (Honors), Minor in Engineering Business",
    loc: "Toronto",
    years: "2008 – 2012",
    tags: ["Education"],
    summary:
      "This is where my technical foundation started: engineering by training and business by minor.",
    bullets: [
      "On the Dean's Honors List for all semesters; ranked as high as 2nd of 171 in the program.",
      "Graduated with a 3.78 / 4.00 GPA and a Minor in Engineering Business.",
    ],
    metrics: ["GPA 3.78 / 4.00", "Dean's List, all terms", "Rank 2 / 171"],
  },
];

/* --------------------------------------------------------------- Teaching */

export type Flashcard = { front: string; back: string };

export const teaching = {
  kicker: "04 · Teaching",
  heading: "One week a year, back in the classroom.",
  // {strong} marks the phrase rendered in medium weight.
  paragraphs: [
    "One week each year I go back to Bangkok to teach in the {strong}LLBel program at Chulalongkorn University{/strong}, an intensive bootcamp for law students. I cover product management, design thinking, and how the tech industry works, so future lawyers and regulators understand the systems they will advise on and regulate.",
    "Four years running now. It works the same muscle as product work: taking something complex and making it click for someone else.",
  ],
  widgetTitle: "A flavor of the bootcamp",
  galleryLabel: "From the classroom",
};

export const flashcards: Flashcard[] = [
  {
    front: "Who did you teach, and what did the course cover?",
    back: "I taught first-year law students in the LLBel program at the Faculty of Law, Chulalongkorn University. The course introduced product management, business strategy, experimentation, technology companies, and basic coding concepts through practical, interactive activities.",
  },
  {
    front: "Why should law students learn business and technology?",
    back: "Future lawyers will increasingly advise, regulate, and work with technology companies. Understanding how these companies build products, make decisions, and respond to incentives helps students give practical legal advice and design more effective regulation.",
  },
  {
    front: "How did you make technical concepts accessible to law students?",
    back: "I focused on structured thinking rather than technical jargon or memorization. Students learned through discussions, simulations, group exercises, and real-world scenarios that connected business, technology, law, and public policy.",
  },
  {
    front: "What did students gain from the course?",
    back: "Students developed practical skills in strategic thinking, problem solving, teamwork, and decision making. They also gained the confidence to engage with technical and commercial issues, even without a background in business or computer science.",
  },
];

// Teaching photos are user-supplied. Drop images into /public/teaching and
// set the `src` fields below; until then each tile shows the placeholder.
export type TeachingPhoto = { id: string; src: string | null; alt: string };
export const teachingPhotos: TeachingPhoto[] = [
  { id: "teach1", src: null, alt: "Teaching at Chulalongkorn University" },
  { id: "teach2", src: null, alt: "Classroom session" },
  { id: "teach3", src: null, alt: "Group exercise with students" },
  { id: "teach4", src: null, alt: "Students at the bootcamp" },
];

/* --------------------------------------------------------------- Projects */

export type Build = {
  name: string;
  meta: string;
  desc: string;
  link?: string;
};

export const projects = {
  kicker: "05 · Things I've built",
  heading: "Things I've built.",
  intro:
    "A mix of side projects, university work, and things I shipped on the job. Patents, platforms, and tools I built to close a real gap.",
};

export const builds: Build[] = [
  {
    name: "LawCU 2026",
    meta: "Teaching platform · Chulalongkorn University",
    desc: "A platform I built to teach AI to law graduate students at Chulalongkorn. With about 400 students, it had to hold up with roughly 400 people using it at once.",
    link: "https://lawcu2026.perthcha.com/",
  },
  {
    name: "Estimated Tax",
    meta: "Side project · Web app",
    desc: "A tool I built to fill a gap I kept hitting when filing my own quarterly estimated taxes.",
    link: "https://estimated-tax.vercel.app/",
  },
  {
    name: "Real-Time Telemetry Monitoring",
    meta: "Patent · WO/2020/027931",
    desc: "A granted patent for a real-time telemetry monitoring tool, filed 2018 during my time in industry.",
  },
  {
    name: "Distributed Learning System",
    meta: "University of Toronto · Java",
    desc: "A university project: a distributed system that syncs writing and drawing across devices for real-time collaborative learning.",
  },
  {
    name: "Priority Go!",
    meta: "Microsoft Hackathon · C#",
    desc: "A Windows app that recommends the optimal sequence of places to visit, using user input and live Bing Maps data.",
  },
  {
    name: "NLU Chat Bot",
    meta: "Microsoft Hackathon · C# · LUIS",
    desc: "A chatbot that understands natural-language input and conversational context, built on Microsoft LUIS.",
  },
];

/* ---------------------------------------------------------------- Contact */

export const contact = {
  kicker: "06 · Contact",
  heading: "Let's build something.",
  intro:
    "Have an ambiguous, technically deep problem that needs a versatile PM? I would love to hear about it.",
  linkedinUrl: "https://www.linkedin.com/in/medhavin-vadhanasindhu/",
  linkedinHandle: "/in/medhavin-vadhanasindhu",
  based: "Seattle, USA · open to relocation",
  successHeading: (name: string) => `Thanks, ${name}.`,
  successBody: "I'll get back to you soon.",
};

/* ------------------------------------------------------------------- Chat */

export const chat = {
  launcherLabel: "Ask about me",
  panelTitle: "Ask-Vin assistant",
  inputPlaceholder: "Ask about Vin's experience…",
  welcome:
    "Hi! I'm an AI assistant trained on Vin's resume. Ask me anything about his background, experience, or skills.",
  suggested: [
    "What is his most technical experience?",
    "What's his biggest cost-saving win?",
    "Has he shipped compliance products?",
    "Tell me about his AI experience.",
  ],
  // Fallbacks never surface an email address.
  errorReply:
    "I couldn't reach the assistant right now. You can reach Vin via LinkedIn.",
  emptyReply:
    "Sorry, I couldn't generate a response. Please reach out to Vin on LinkedIn.",
};

// System prompt for the AI assistant. Copied verbatim from the prototype's
// this.aiContext and used server-side in app/api/ask/route.ts only.
export const aiContext =
  "You are a friendly, concise assistant on the personal website of Vin Vadhanasindhu, a technical and strategic Product Manager. Answer visitor and recruiter questions about Vin in 2 to 4 sentences, warm and professional, using ONLY the facts below. Write in plain, complete sentences the way Vin himself would: clear and direct, first person is fine, no dashes and no punchy sentence fragments. If something is not covered, say you don't have that detail and suggest reaching out to Vin on LinkedIn. Do not invent facts.\n\nFACTS ABOUT VIN:\n- Based in Seattle, USA. Grew up in Bangkok, Thailand. Fluent in Thai and English. No visa sponsorship required for US, Canadian, or Thai employment. Open to relocation.\n- Education: B.A.Sc. in Computer Engineering (Honors), Minor in Engineering Business, University of Toronto. GPA 3.78/4.00, Dean's List every semester, highest rank 2 of 171.\n- Has a patent: Real-Time Telemetry Monitoring Tool (WO/2020/027931), filed 2018.\n- Roles: Staff PM Builder Experience at Atlan (2025-2026) leading AI infrastructure, AI agent interfaces, dev tools, frameworks, and CLI, cutting build/deploy time from days to minutes. Senior PM Integrations & Compliance at Vanta (2023-2024): owned automated evidence collection, launched industry-first custom tests and integrations, +20% CSAT, added 200+ integrations in 6 months. Senior PM Foundations at Modern Treasury (2022-2023): fintech infra, security, compliance, dev tools. Senior PM Infrastructure at Asana (2020-2022): developer velocity (build, CI/CD, observability, internal APIs, experimentation), reduced performance complaints by 75%, mentored PMs. Senior Technical PM Infra & Data at Lyft (2018-2020): cut hosting costs by millions, drove company-wide Kubernetes adoption, owned data ingestion/storage platforms. PM II at Microsoft (2014-2018): GDPR data delete/export rights across Office, saved $2.1M in data infra cost, built telemetry and in-app feedback systems. Jr Software Developer at Motorola Solutions (2012-2013): C and C++ for scanners.\n- Teaching: returns to Bangkok for one week each year to teach in the LLBel program at Chulalongkorn University, a bootcamp for law students, four years running (a recurring guest role, not full-time).\n- Strengths: technical depth (started as an engineer), product strategy, 0-to-1 launches, infrastructure, data platforms, compliance (GDPR, SOC 2), AI products, developer tools, and versatility across domains.";

/* ----------------------------------------------------------------- Footer */

export const footer = {
  left: "Vin Vadhanasindhu · Product Manager",
};
