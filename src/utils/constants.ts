import { JobRole, ResumeProfile } from '../types';

export const JOB_ROLES: JobRole[] = [
  {
    id: 'frontend-dev',
    title: 'Frontend Developer',
    description: 'Build responsive, accessible user interfaces using React, TypeScript, CSS, and modern web APIs.',
    skills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML5', 'Next.js', 'Redux', 'REST APIs', 'Performance Optimization'],
    difficulty: 'Intermediate',
    iconName: 'Layout',
    category: 'Engineering',
  },
  {
    id: 'fullstack-dev',
    title: 'Full Stack Developer',
    description: 'Design end-to-end applications spanning React frontends, Node/Python backends, APIs, and databases.',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Express', 'MongoDB', 'Docker', 'GraphQL', 'System Architecture'],
    difficulty: 'Intermediate',
    iconName: 'Layers',
    category: 'Engineering',
  },
  {
    id: 'java-dev',
    title: 'Java Developer',
    description: 'Develop enterprise-grade microservices, REST APIs, and backend solutions using Spring Boot and Java.',
    skills: ['Java', 'Spring Boot', 'Microservices', 'Hibernate/JPA', 'SQL', 'Kafka', 'JUnit', 'Maven', 'Design Patterns'],
    difficulty: 'Advanced',
    iconName: 'Coffee',
    category: 'Engineering',
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    description: 'Transform complex datasets into actionable business insights using SQL, Python, Excel, and visualization tools.',
    skills: ['SQL', 'Python', 'Tableau', 'Power BI', 'Excel', 'Pandas', 'Statistics', 'Data Cleaning', 'A/B Testing'],
    difficulty: 'Intermediate',
    iconName: 'BarChart2',
    category: 'Data',
  },
  {
    id: 'customer-support',
    title: 'Customer Support Executive',
    description: 'Deliver empathetic, solutions-oriented support across tickets, live chat, and voice channels while de-escalating conflicts.',
    skills: ['Customer Empathy', 'Conflict Resolution', 'Zendesk', 'Active Listening', 'Written Communication', 'CRM', 'Troubleshooting', 'SLA Management'],
    difficulty: 'Beginner',
    iconName: 'Headphones',
    category: 'Operations',
  },
  {
    id: 'uiux-designer',
    title: 'UI/UX Designer',
    description: 'Create user journeys, wireframes, high-fidelity prototypes, design systems, and conduct usability research.',
    skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability Testing', 'Interaction Design', 'Accessibility'],
    difficulty: 'Intermediate',
    iconName: 'Palette',
    category: 'Design',
  },
];

export const SKILL_KEYWORDS = [
  'React', 'Vue', 'Angular', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS',
  'Node.js', 'Express', 'Python', 'Django', 'FastAPI', 'Java', 'Spring Boot', 'Spring', 'Hibernate', 'C#', '.NET',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST APIs', 'Docker', 'Kubernetes',
  'AWS', 'Azure', 'GCP', 'Git', 'CI/CD', 'GitHub Actions', 'Jenkins', 'Microservices', 'Kafka', 'Linux',
  'SQL', 'Pandas', 'NumPy', 'Tableau', 'Power BI', 'Excel', 'Data Modeling', 'Data Cleaning', 'Statistics',
  'Snowflake', 'BigQuery', 'A/B Testing', 'Data Storytelling',
  'Figma', 'UI/UX', 'Wireframing', 'Prototyping', 'User Research', 'Design Systems', 'Usability Testing',
  'Interaction Design', 'Accessibility', 'WCAG', 'Design Thinking', 'Information Architecture',
  'Communication', 'Problem Solving', 'Leadership', 'Agile', 'Scrum', 'Team Collaboration',
  'Conflict Resolution', 'Customer Empathy', 'Zendesk', 'Intercom', 'Salesforce', 'CRM', 'SLA Management',
  'Active Listening', 'Troubleshooting', 'Jira', 'Unit Testing', 'Jest', 'Cypress', 'Vite', 'Redux', 'WebSockets'
];

export const DEFAULT_TIPS = [
  {
    title: 'Use the STAR Method',
    description: 'Structure answers with Situation, Task, Action, and Result to convey impact clearly and concisely.',
    category: 'Framework',
  },
  {
    title: 'Clarify Requirements First',
    description: 'In technical & system design questions, spend 30 seconds confirming edge cases before answering.',
    category: 'Strategy',
  },
  {
    title: 'Articulate Trade-offs',
    description: 'Strong candidates explicitly discuss memory vs. latency or speed vs. maintainability.',
    category: 'Technical',
  },
  {
    title: 'Practice Concise Pace',
    description: 'Aim for answers between 60 to 90 seconds. Be structured and avoid rambling.',
    category: 'Voice',
  },
];

