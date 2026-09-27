// Single source of truth for every word on the site. Sources: latest resume, SSRN, GitHub repos.

export const GH = "https://github.com/PranayTadakamalla"

export const profile = {
  name: "Sai Pranay Tadakamalla",
  first: "Sai Pranay",
  last: "Tadakamalla",
  roles: ["AI Researcher", "Founder & CEO", "Engineer", "Poet"],
  tagline: "I build systems that listen, learn and escape the obvious.",
  location: "Hyderabad, India",
  email: "pranaytadakamalla@gmail.com",
  phone: "+91 86881 83168",
  resume: "/Sai_Pranay_Tadakamalla_Resume.pdf",
  links: {
    github: GH,
    linkedin: "https://www.linkedin.com/in/sai-pranay-tadakamalla-7570bb1a6/",
    instagram: "https://www.instagram.com/tedious.one",
    orcid: "https://orcid.org/0009-0008-6521-9122",
    ssrn: "https://papers.ssrn.com/sol3/cf_dev/AbsByAuth.cfm?per_id=7869428",
    company: "https://221blabs.com",
  },
}

export const about = {
  lead:
    "Final-year Artificial Intelligence & Machine Learning undergraduate at Malla Reddy University, founder of 221B Labs, and a writer who happens to think in code.",
  body: [
    "My research asks what agents do when the world lies to them — quantum-inspired exploration for escaping deceptive rewards, cooperative multi-agent navigation, speech-based reading support for under-served languages, and the hard memory limits that separate prediction from explanation.",
    "At 221B Labs I turn that curiosity into products: Festora, the ticketing platform behind 5,000+ student tickets, and Pathana Sakthi, an offline read-along tutor that hears children read in Telugu, English and Hindi.",
  ],
  stats: [
    { value: 4, suffix: "", label: "Papers on SSRN" },
    { value: 5000, suffix: "+", label: "Students ticketed on Festora" },
    { value: 8.85, suffix: "", label: "CGPA / 10", decimals: 2 },
    { value: 10, suffix: "+", label: "Workshops led at MLSA" },
  ],
}

export const featuredResearch = {
  title: "Tunnelling Through Deception",
  subtitle: "A quantum-inspired exploration operator for agentic AI",
  role: "Undergraduate Researcher · Dept. of AI & ML, Malla Reddy University",
  guide: "Guide: Manasa Chandupatla",
  period: "2026 – Present",
  summary:
    "Reinforcement-learning agents get lured into deceptive reward traps long before they find the true goal. The Tunnelling Exploration Operator (TEO) lets a DQN agent ‘tunnel’ through the barrier instead of climbing over it — in a classical exponential-decay form and as a simulated 4-qubit variational circuit in PennyLane.",
  details: [
    "15×15 deep-deception grid with a 3-cell barrier ring",
    "40-seed pre-registered study, no interim analysis",
    "Reproducible, tested Python codebase with a live comparative demo",
    "Manuscript in preparation for IEEE submission",
  ],
  results: [
    { label: "Baseline", value: 0.494, tone: "muted" as const },
    { label: "TEO · classical", value: 0.875, tone: "accent" as const },
    { label: "TEO · quantum", value: 0.877, tone: "accent2" as const },
  ],
  pValue: "p < 0.0001",
  link: `${GH}/final-project`,
}

export type Publication = {
  title: string
  authors: string
  year: number
  venue: string
  href: string
  idLabel: string
  topic: string
}

