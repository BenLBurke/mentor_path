import { CareerPath } from "./types";

export const CAREER_PATHS: CareerPath[] = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    category: "Technology",
    description:
      "Design, build, and maintain software applications and systems that solve real-world problems.",
    dayInLife:
      "You start the day reviewing code from teammates, then spend a few hours building a new feature. After lunch, you debug an issue a user reported, pair with a colleague on a tricky problem, and end the day planning tomorrow's work.",
    skills: ["Problem solving", "Programming", "Teamwork", "Math", "Communication"],
    education: "Bachelor's in CS (or self-taught/bootcamp)",
    salaryRange: "$75k–$200k+",
    timeToEntry: "2–4 years",
    relatedPaths: ["data-scientist", "ux-designer", "product-manager"],
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    category: "Technology",
    description:
      "Analyze large datasets to find patterns, build predictive models, and help organizations make better decisions.",
    dayInLife:
      "You pull data from several sources, clean it up, and explore trends. You build a model to predict customer behavior, present findings to stakeholders, and iterate based on feedback.",
    skills: ["Statistics", "Programming", "Data visualization", "Critical thinking", "Communication"],
    education: "Bachelor's or Master's in Data Science, Statistics, or related field",
    salaryRange: "$80k–$180k+",
    timeToEntry: "2–5 years",
    relatedPaths: ["software-engineer", "financial-analyst", "product-manager"],
  },
  {
    id: "doctor-general",
    title: "Medical Doctor (General)",
    category: "Healthcare",
    description:
      "Diagnose and treat illnesses, promote health, and guide patients through medical decisions.",
    dayInLife:
      "You see patients in clinic, review test results, consult with specialists, perform procedures, and document everything. Some days include emergencies that require quick thinking.",
    skills: ["Science", "Empathy", "Decision making", "Stamina", "Communication"],
    education: "Bachelor's + Medical School + Residency (11+ years total)",
    salaryRange: "$200k–$400k+",
    timeToEntry: "11–15 years",
    relatedPaths: ["chiropractor", "nurse-practitioner", "phd-researcher"],
  },
  {
    id: "chiropractor",
    title: "Chiropractor",
    category: "Healthcare",
    description:
      "Treat musculoskeletal issues through spinal adjustments and holistic care — no blood, no surgery.",
    dayInLife:
      "You meet with patients, assess their posture and pain, perform adjustments, recommend exercises, and educate on wellness. Most chiropractors own their practice and manage the business side too.",
    skills: ["Anatomy", "Manual dexterity", "Empathy", "Business skills", "Communication"],
    education: "Bachelor's + Doctor of Chiropractic (7–8 years)",
    salaryRange: "$70k–$150k+",
    timeToEntry: "7–8 years",
    relatedPaths: ["doctor-general", "physical-therapist", "nurse-practitioner"],
  },
  {
    id: "physical-therapist",
    title: "Physical Therapist",
    category: "Healthcare",
    description:
      "Help people recover from injuries, surgeries, and chronic conditions through movement and exercise.",
    dayInLife:
      "You assess patients' mobility, create treatment plans, guide exercises, track progress, and coordinate with doctors. You see real improvement in people over weeks and months.",
    skills: ["Anatomy", "Patience", "Motivation", "Problem solving", "Physical fitness"],
    education: "Bachelor's + Doctor of Physical Therapy (7 years)",
    salaryRange: "$70k–$100k+",
    timeToEntry: "7 years",
    relatedPaths: ["chiropractor", "doctor-general", "sports-coach"],
  },
  {
    id: "financial-analyst",
    title: "Financial Analyst",
    category: "Business & Finance",
    description:
      "Evaluate investments, analyze financial data, and help businesses or individuals make smart money decisions.",
    dayInLife:
      "You build financial models in spreadsheets, research market trends, write reports for stakeholders, and present recommendations. Earnings season keeps things exciting.",
    skills: ["Math", "Excel/modeling", "Research", "Communication", "Attention to detail"],
    education: "Bachelor's in Finance, Economics, or Accounting",
    salaryRange: "$60k–$120k+",
    timeToEntry: "2–4 years",
    relatedPaths: ["data-scientist", "lawyer", "accountant"],
  },
  {
    id: "lawyer",
    title: "Lawyer",
    category: "Business & Finance",
    description:
      "Advise and represent individuals or organizations on legal matters, from contracts to courtrooms.",
    dayInLife:
      "You research case law, draft documents, meet with clients, negotiate settlements, and occasionally argue in court. Specializations range from corporate law to criminal defense.",
    skills: ["Critical thinking", "Writing", "Public speaking", "Research", "Negotiation"],
    education: "Bachelor's + Law School (7 years) + Bar Exam",
    salaryRange: "$70k–$200k+",
    timeToEntry: "7–8 years",
    relatedPaths: ["financial-analyst", "professor", "policy-analyst"],
  },
  {
    id: "ux-designer",
    title: "UX Designer",
    category: "Creative & Design",
    description:
      "Design how people interact with apps, websites, and products — making technology intuitive and enjoyable.",
    dayInLife:
      "You interview users, sketch wireframes, build prototypes in Figma, run usability tests, and collaborate with engineers to bring designs to life.",
    skills: ["Empathy", "Visual design", "Prototyping", "Research", "Communication"],
    education: "Bachelor's in Design, HCI, or self-taught with portfolio",
    salaryRange: "$65k–$150k+",
    timeToEntry: "1–4 years",
    relatedPaths: ["software-engineer", "product-manager", "graphic-designer"],
  },
  {
    id: "graphic-designer",
    title: "Graphic Designer",
    category: "Creative & Design",
    description:
      "Create visual content — logos, branding, marketing materials, and digital art — that communicates ideas.",
    dayInLife:
      "You meet with clients to understand their vision, sketch concepts, refine designs in Adobe Creative Suite, and present options. Freelance designers also handle business development.",
    skills: ["Visual arts", "Typography", "Color theory", "Software tools", "Creativity"],
    education: "Bachelor's in Graphic Design or strong portfolio",
    salaryRange: "$45k–$90k+",
    timeToEntry: "1–4 years",
    relatedPaths: ["ux-designer", "animator", "art-director"],
  },
  {
    id: "nurse-practitioner",
    title: "Nurse Practitioner",
    category: "Healthcare",
    description:
      "Provide primary and specialty healthcare — diagnose, prescribe, and treat patients with more autonomy than an RN.",
    dayInLife:
      "You see patients independently, order tests, diagnose conditions, prescribe medication, and educate on prevention. Many NPs specialize in pediatrics, psych, or family medicine.",
    skills: ["Clinical knowledge", "Empathy", "Decision making", "Communication", "Resilience"],
    education: "BSN + Master's or Doctorate in Nursing (6–8 years)",
    salaryRange: "$90k–$150k+",
    timeToEntry: "6–8 years",
    relatedPaths: ["doctor-general", "chiropractor", "physical-therapist"],
  },
  {
    id: "product-manager",
    title: "Product Manager",
    category: "Technology",
    description:
      "Define what gets built and why — bridge the gap between business goals, user needs, and engineering teams.",
    dayInLife:
      "You analyze user feedback, prioritize features, write product specs, coordinate with design and engineering, and track metrics to measure success.",
    skills: ["Strategy", "Communication", "Data analysis", "Empathy", "Leadership"],
    education: "Bachelor's in any field + experience in tech",
    salaryRange: "$90k–$180k+",
    timeToEntry: "3–6 years",
    relatedPaths: ["software-engineer", "ux-designer", "data-scientist"],
  },
  {
    id: "professor",
    title: "University Professor",
    category: "Education",
    description:
      "Teach at the college level, conduct research, publish findings, and mentor the next generation.",
    dayInLife:
      "You prepare and deliver lectures, hold office hours, grade papers, write research papers, apply for grants, and attend department meetings. Summers are often dedicated to research.",
    skills: ["Expertise in field", "Teaching", "Writing", "Research", "Public speaking"],
    education: "PhD in your field (8–12 years post-high school)",
    salaryRange: "$60k–$150k+",
    timeToEntry: "8–12 years",
    relatedPaths: ["phd-researcher", "lawyer", "policy-analyst"],
  },
  {
    id: "phd-researcher",
    title: "PhD Researcher",
    category: "Education",
    description:
      "Push the boundaries of human knowledge through deep, focused research in a specialized field.",
    dayInLife:
      "You design experiments, collect and analyze data, read papers, write publications, present at conferences, and collaborate with other researchers. It's intellectually demanding but deeply rewarding.",
    skills: ["Critical thinking", "Writing", "Statistics", "Persistence", "Creativity"],
    education: "Bachelor's + PhD (9–12 years)",
    salaryRange: "$50k–$120k+",
    timeToEntry: "9–12 years",
    relatedPaths: ["professor", "data-scientist", "doctor-general"],
  },
  {
    id: "sports-coach",
    title: "Sports Coach",
    category: "Sports & Athletics",
    description:
      "Train athletes, develop game strategies, and build team culture — from youth leagues to professional sports.",
    dayInLife:
      "You plan practices, coach during games, review film, recruit players, manage team dynamics, and handle administrative duties. Relationships with players and their development are the core of the job.",
    skills: ["Sport knowledge", "Leadership", "Communication", "Strategy", "Motivation"],
    education: "Bachelor's in Sports Science, Kinesiology, or related + coaching experience",
    salaryRange: "$30k–$150k+ (varies widely by level)",
    timeToEntry: "2–6 years",
    relatedPaths: ["physical-therapist", "athletic-trainer", "teacher"],
  },
];

export function getCareerById(id: string): CareerPath | undefined {
  return CAREER_PATHS.find((c) => c.id === id);
}

export function getCareersByCategory(): Record<string, CareerPath[]> {
  const grouped: Record<string, CareerPath[]> = {};
  for (const career of CAREER_PATHS) {
    if (!grouped[career.category]) grouped[career.category] = [];
    grouped[career.category].push(career);
  }
  return grouped;
}