export const SAMPLE_RESUME_PROFILES: Record<string, ResumeProfile> = {
  softwareEngineer: {
    fileName: 'Alex_Chen_Software_Engineer.pdf',
    fileSize: 148200,
    uploadedAt: new Date().toISOString(),
    candidateName: 'Alex Chen',
    email: 'alex.chen@example.com',
    skills: [
      'React', 'TypeScript', 'JavaScript', 'Node.js', 'Next.js', 'Tailwind CSS',
      'PostgreSQL', 'REST APIs', 'Git', 'Docker', 'Unit Testing', 'Agile'
    ],
    education: [
      'B.S. in Computer Science — University of Washington (2020 - 2024)',
    ],
    experienceYears: 2.5,
    experienceSummary: [
      'Frontend Software Engineer at FinTech Labs: Built responsive client dashboard serving 45,000 active users.',
      'Software Engineering Intern at CloudPulse: Developed automated REST endpoints and optimized bundle size by 32%.',
      'Capstone Project: Developed real-time collaborative workspace with WebSocket synchronization.',
    ],
    topMatchedRoles: ['Frontend Developer', 'Full Stack Developer'],
    estimatedMatchScore: 84,
    rawText: `Alex Chen
alex.chen@example.com | (555) 234-5678 | Seattle, WA

SUMMARY
Results-driven Software Engineer with 2+ years of experience specializing in React, TypeScript, and modern frontend architecture. Passionate about building accessible, performant user interfaces with clean state management.

EDUCATION
Bachelor of Science in Computer Science
University of Washington | 2020 - 2024 | GPA: 3.8

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, HTML5, CSS3, SQL, Python
Frameworks & Libraries: React 18, Next.js, Node.js, Express, Tailwind CSS, Redux Toolkit
Tools & Platforms: Git, GitHub Actions, Docker, PostgreSQL, REST APIs, Jest, Vite

PROFESSIONAL EXPERIENCE
Frontend Software Engineer | FinTech Labs | 2024 - Present
• Engineered multi-tenant dashboard in React and TypeScript, decreasing page load latency by 28%.
• Refactored design system components in Tailwind CSS, accelerating team feature velocity.
• Integrated client-side state caching with React Query, decreasing redundant network requests.

Software Engineering Intern | CloudPulse | Summer 2023
• Built micro-frontend widgets and integrated secure authentication flows.
• Authored comprehensive unit tests with Jest and React Testing Library (90% test coverage).`
  },
  dataAnalyst: {
    fileName: 'Maya_Patel_Data_Analyst.pdf',
    fileSize: 132400,
    uploadedAt: new Date().toISOString(),
    candidateName: 'Maya Patel',
    email: 'maya.patel@example.com',
    skills: [
      'SQL', 'Python', 'Tableau', 'Power BI', 'Excel', 'Pandas', 'Statistics',
      'Data Modeling', 'A/B Testing', 'Communication', 'Problem Solving'
    ],
    education: [
      'B.S. in Statistics & Data Analytics — Purdue University (2020 - 2024)'
    ],
    experienceYears: 2,
    experienceSummary: [
      'Junior Data Analyst at RetailMetrics: Built automated Power BI dashboards and analyzed marketing funnels.',
      'Research Analyst at University Lab: Modeled regression datasets using Python Pandas and Scikit-learn.'
    ],
    topMatchedRoles: ['Data Analyst', 'Business Intelligence Analyst'],
    estimatedMatchScore: 88,
    rawText: `Maya Patel
maya.patel@example.com | (555) 987-6543 | Chicago, IL

SUMMARY
Analytical and detail-oriented Data Analyst with proficiency in SQL, Python, Tableau, and business data visualization. Proven ability to translate raw transactional data into actionable executive insights.

EDUCATION
B.S. in Statistics & Data Analytics | Purdue University | 2020 - 2024

SKILLS
Analysis & Code: SQL, Python (Pandas, NumPy), Excel (Advanced, PowerQuery), Statistics
BI & Visualization: Tableau, Power BI, Google Data Studio, Data Storytelling
Business: A/B Testing, Funnel Conversion Analysis, Customer Segmentation

EXPERIENCE
Junior Data Analyst | RetailMetrics Inc. | 2024 - Present
• Designed 14 interactive Tableau executive dashboards monitoring $12M quarterly revenue.
• Wrote optimized SQL queries across Snowflake data warehouses to track weekly customer churn.
• Conducted cohort retention analysis identifying 15% increase in repeated customer purchases.`
  }
};