export const publications: Publication[] = [
  {
    title:
      "Heard in Their Own Voice: A Language-Agnostic Framework for AI-Assisted Pronunciation and Reading Support in the World's Under-Served Languages",
    authors: "Tadakamalla, S. P., & Asad, S. M.",
    year: 2026,
    venue: "SSRN",
    href: "https://ssrn.com/abstract=7488098",
    idLabel: "Abstract 7488098",
    topic: "Speech AI",
  },
  {
    title:
      "The Fullness That Remains: Quantum Non-Locality, Mathematical Infinity, and the Search for an Undivided Whole",
    authors: "Tadakamalla, S. P., & Terala, S.",
    year: 2026,
    venue: "SSRN",
    href: "https://doi.org/10.2139/ssrn.7350098",
    idLabel: "10.2139/ssrn.7350098",
    topic: "Philosophy of Physics",
  },
  {
    title: "From Pixels to Paths: Cooperative AI for Autonomous Agricultural Navigation",
    authors: "Tadakamalla, S. P., & Edukoju, G. S.",
    year: 2025,
    venue: "SSRN",
    href: "https://doi.org/10.2139/ssrn.5935575",
    idLabel: "10.2139/ssrn.5935575",
    topic: "Multi-agent Robotics",
  },
  {
    title:
      "A Unified Framework for End-to-End Testing in E-Commerce Applications: Towards AI-Driven Resilience and Automation",
    authors: "Chandupatla, M., Tadakamalla, S. P., Prakash, S. M. R., & Y, D.",
    year: 2025,
    venue: "SSRN",
    href: "https://doi.org/10.2139/ssrn.5602510",
    idLabel: "10.2139/ssrn.5602510",
    topic: "Software Testing",
  },
]

export const venture = {
  name: "221B Labs Private Limited",
  role: "Founder & CEO",
  period: "Mar 2026 – Present",
  note: "Incubated at Malla Reddy University",
  intro:
    "A Hyderabad software company I founded to ship things people actually use. I lead strategy, product, client delivery and hiring, and run an engineering internship programme.",
  products: [
    {
      name: "Festora",
      kind: "Event ticketing platform",
      body:
        "Official ticketing and community partner of Malla Reddy University and DataForge, a Microsoft developer community in Hyderabad. Delivered MALCON ’26 registration and QR check-in for 700+ participants, covering entry and two-day meal passes.",
      metrics: [
        { value: "5,000+", label: "students ticketed" },
        { value: "700+", label: "MALCON ’26 check-ins" },
      ],
      tags: ["QR check-in", "Payments", "Organizer dashboard"],
    },
    {
      name: "Pathana Sakthi",
      kind: "Speech AI read-along tutor",
      body:
        "An offline read-along tutor for Classes 1–10 in Telugu, English and Hindi, aligned to the SCERT curriculum, with teacher, parent and admin dashboards. In-house kid-calibrated Indian voices, a language model and grapheme-to-phoneme conversion; every word is scored through CTC forced alignment.",
      metrics: [
        { value: "3", label: "languages, offline" },
        { value: "150–300", label: "students in SCERT pilot" },
      ],
      tags: ["TTS", "G2P", "CTC alignment", "Android"],
    },
  ],
}

export type TimelineItem = { period: string; title: string; org: string; body: string; kind: string }

export const timeline: TimelineItem[] = [
  {
    period: "Aug 2026",
    title: "2nd Place, Pitch Arena – Ideathon 4.0",
    org: "Malla Reddy University",
    body:
      "Pitched Pathana Sakthi and advanced to Round 2 of the National Entrepreneurship Challenge 2026 by E-Cell, IIT Bombay.",
    kind: "Award",
  },
  {
    period: "Mar 2026 – Present",
    title: "Founder & CEO",
    org: "221B Labs Private Limited",
    body: "Built Festora and Pathana Sakthi; leading product, delivery, hiring and an engineering internship programme.",
    kind: "Venture",
  },
  {
    period: "2026 – Present",
    title: "Undergraduate Researcher",
    org: "Dept. of AI & ML, Malla Reddy University",
    body: "Tunnelling Through Deception — quantum-inspired exploration for agentic AI, under Manasa Chandupatla.",
    kind: "Research",
  },
  {
    period: "Apr 2025 – Oct 2025",
    title: "Vice-President",
    org: "Microsoft Learn Student Chapter, MRU",
    body: "Led a 20-member team that ran 10+ workshops on AI, cloud and software development, reaching 5,000+ students.",
    kind: "Leadership",
  },
  {
    period: "Jan 2025 – Jun 2025",
    title: "Project Manager Intern",
    org: "Pramila Foundation",
    body: "Led the organisation's website and mobile app; feature and UX changes raised user engagement by 85%.",
    kind: "Experience",
  },
  {
    period: "2024 – Present",
    title: "Member",
    org: "Indian Knowledge Systems (IKS) Club, MRU",
    body: "Exploring how traditional Indian knowledge systems meet modern technology.",
    kind: "Club",
  },
  {
    period: "2023 – 2027",
    title: "B.Tech, Artificial Intelligence & Machine Learning",
    org: "Malla Reddy University, Hyderabad",
    body: "CGPA 8.85 / 10. Class XII: Geetanjali Junior College (86.4%). Class X: Kendriya Vidyalaya, Nalgonda (76.8%).",
    kind: "Education",
  },
]

export type Project = {
  name: string
  kind: string
  body: string
  stack: string[]
  category: "AI" | "Research" | "Security" | "Web"
  href?: string
  demo?: string
  highlight?: string
  featured?: boolean
}

export const projects: Project[] = [
  {
    name: "Predictive State ≠ Explanatory State",
    kind: "Theory · Preprint with code",
    body:
      "Proves an exponential memory gap: forecasting a threshold process needs log₂(t+1) bits, but auditing its counterfactual history needs all t. Verified with dual implementations and 572 adversarial trials up to t = 4096.",
    stack: ["Python", "NumPy", "pytest"],
    category: "Research",
    href: `${GH}/predictive-state-not-explanatory-state`,
    highlight: "log t vs t bits",
    featured: true,
  },
  {
    name: "CTI-IDS",
    kind: "Threat intelligence & intrusion detection",
    body:
      "Detects phishing and malware from email text (BERT), network packet sequences (LSTM) and screenshots (CNN), enriched with VirusTotal, URLhaus and Shodan feeds.",
    stack: ["BERT", "LSTM", "CNN", "Next.js", "Python"],
    category: "Security",
    href: `${GH}/CTI-and-IDS-using-BERT-and-LSTM`,
    highlight: "92% BERT accuracy",
    featured: true,
  },
  {
    name: "CertChain",
    kind: "Blockchain credential verification",
    body:
      "QR-coded certificates anchored on a Solidity registry via IPFS. Designed H-PCAE — PCA + autoencoder + entropy selection — to compress 256-dimensional credential records into a 32-byte on-chain fingerprint.",
    stack: ["Solidity", "ethers.js", "IPFS", "PostgreSQL", "Python"],
    category: "Security",
    highlight: "256-d → 32 bytes",
    featured: true,
  },
  {
    name: "ExtractIQ",
    kind: "Engineering-drawing intelligence",
    body:
      "Upload an engineering drawing; a Gemini pipeline extracts specifications with a verification pass, annotates each page and exports a review-ready table, JSON and PDF report.",
    stack: ["Next.js", "Gemini", "MuPDF", "pdf-lib", "Zod"],
    category: "AI",
  },
  {
    name: "Bazinga Labs",
    kind: "LLM code-generation platform",
    body: "Generates code in Python, Java, TypeScript, React, AngularJS and Node.js through a secure, scalable API backend.",
    stack: ["React.js", "Node.js", "LLMs"],
    category: "AI",
  },
  {
    name: "AADHARVA",
    kind: "AI digital hub for rural advancement",
    body: "A multilingual conversational assistant that guides rural users through digital services.",
    stack: ["Next.js", "Python", "Google APIs"],
    category: "AI",
    href: `${GH}/AADHARVA`,
  },
  {
    name: "Quantum Messenger",
    kind: "Quantum encryption simulation",
    body: "Simulates quantum key exchange, encryption and decryption for messaging, with ML-inspired intrusion-detection logic.",
    stack: ["TypeScript", "Express", "Drizzle", "Vite"],
    category: "Security",
    href: `${GH}/QuantumMessenger`,
    demo: "https://quantum-messenger-eta.vercel.app",
  },
  {
    name: "CyberChat",
    kind: "GPT-powered security assistant",
    body: "A cybersecurity advisor chatbot with sign-up, multi-factor authentication and secure sessions.",
    stack: ["React", "Node.js", "MongoDB", "GPT-3.5"],
    category: "Security",
    href: `${GH}/CyberChat`,
    demo: "https://cyberchat-g4ii.onrender.com/",
  },
  {
    name: "MediTrust",
    kind: "Emergency health records · HackPrix S2",
    body: "A patient-controlled mobile app with a ‘break-the-glass’ protocol that lets doctors reach critical records in an emergency.",
    stack: ["React Native", "Expo"],
    category: "Web",
  },
  {
    name: "AgroTrace",
    kind: "Farm-to-fork traceability",
    body: "Traces produce from cultivation to consumer with role-based access for farmers, transporters and retailers, and QR verification.",
    stack: ["JavaScript", "Blockchain concepts"],
    category: "Web",
    href: `${GH}/Agrotrace`,
  },
  {
    name: "Verses in Motion",
    kind: "Interactive scripture visualisation",
    body: "An interactive platform for exploring and visualising verses.",
    stack: ["React", "TypeScript", "Tailwind"],
    category: "Web",
    href: `${GH}/VersesInMotion`,
    demo: "https://verses-in-motion.vercel.app/",
  },
  {
    name: "ZenOrbit",
    kind: "Focus timer",
    body: "A minimalist, distraction-free Pomodoro app for deep-work sessions.",
    stack: ["Next.js", "Tailwind"],
    category: "Web",
    href: `${GH}/ZenOrbit`,
    demo: "https://zen-orbit.vercel.app",
  },
]

export const skills = [
  {
    group: "AI / ML",
    items: ["Reinforcement Learning", "NLP", "LLMs", "Speech Recognition", "TTS & G2P", "Prompt Engineering", "Experimental Design", "PennyLane"],
  },
  {
    group: "Languages & Web",
    items: ["Python", "Java", "TypeScript", "JavaScript", "React", "Next.js", "Node.js", "Express", "Django", "REST APIs"],
  },
  {
    group: "Data, Cloud & Tools",
    items: ["MongoDB", "MySQL", "PostgreSQL", "AWS", "Google Cloud", "Solidity", "CI/CD", "Git", "Postman"],
  },
]

export const certifications = [
  { name: "Reinforcement Learning", issuer: "NPTEL" },
  { name: "Elements of AI", issuer: "University of Helsinki" },
  { name: "Career Essentials in Generative AI", issuer: "Microsoft & LinkedIn" },
  { name: "Introduction to Responsible AI", issuer: "Google" },
  { name: "Managing Projects", issuer: "Project Management Institute" },
  { name: "Career Essentials in Project Management", issuer: "Microsoft" },
  { name: "B2 English", issuer: "Cambridge University" },
]

export const languages = [
  { name: "Telugu", level: "Native" },
  { name: "Hindi", level: "C1 · Full professional" },
  { name: "English", level: "B2 · Professional" },
]

export const quotes = {
  holmes: [
    { text: "It is a capital mistake to theorize before one has data.", source: "Sherlock Holmes, A Scandal in Bohemia" },
    { text: "You see, but you do not observe.", source: "Sherlock Holmes, A Scandal in Bohemia" },
  ],
  kay: { text: "The best way to predict the future is to invent it.", source: "Alan Kay" },
}

export const beyond = {
  intro:
    "Poetry and prose are how I think out loud — the same instinct that makes me chase an elegant proof, or a sentence that lands exactly where it should.",
  hobbies: [
    { name: "Poetry", body: "Compressing a feeling into as few words as it will survive — the most honest optimisation problem I know." },
    { name: "Writing", body: "Essays and long-form reflections on science, philosophy and wholeness; some of them grow into papers." },
    { name: "Teaching", body: "Running workshops and mentoring juniors — explaining an idea is the fastest way to find its holes." },
    { name: "Building", body: "Weekend prototypes that start as ‘what if’ and sometimes end up as companies." },
  ],
}
